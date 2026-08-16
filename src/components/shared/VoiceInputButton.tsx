'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Mic, MicOff, AlertCircle, Loader2 } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  placeholderHint?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function VoiceInputButton({
  onTranscript,
  className = '',
  placeholderHint,
  size = 'md'
}: VoiceInputButtonProps) {
  const { language } = useLanguage();
  const isKm = language === 'km';

  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  const startListening = () => {
    if (typeof window === 'undefined') return;

    setErrorMessage(null);
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        isKm
          ? 'កម្មវិធីរុករករបស់អ្នកមិនគាំទ្រការបញ្ចូលសំឡេងទេ។ សូមប្រើប្រាស់ Google Chrome ឬ Edge។'
          : 'Voice recognition is not supported in this browser. Please use Chrome or Edge.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isKm ? 'km-KH' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText('');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentInterim) {
          setInterimText(currentInterim);
        }

        if (finalTranscript) {
          onTranscript(finalTranscript.trim());
          setInterimText('');
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setInterimText('');
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setErrorMessage(
            isKm
              ? 'សូមអនុញ្ញាតសិទ្ធិប្រើប្រាស់មីក្រូហ្វូនក្នុងកម្មវិធីរុករករបស់អ្នក។'
              : 'Microphone permission denied. Please allow microphone access in your browser.'
          );
        } else if (event.error === 'no-speech') {
          // Silent timeout
        } else if (event.error === 'network') {
          setErrorMessage(
            isKm
              ? 'បញ្ហាបណ្តាញអ៊ីនធឺណិតក្នុងការបម្លែងសំឡេង។'
              : 'Network error occurred during voice recognition.'
          );
        } else {
          setErrorMessage(
            isKm
              ? `កំហុសក្នុងការកត់ត្រាសំឡេង (${event.error})`
              : `Voice recognition error: ${event.error}`
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      setErrorMessage(err.message || 'Error starting speech recognition');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
      setInterimText('');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return null; // Gracefully hidden if Web Speech API unsupported
  }

  const sizeClasses =
    size === 'sm'
      ? 'p-2 rounded-xl text-xs'
      : size === 'lg'
      ? 'p-3.5 rounded-2xl text-base'
      : 'p-2.5 rounded-xl text-sm';

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleListening}
        aria-label={
          isListening
            ? isKm
              ? 'កំពុងស្តាប់... ចុចដើម្បីបញ្ឈប់'
              : 'Listening... Click to stop recording'
            : isKm
            ? 'ចុចដើម្បីនិយាយរោគសញ្ញា'
            : 'Click to speak symptoms'
        }
        title={
          isListening
            ? isKm
              ? 'កំពុងស្តាប់... (ចុចដើម្បីឈប់)'
              : 'Listening... (Click to stop)'
            : isKm
            ? `និយាយជាភាសាខ្មែរ (km-KH)`
            : `Speak in English (en-US)`
        }
        className={`flex items-center justify-center gap-1.5 font-bold transition-all ${sizeClasses} ${
          isListening
            ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30 shadow-lg shadow-rose-500/40'
            : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 hover:border-teal-300'
        } ${className}`}
      >
        {isListening ? (
          <>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <Mic className="w-4 h-4 text-white" />
            <span className="text-xs font-black hidden sm:inline">
              {isKm ? 'កំពុងស្តាប់...' : 'Listening...'}
            </span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-bold hidden sm:inline">
              {isKm ? 'សំឡេង' : 'Voice'}
            </span>
          </>
        )}
      </button>

      {/* Live Interim Transcript or Error Tooltip */}
      {isListening && interimText && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-full mb-2 left-0 z-30 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-medium backdrop-blur-md border border-slate-700 shadow-xl max-w-xs whitespace-normal animate-fadeIn"
        >
          <span className="text-teal-400 font-bold text-[10px] block uppercase">
            {isKm ? 'អត្ថបទកំពុងនិយាយ៖' : 'Live Speech:'}
          </span>
          "{interimText}"
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="absolute bottom-full mb-2 right-0 z-30 p-2.5 rounded-xl bg-rose-950 text-rose-100 text-xs font-medium border border-rose-800 shadow-xl max-w-xs whitespace-normal flex items-start gap-1.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
