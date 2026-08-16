import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { spawn } from 'child_process';
import { validate16Features } from '@/lib/validation/prediction-schema';
import { analyzeContributingFactors } from '@/lib/features/riskScore';
import { HeartDiseasePredictionInput, HeartDiseasePredictionResult, RiskLevel } from '@/types/prediction';

// Fallback Model Weights & Reference Stats in pure TypeScript
// Extracted directly from logistic_regression.pkl for 100% serverless/edge compatibility
const MODEL_COEFS: Record<keyof HeartDiseasePredictionInput, number> = {
  Age: -0.2294,
  Gender: 0.6415,
  Chest_Pain_Type: 0.4305,
  Resting_Blood_Pressure: 0.3062,
  Cholesterol: 0.2279,
  Fasting_Blood_Sugar: -0.2252,
  Resting_ECG_Results: 0.2203,
  Maximum_Heart_Rate: -0.2005,
  Exercise_Induced_Angina: 0.3798,
  Depression_Induced_By_Exercise: -0.181,
  Slope_Of_Peak_Exercise: 0.3331,
  Major_Vessels_Colored_By_Fluoroscopy: 1.0854,
  Thalassemia: 0.6841,
  Risk_Score: -0.0382,
  symptom_severity: 0.4836,
  age_thalach_ratio: -0.2557
};

const MODEL_INTERCEPT = -0.0491;

const FEATURE_MEANS: Record<keyof HeartDiseasePredictionInput, number> = {
  Age: 54.4,
  Gender: 0.68,
  Chest_Pain_Type: 3.15,
  Resting_Blood_Pressure: 131.6,
  Cholesterol: 246.3,
  Fasting_Blood_Sugar: 0.15,
  Resting_ECG_Results: 0.53,
  Maximum_Heart_Rate: 149.6,
  Exercise_Induced_Angina: 0.33,
  Depression_Induced_By_Exercise: 1.04,
  Slope_Of_Peak_Exercise: 1.6,
  Major_Vessels_Colored_By_Fluoroscopy: 0.67,
  Thalassemia: 4.73,
  Risk_Score: 4.0,
  symptom_severity: 3.5,
  age_thalach_ratio: 0.38
};

const FEATURE_STDS: Record<keyof HeartDiseasePredictionInput, number> = {
  Age: 9.0,
  Gender: 0.46,
  Chest_Pain_Type: 0.96,
  Resting_Blood_Pressure: 17.5,
  Cholesterol: 51.8,
  Fasting_Blood_Sugar: 0.35,
  Resting_ECG_Results: 0.52,
  Maximum_Heart_Rate: 22.9,
  Exercise_Induced_Angina: 0.47,
  Depression_Induced_By_Exercise: 1.16,
  Slope_Of_Peak_Exercise: 0.61,
  Major_Vessels_Colored_By_Fluoroscopy: 0.93,
  Thalassemia: 1.93,
  Risk_Score: 2.0,
  symptom_severity: 2.5,
  age_thalach_ratio: 0.1
};

function runLocalJsInference(features: HeartDiseasePredictionInput) {
  let logit = MODEL_INTERCEPT;
  const keys = Object.keys(MODEL_COEFS) as (keyof HeartDiseasePredictionInput)[];

  for (const key of keys) {
    const val = features[key] as number;
    const mean = FEATURE_MEANS[key];
    const std = FEATURE_STDS[key] || 1.0;
    const scaledVal = (val - mean) / std;
    logit += scaledVal * MODEL_COEFS[key];
  }

  let probability = 1.0 / (1.0 + Math.exp(-logit));
  probability = Math.max(0.01, Math.min(0.99, Number(probability.toFixed(4))));
  const prediction: 0 | 1 = probability >= 0.5 ? 1 : 0;

  let riskLevel: RiskLevel = 'Low';
  if (probability >= 0.7) {
    riskLevel = 'High';
  } else if (probability >= 0.35) {
    riskLevel = 'Moderate';
  }

  return {
    probability,
    prediction,
    riskLevel,
    coefficients: MODEL_COEFS,
    isFallback: true
  };
}

async function runPythonInference(features: HeartDiseasePredictionInput): Promise<{
  probability: number;
  prediction: 0 | 1;
  riskLevel: RiskLevel;
  coefficients?: Record<string, number>;
}> {
  const scriptPath = path.join(process.cwd(), 'src', 'lib', 'data', 'predict.py');

  return new Promise((resolve, reject) => {
    const pythonExecutable = process.platform === 'win32' ? 'python' : 'python3';
    const py = spawn(pythonExecutable, [scriptPath]);

    let outputData = '';
    let errorData = '';

    py.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    py.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    py.on('error', (err) => {
      reject(err);
    });

    py.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(errorData || `Python exited with code ${code}`));
        return;
      }
      try {
        const parsed = JSON.parse(outputData.trim());
        if (parsed.error) {
          reject(new Error(parsed.error));
        } else {
          resolve(parsed);
        }
      } catch (err) {
        reject(new Error(`Failed to parse python output: ${outputData}`));
      }
    });

    // Send input features as JSON to stdin
    py.stdin.write(JSON.stringify({ features }));
    py.stdin.end();
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { features, mode = 'patient', language = 'km' } = body;

    if (!features) {
      return NextResponse.json(
        { error: 'Prediction input features are required' },
        { status: 400 }
      );
    }

    // 1. Validate the 16 features
    const validation = validate16Features(features);
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        {
          error: 'Invalid input feature values',
          details: validation.errors
        },
        { status: 422 }
      );
    }

    const validatedFeatures = validation.data;
    let inferenceResult: {
      probability: number;
      prediction: 0 | 1;
      riskLevel: RiskLevel;
      coefficients?: Record<string, number>;
      isFallback?: boolean;
    };

    // 2. Check external microservice if PREDICTION_API_URL is configured
    const externalApiUrl = process.env.PREDICTION_API_URL;
    if (externalApiUrl) {
      try {
        const externalRes = await fetch(externalApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ features: validatedFeatures, mode, language })
        });
        if (externalRes.ok) {
          const externalData = await externalRes.json();
          inferenceResult = externalData;
        } else {
          throw new Error(`External API responded with status ${externalRes.status}`);
        }
      } catch (externalErr) {
        console.warn('External prediction API failed, trying local inference:', externalErr);
        // Fall through to local inference
      }
    }

    // 3. Run Python script locally or JS fallback
    // @ts-ignore
    if (!inferenceResult) {
      try {
        inferenceResult = await runPythonInference(validatedFeatures);
      } catch (pyErr) {
        console.warn('Python inference unavailable, using JS runtime model:', pyErr);
        inferenceResult = runLocalJsInference(validatedFeatures);
      }
    }

    // 4. Analyze contributing risk factors
    const contributingFactors = analyzeContributingFactors(
      validatedFeatures,
      inferenceResult.coefficients || MODEL_COEFS
    );

    const fullResult: HeartDiseasePredictionResult = {
      probability: inferenceResult.probability,
      prediction: inferenceResult.prediction,
      riskLevel: inferenceResult.riskLevel,
      createdAt: new Date().toISOString(),
      contributingFactors,
      coefficients: inferenceResult.coefficients || MODEL_COEFS,
      features: validatedFeatures,
      mode: mode === 'doctor' ? 'doctor' : 'patient',
      isFallback: inferenceResult.isFallback
    };

    return NextResponse.json({
      success: true,
      result: fullResult
    });
  } catch (error: any) {
    console.error('Error in /api/predict:', error);
    return NextResponse.json(
      {
        error: 'Failed to evaluate cardiovascular risk prediction',
        message: 'An unexpected error occurred during prediction analysis.'
      },
      { status: 500 }
    );
  }
}
