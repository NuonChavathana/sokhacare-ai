'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { speechHandler } from '@/lib/speech/speech-recognition';
import { Mic, MicOff, Volume2, AlertCircle, Edit3, Send, Check, Clock } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [capturedText, setCapturedText] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsSupported(speechHandler.isSupported());
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
          setErrorMsg(t('micNotSupported'));
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

  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Microphone Button */}
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled || !isSupported}
        title={t('micSpeakHint')}
        className={`relative p-3 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/50 scale-110'
            : isSupported
            ? 'bg-teal-100 hover:bg-teal-200 text-teal-800 shadow-2xs'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        {/* Animated Ripple ring during voice recording */}
        {isListening && (
          <>
            <span className="absolute -inset-1.5 rounded-full bg-rose-400 opacity-75 animate-ping" />
            <span className="absolute -inset-3 rounded-full bg-rose-300 opacity-40 animate-pulse" />
          </>
        )}

        <div className="relative z-10 flex items-center justify-center">
          {isListening ? <Volume2 className="w-5 h-5 animate-bounce" /> : <Mic className="w-5 h-5 text-teal-700" />}
        </div>
      </button>

      {/* Active Recording Counter Tooltip */}
      {isListening && (
        <div className="absolute bottom-full mb-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-mono font-medium rounded-xl shadow-xl whitespace-nowrap flex items-center gap-2 z-30">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>{t('micListening')}</span>
          <span className="text-teal-300 font-bold ml-1">({formatTime(seconds)})</span>
        </div>
      )}

      {/* Captured Transcription Review Modal / Card */}
      {capturedText && !isListening && (
        <div className="absolute bottom-full mb-3 right-0 w-72 bg-white border border-teal-300 p-3.5 rounded-2xl shadow-2xl z-40 space-y-2 animate-fade-in text-xs">
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
              <span>{t('editTranscription')}</span>
            </button>
          </div>

          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-teal-300 rounded-lg text-xs outline-none font-medium focus:ring-1 focus:ring-teal-500"
              rows={2}
            />
          ) : (
            <p className="text-slate-800 font-semibold italic bg-teal-50/70 p-2 rounded-lg border border-teal-100">
              "{capturedText}"
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
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-2xs"
            >
              <Send className="w-3 h-3" />
              <span>{t('sendTranscription')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Fallback Notice */}
      {errorMsg && (
        <div className="mt-1 text-[11px] text-amber-700 flex items-center gap-1 font-medium whitespace-nowrap">
          <AlertCircle className="w-3 h-3" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
