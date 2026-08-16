#!/usr/bin/env python3
"""
Heart Disease Risk Prediction Inference Wrapper
Loads logistic_regression.pkl and evaluates input features.
"""

import sys
import os
import json
import numpy as np

# Feature order expected by the model
FEATURE_NAMES = [
    "Age",
    "Gender",
    "Chest_Pain_Type",
    "Resting_Blood_Pressure",
    "Cholesterol",
    "Fasting_Blood_Sugar",
    "Resting_ECG_Results",
    "Maximum_Heart_Rate",
    "Exercise_Induced_Angina",
    "Depression_Induced_By_Exercise",
    "Slope_Of_Peak_Exercise",
    "Major_Vessels_Colored_By_Fluoroscopy",
    "Thalassemia",
    "Risk_Score",
    "symptom_severity",
    "age_thalach_ratio"
]

# Standard reference statistics (Cleveland dataset + engineered features)
# Used to normalize features before logistic regression
MEANS = np.array([54.4, 0.68, 3.15, 131.6, 246.3, 0.15, 0.53, 149.6, 0.33, 1.04, 1.60, 0.67, 4.73, 4.0, 3.5, 0.38], dtype=np.float64)
STDS = np.array([9.0, 0.46, 0.96, 17.5, 51.8, 0.35, 0.52, 22.9, 0.47, 1.16, 0.61, 0.93, 1.93, 2.0, 2.5, 0.10], dtype=np.float64)

# Replace zero std with 1.0 to prevent division by zero
STDS[STDS == 0] = 1.0

def load_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, "logistic_regression.pkl")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")
    
    try:
        import joblib
        return joblib.load(model_path)
    except Exception:
        import pickle
        with open(model_path, "rb") as f:
            return pickle.load(f)

def run_prediction(features_dict, model=None):
    if model is None:
        model = load_model()
        
    # Extract features in the correct order
    feature_vector = []
    for name in FEATURE_NAMES:
        if name not in features_dict:
            raise ValueError(f"Missing required feature: {name}")
        val = float(features_dict[name])
        feature_vector.append(val)
        
    raw_array = np.array([feature_vector], dtype=np.float64)
    
    # Scale features
    scaled_array = (raw_array - MEANS) / STDS
    
    # Predict using model coefficients or predict_proba
    if hasattr(model, "coef_") and hasattr(model, "intercept_"):
        coef = model.coef_
        intercept = model.intercept_
        logit = np.dot(scaled_array, coef.T) + intercept
        prob = 1.0 / (1.0 + np.exp(-float(logit.ravel()[0])))
    else:
        prob = float(model.predict_proba(scaled_array)[0][1])
        
    prob = max(0.01, min(0.99, prob))
    pred = 1 if prob >= 0.5 else 0
    
    if prob < 0.35:
        risk_level = "Low"
    elif prob < 0.70:
        risk_level = "Moderate"
    else:
        risk_level = "High"
        
    # Build feature coefficients dictionary if available
    coef_dict = {}
    if hasattr(model, "coef_"):
        for name, c in zip(FEATURE_NAMES, model.coef_[0]):
            coef_dict[name] = float(round(c, 4))
            
    return {
        "probability": float(round(prob, 4)),
        "prediction": int(pred),
        "riskLevel": risk_level,
        "coefficients": coef_dict
    }

def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        print("Running internal self-test...")
        model = load_model()
        
        # Test case 1: Healthy
        healthy = {
            "Age": 28, "Gender": 0, "Chest_Pain_Type": 4, "Resting_Blood_Pressure": 110,
            "Cholesterol": 165, "Fasting_Blood_Sugar": 0, "Resting_ECG_Results": 0,
            "Maximum_Heart_Rate": 175, "Exercise_Induced_Angina": 0, "Depression_Induced_By_Exercise": 0.0,
            "Slope_Of_Peak_Exercise": 1, "Major_Vessels_Colored_By_Fluoroscopy": 0, "Thalassemia": 3,
            "Risk_Score": 1.0, "symptom_severity": 0.0, "age_thalach_ratio": 28/175
        }
        r1 = run_prediction(healthy, model)
        print("Healthy Test ->", json.dumps(r1, indent=2))
        assert r1["riskLevel"] == "Low", f"Expected Low, got {r1['riskLevel']}"
        
        # Test case 2: High Risk
        high_risk = {
            "Age": 68, "Gender": 1, "Chest_Pain_Type": 1, "Resting_Blood_Pressure": 165,
            "Cholesterol": 310, "Fasting_Blood_Sugar": 1, "Resting_ECG_Results": 2,
            "Maximum_Heart_Rate": 110, "Exercise_Induced_Angina": 1, "Depression_Induced_By_Exercise": 3.2,
            "Slope_Of_Peak_Exercise": 3, "Major_Vessels_Colored_By_Fluoroscopy": 3, "Thalassemia": 7,
            "Risk_Score": 12.0, "symptom_severity": 9.0, "age_thalach_ratio": 68/110
        }
        r2 = run_prediction(high_risk, model)
        print("High Risk Test ->", json.dumps(r2, indent=2))
        assert r2["riskLevel"] == "High", f"Expected High, got {r2['riskLevel']}"
        
        print("Self-test passed successfully!")
        return

    try:
        # Read from stdin or CLI argument
        if len(sys.argv) > 1 and not sys.argv[1].startswith("-"):
            raw_input = sys.argv[1]
        else:
            raw_input = sys.stdin.read()
            
        if not raw_input.strip():
            print(json.dumps({"error": "No input JSON provided"}))
            sys.exit(1)
            
        data = json.loads(raw_input)
        features = data.get("features", data)
        result = run_prediction(features)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
