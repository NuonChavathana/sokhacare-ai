'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useDataSaver } from '@/context/DataSaverContext';
import { ChatMessage, TriageResult, HealthcareFacility } from '@/types/triage';
import { VoiceInput } from './VoiceInput';
import { DemoScenarioSelector } from './DemoScenarioSelector';
import { TriageCard } from './TriageCard';
import { TriageProgress } from './TriageProgress';
import { SeveritySelector } from './SeveritySelector';
import { PreTriageSummaryModal } from './PreTriageSummaryModal';
import { EmergencyAccessibilityCard } from './EmergencyAccessibilityCard';
import { Send, Bot, User, Sparkles, RefreshCw, Users, WifiOff, HelpCircle, Flame } from 'lucide-react';
import { PatientRole } from '../family/FamilySelector';

export function ChatWindow() {
  const { language, t } = useLanguage();
  const { isOffline } = useDataSaver();
  const searchParams = useSearchParams();
  const roleParam = (searchParams.get('role') as PatientRole) || 'myself';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [severity, setSeverity] = useState<number>(3);
  const [progressStep, setProgressStep] = useState<1 | 2 | 3>(1);
  const [showPreSummary, setShowPreSummary] = useState(false);
  const [stagedInput, setStagedInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat?: number; lng?: number }>({});
  const [activeEmergencyMode, setActiveEmergencyMode] = useState<boolean>(false);
  const [emergencyTopFacility, setEmergencyTopFacility] = useState<HealthcareFacility | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Request browser geolocation if permitted
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          setUserLocation({ lat: 11.5564, lng: 104.9282 });
        }
      );
    }
  }, []);

  // Quick symptom category buttons
  const quickCategories = [
    { label_km: '🤒 ក្តៅខ្លួន (Fever)', label_en: '🤒 Fever', query: 'ខ្ញុំមានក្តៅខ្លួន' },
    { label_km: '🤕 ឈឺក្បាល (Headache)', label_en: '🤕 Headache', query: 'ខ្ញុំឈឺក្បាល' },
    { label_km: '🫁 ពិបាកដកដង្ហើម (Breathing)', label_en: '🫁 Breathing Issue', query: 'ខ្ញុំពិបាកដកដង្ហើម' },
    { label_km: '❤️ ឈឺទ្រូង (Chest Pain)', label_en: '❤️ Chest Pain', query: 'ខ្ញុំឈឺទ្រូង' },
    { label_km: '🤢 ឈឺពោះ (Stomach)', label_en: '🤢 Stomach Pain', query: 'ខ្ញុំឈឺពោះ' },
    { label_km: '🤧 ផ្តាសាយ (Cold/Flu)', label_en: '🤧 Cold / Flu', query: 'ខ្ញុំមានផ្តាសាយ' },
    { label_km: '🩹 របួស (Injury)', label_en: '🩹 Injury', query: 'ខ្ញុំមានរបួស' }
  ];

  // Uncertainty quick chips
  const uncertaintyChips = [
    { km: 'មិនច្បាស់លាស់', en: 'Not sure' },
    { km: 'មិនដឹង', en: "I don't know" },
    { km: 'ទើបតែកើតឡើង', en: 'Started recently' },
    { km: 'មានការព្រួយបារម្ភ', en: "I'm worried" }
  ];

  // Initial welcome message with family role awareness
  useEffect(() => {
    if (messages.length === 0) {
      const roleText =
        roleParam === 'child'
          ? language === 'km' ? 'សម្រាប់កូនតូច' : 'for your child'
          : roleParam === 'parent'
          ? language === 'km' ? 'សម្រាប់ឪពុកម្តាយ' : 'for your parent'
          : roleParam === 'elderly'
          ? language === 'km' ? 'សម្រាប់ជនជរាក្នុងគ្រួសារ' : 'for elderly family member'
          : language === 'km' ? 'សម្រាប់ខ្លួនលោកអ្នក' : 'for yourself';

      setMessages([
        {
          id: 'welcome-msg',
          sender: 'ai',
          text:
            language === 'km'
              ? `ជម្រាបសួរ! ខ្ញុំជាជំនួយការសុខភាព SokhaCare AI (${roleText})។ សូមរៀបរាប់ពីរោគសញ្ញាសុខភាព (តាមរយៈការវាយអក្សរ ឬចុចមេក្រូដើម្បីនិយាយ)។`
              : `Hello! I am SokhaCare AI (${roleText}). Please describe the health symptoms (by typing or tapping the microphone).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [language, messages.length, roleParam]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, showPreSummary, activeEmergencyMode]);

  const initiateSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;
    setStagedInput(text);
    setShowPreSummary(true);
    setProgressStep(2);
  };

  const confirmAndSend = async () => {
    setShowPreSummary(false);
    setProgressStep(3);
    const messageContent = `${stagedInput} (Severity: ${severity}/5)`;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: stagedInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          language,
          patientRole: roleParam,
          userLat: userLocation.lat,
          userLng: userLocation.lng
        })
      });

      if (!response.ok) {
        throw new Error('API triage error');
      }

      const data = await response.json();
      const triageResult: TriageResult = data.triage;
      const facilities: HealthcareFacility[] = data.facilities || [];

      // Check Emergency Mode trigger
      if (triageResult.urgency === 'EMERGENCY') {
        setActiveEmergencyMode(true);
        setEmergencyTopFacility(facilities[0]);
      }

      const aiText =
        language === 'km'
          ? triageResult.summary_km
          : triageResult.summary_en;

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        triageResult,
        recommendedFacilities: facilities
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Save to localStorage history
      try {
        const historyItem = {
          id: `h-${Date.now()}`,
          date: new Date().toLocaleString('sv').slice(0, 16),
          symptomSummary: stagedInput.slice(0, 50),
          urgency: triageResult.urgency,
          facility: facilities[0]?.name_en || 'Health Centre'
        };
        const savedHistory = JSON.parse(localStorage.getItem('sokhacare_history') || '[]');
        savedHistory.unshift(historyItem);
        localStorage.setItem('sokhacare_history', JSON.stringify(savedHistory.slice(0, 15)));
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text:
          language === 'km'
            ? 'សូមអភ័យទោស ប្រព័ន្ធមានបញ្ហាបច្ចេកទេសបន្តិចបន្តួច។ ប្រសិនបើមានស្ថានភាពអាសន្ន សូមប្រញាប់ទៅកាន់មន្ទីរពេទ្យដែលនៅជិតបំផុត ឬហៅ 119។'
            : 'Sorry, a technical error occurred. If this is an emergency, please proceed directly to the nearest hospital or call 119.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setProgressStep(1);
    }
  };

  const handleResetChat = () => {
    setActiveEmergencyMode(false);
    setShowPreSummary(false);
    setProgressStep(1);
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'ai',
        text:
          language === 'km'
            ? 'ប្រព័ន្ធត្រូវបានកំណត់ឡើងវិញ។ សូមរៀបរាប់ពីរោគសញ្ញាថ្មីរបស់លោកអ្នក។'
            : 'Chat reset. Please describe your new symptoms.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[800px] bg-white rounded-3xl border border-teal-100 shadow-xl overflow-hidden relative">
      {/* Offline Status Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>{language === 'km' ? 'គ្មានការភ្ជាប់អ៊ីនធឺណិត។ កំពុងប្រើប្រាស់របៀប Offline Demo AI' : 'Connection unavailable. Operating in offline Demo AI Mode.'}</span>
        </div>
      )}

      {/* Chat Window Header */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-xs">
            <Bot className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <h3 className="font-extrabold text-base flex items-center gap-2">
              SokhaCare AI Triage Engine
              <span className="text-[10px] bg-emerald-500/30 border border-emerald-400 text-emerald-200 px-2 py-0.5 rounded-full font-mono">
                Active
              </span>
            </h3>
            <p className="text-xs text-teal-200 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Role: <span className="font-bold capitalize">{roleParam}</span>
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          title="Reset Conversation"
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-teal-200 transition-colors text-xs font-semibold flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">{language === 'km' ? 'ចាប់ផ្តើមឡើងវិញ' : 'Reset'}</span>
        </button>
      </div>

      {/* Progress Step Indicator */}
      <div className="px-4 pt-3 bg-slate-50 border-b border-slate-100">
        <TriageProgress currentStep={progressStep} />
      </div>

      {/* Emergency Accessibility Overlay Card */}
      {activeEmergencyMode && (
        <div className="p-4 bg-rose-50 border-b border-rose-200">
          <EmergencyAccessibilityCard
            topFacility={emergencyTopFacility}
            onExitEmergency={() => setActiveEmergencyMode(false)}
          />
        </div>
      )}

      {/* Quick Symptom Category Pills */}
      <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider shrink-0">
          {language === 'km' ? 'រោគសញ្ញាញឹកញាប់៖' : 'Quick Categories:'}
        </span>
        {quickCategories.map((cat, i) => (
          <button
            key={i}
            type="button"
            disabled={isLoading}
            onClick={() => {
              setInputText(cat.query);
              initiateSend(cat.query);
            }}
            className="text-xs font-semibold px-2.5 py-1 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-slate-700 whitespace-nowrap shrink-0 transition-all shadow-2xs"
          >
            {language === 'km' ? cat.label_km : cat.label_en}
          </button>
        ))}
      </div>

      {/* Preset Scenarios Component */}
      <div className="px-4 pt-2 bg-slate-50">
        <DemoScenarioSelector
          disabled={isLoading}
          onSelectScenario={(symptom) => {
            setInputText(symptom);
            initiateSend(symptom);
          }}
        />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2.5 max-w-[90%] sm:max-w-[80%]">
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-teal-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white rounded-br-none font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none font-medium'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                <span className="text-[10px] text-slate-400 mt-1 block px-1">
                  {msg.timestamp}
                </span>

                {/* Render Triage Result Card */}
                {msg.triageResult && (
                  <TriageCard result={msg.triageResult} facilities={msg.recommendedFacilities} />
                )}

                {/* Render Follow-up Question Pills */}
                {msg.triageResult?.follow_up_needed && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {language === 'km' ? 'សំណួររៀបរាប់បន្ថែម៖' : 'Suggested Follow-up:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(language === 'km'
                        ? msg.triageResult.follow_up_questions_km
                        : msg.triageResult.follow_up_questions_en
                      )?.map((q, idx) => (
                        <button
                          key={idx}
                          disabled={isLoading}
                          onClick={() => {
                            setInputText(q);
                            initiateSend(q);
                          }}
                          className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-xl px-3 py-1.5 transition-all text-left font-semibold"
                        >
                          💬 {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Pre-Triage Information Confirmation Modal */}
        {showPreSummary && (
          <PreTriageSummaryModal
            symptoms={stagedInput}
            severity={severity}
            role={roleParam}
            onEdit={() => setShowPreSummary(false)}
            onConfirm={confirmAndSend}
          />
        )}

        {/* Thinking / Loading Animation */}
        {isLoading && (
          <div className="flex items-center gap-3 text-teal-800 bg-white p-3.5 rounded-2xl border border-teal-200 w-fit shadow-2xs">
            <Sparkles className="w-5 h-5 animate-spin text-teal-600" />
            <span className="text-xs font-bold">{t('thinking')}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Uncertainty Chips & Severity Selector Container */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 space-y-2">
        <SeveritySelector value={severity} onChange={setSeverity} />

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[10px] font-bold text-slate-500 shrink-0 flex items-center gap-0.5">
            <HelpCircle className="w-3 h-3 text-teal-600" />
            <span>{language === 'km' ? 'ឬជ្រើសរើសការឆ្លើយតប៖' : 'Or select option:'}</span>
          </span>
          {uncertaintyChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => setInputText((prev) => `${prev} (${language === 'km' ? chip.km : chip.en})`)}
              className="text-[11px] bg-white border border-slate-300 hover:border-teal-400 text-slate-700 px-2.5 py-1 rounded-xl whitespace-nowrap shrink-0 font-medium"
            >
              {language === 'km' ? chip.km : chip.en}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            initiateSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Microphone Voice Button */}
          <VoiceInput
            disabled={isLoading}
            onTranscript={(transcript) => {
              setInputText(transcript);
              initiateSend(transcript);
            }}
          />

          {/* Text Input Field */}
          <input
            type="text"
            value={inputText}
            disabled={isLoading}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="flex-1 bg-slate-50 border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 rounded-2xl px-4 py-3 text-sm text-slate-800 outline-none transition-all font-medium"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-3 bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 disabled:opacity-50 text-white rounded-2xl shadow-md transition-all font-semibold"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
