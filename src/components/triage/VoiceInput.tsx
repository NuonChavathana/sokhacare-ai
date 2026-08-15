'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { speechHandler } from '@/lib/speech/speech-recognition';
import { Mic, MicOff, Volume2, AlertCircle, Edit3, Send, Info } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null); // null = not yet checked
  const [browserWarning, setBrowserWarning] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [capturedText, setCapturedText] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Client-side only: check support after hydration
  useEffect(() => {
    const supported = speechHandler.isSupported();
    setIsSupported(supported);
    if (!supported) {
      setBrowserWarning(speechHandler.getBrowserWarning());
    }
  }, []);

  useEffect(() => {
    if (isListening) {
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening]);

  const toggleListening = () => {
    if (disabled) return;
    setErrorMsg(null);

    if (isListening) {
      speechHandler.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      setCapturedText(null);
      speechHandler.startListening(
        language,
        (transcript) => {
          setCapturedText(transcript);
          setEditedText(transcript);
          setIsListening(false);
        },
        (err) => {
          setErrorMsg(err);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handleSendCaptured = () => {
    const finalMsg = isEditing ? editedText : capturedText;
    if (finalMsg && finalMsg.trim()) {
      onTranscript(finalMsg.trim());
      setCapturedText(null);
      setIsEditing(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // While we haven't yet checked (SSR safe), show a neutral button
  const voiceReady = isSupported === true;
  const voiceNotSupported = isSupported === false;

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Microphone Button */}
      <button
        type="button"
        onClick={voiceNotSupported ? undefined : toggleListening}
        disabled={disabled || voiceNotSupported}
        title={
          voiceNotSupported
            ? (browserWarning ?? 'Voice not supported')
            : (language === 'km' ? 'ចុចដើម្បីនិយាយ' : 'Tap to speak')
        }
        className={`relative p-3 rounded-full transition-all duration-300 ${
          voiceNotSupported
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
            : isListening
            ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/50 scale-110'
            : 'bg-teal-100 hover:bg-teal-200 active:bg-teal-300 text-teal-800 shadow-sm cursor-pointer'
        }`}
        // Ensure touch events fire on iOS (needed for gesture requirement)
        onTouchStart={() => {}}
      >
        {/* Animated Ripple ring during voice recording */}
        {isListening && (
          <>
            <span className="absolute -inset-1.5 rounded-full bg-rose-400 opacity-75 animate-ping" />
            <span className="absolute -inset-3 rounded-full bg-rose-300 opacity-40 animate-pulse" />
          </>
        )}

        <div className="relative z-10 flex items-center justify-center">
          {voiceNotSupported ? (
            <MicOff className="w-5 h-5" />
          ) : isListening ? (
            <Volume2 className="w-5 h-5 animate-bounce" />
          ) : (
            <Mic className="w-5 h-5 text-teal-700" />
          )}
        </div>
      </button>

      {/* Active Recording Counter Tooltip */}
      {isListening && (
        <div className="absolute bottom-full mb-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-mono font-medium rounded-xl shadow-xl whitespace-nowrap flex items-center gap-2 z-30">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>{language === 'km' ? 'កំពុងស្ដាប់...' : 'Listening...'}</span>
          <span className="text-teal-300 font-bold ml-1">({formatTime(seconds)})</span>
        </div>
      )}

      {/* Captured Transcription Review Card */}
      {capturedText && !isListening && (
        <div className="absolute bottom-full mb-3 right-0 w-72 bg-white border border-teal-300 p-3.5 rounded-2xl shadow-2xl z-40 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-700 border-b border-slate-100 pb-1.5">
            <span className="flex items-center gap-1 text-teal-700">
              <Mic className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'សំឡេងត្រូវបានបំលែងជាអក្សរ' : 'Voice Transcription'}</span>
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[11px] text-teal-600 hover:text-teal-800 flex items-center gap-0.5 font-semibold"
            >
              <Edit3 className="w-3 h-3" />
              <span>{language === 'km' ? 'កែប្រែ' : 'Edit'}</span>
            </button>
          </div>

          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-teal-300 rounded-lg text-xs outline-none font-medium focus:ring-1 focus:ring-teal-500"
              rows={2}
              autoFocus
            />
          ) : (
            <p className="text-slate-800 font-semibold italic bg-teal-50/70 p-2 rounded-lg border border-teal-100">
              &ldquo;{capturedText}&rdquo;
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={() => setCapturedText(null)}
              className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-[11px] font-semibold"
            >
              {language === 'km' ? 'បោះបង់' : 'Cancel'}
            </button>
            <button
              onClick={handleSendCaptured}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm"
            >
              <Send className="w-3 h-3" />
              <span>{language === 'km' ? 'ផ្ញើ' : 'Send'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="absolute bottom-full mb-3 right-0 w-72 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] px-3 py-2 rounded-xl shadow-lg z-40 flex items-start gap-1.5 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* iOS / Browser not supported warning */}
      {voiceNotSupported && browserWarning && (
        <div className="absolute bottom-full mb-3 right-0 w-72 bg-slate-800 text-slate-200 text-[11px] px-3 py-2 rounded-xl shadow-lg z-40 flex items-start gap-1.5 font-medium">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-teal-400" />
          <span>{browserWarning}</span>
        </div>
      )}
    </div>
  );
}
