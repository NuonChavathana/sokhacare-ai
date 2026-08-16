'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { VoiceInputButton } from '@/components/shared/VoiceInputButton';
import { TextToSpeechButton } from '@/components/shared/TextToSpeechButton';
import {
  Bot,
  User,
  Send,
  Sparkles,
  PhoneCall,
  ShieldAlert,
  Hospital,
  Stethoscope,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
  HeartPulse
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  triageLevel?: 'emergency' | 'urgent' | 'routine' | 'info';
  quickReplies?: string[];
  suggestedActions?: {
    type: 'call_119' | 'call_115' | 'find_facilities' | 'symptoms_triage' | 'rehydrate';
    labelKm: string;
    labelEn: string;
    link?: string;
  }[];
  facilities?: any[];
}

export default function ChatbotPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat?: number; lng?: number }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome-1',
      role: 'assistant',
      content: isKm
        ? `👋 **ជម្រាបសួរ! ខ្ញុំជា SokhaCare AI Health Assistant**\n\nខ្ញុំអាចជួយលោកអ្នកពិគ្រោះរោគសញ្ញាបឋម រកមើលសញ្ញាអាសន្ន និងណែនាំមន្ទីរពេទ្យឯកទេសនៅកម្ពុជា។\n\nលោកអ្នកអាច**វាយអក្សរ** ឬ**ចុចប៊ូតុងមីក្រូហ្វូន 🎙️ ដើម្បីនិយាយជាភាសាខ្មែរ** ឬជ្រើសរើសប្រធានបទរហ័សខាងក្រោម៖`
        : `👋 **Hello! I am your SokhaCare AI Health Assistant**\n\nI can help you evaluate medical symptoms, identify emergency red flags, and navigate to specialized hospitals across Cambodia.\n\nFeel free to **type** or **use the microphone button 🎙️ to speak in Khmer or English**, or select a prompt below:`,
      timestamp: new Date().toISOString(),
      triageLevel: 'info',
      quickReplies: isKm
        ? [
            'ខ្ញុំឈឺណែនទ្រូង និងហត់',
            'កូនខ្ញុំក្តៅខ្លួន 39°C និងឡើងកន្ទួល',
            'រាករូស និងក្អួត ក្រោយញ៉ាំអាហារ',
            'សម្ពាធឈាមឡើងខ្ពស់ និងវិលមុខ'
          ]
        : [
            'Chest tightness and breathing difficulty',
            'Child has 39°C fever and red rash',
            'Diarrhea and vomiting after eating',
            'High blood pressure and dizziness'
          ]
    };
    setMessages([welcomeMsg]);

    // Request approximate user location for local hospital matching
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {},
        { timeout: 5000 }
      );
    }
  }, [isKm]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          language,
          userLat: userLocation.lat,
          userLng: userLocation.lng
        })
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        const errorMsg: ChatMessage = {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: isKm
            ? 'សូមអភ័យទោស ប្រព័ន្ធកំពុងមមាញឹក។ សូមព្យាយាមសាកល្បងម្តងទៀត ឬទូរស័ព្ទទៅកាន់ 119 ក្នុងករណីបន្ទាន់។'
            : 'Sorry, the assistant is currently busy. Please try again or call 119 in an emergency.',
          timestamp: new Date().toISOString(),
          triageLevel: 'urgent'
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: isKm
          ? 'មានបញ្ហាក្នុងការតភ្ជាប់អ៊ីនធឺណិត។ សូមពិនិត្យមើលការតភ្ជាប់របស់អ្នក។'
          : 'Network error connecting to the health assistant. Please check your connection.',
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      role: 'assistant',
      content: isKm
        ? 'ការសន្ទនាត្រូវបានសម្អាតរួចរាល់។ តើខ្ញុំអាចជួយលោកអ្នកពិនិត្យសុខភាពអ្វីខ្លះនៅថ្ងៃនេះ?'
        : 'Chat history cleared. How can I assist with your health today?',
      timestamp: new Date().toISOString(),
      triageLevel: 'info',
      quickReplies: isKm
        ? ['ពិនិត្យហានិភ័យបេះដូង', 'កូនក្តៅខ្លួនខ្លាំង', 'ស្វែងរកមន្ទីរពេទ្យជិតបំផុត']
        : ['Heart disease assessment', 'Child high fever', 'Find nearby hospitals']
    };
    setMessages([welcomeMsg]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4">
      {/* Top Banner with Emergency Pill and Reset Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 p-4 sm:p-5 rounded-3xl text-white shadow-md border border-teal-800/60">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-emerald-400 flex items-center justify-center shadow-inner shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black">{t('chatTitle')}</h1>
              <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-xs text-teal-200/90 font-medium">{t('chatSubtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <a
            href="tel:119"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>119 Emergency</span>
          </a>

          <button
            type="button"
            onClick={clearChat}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all text-xs font-semibold"
            title={isKm ? 'សម្អាតការសន្ទនា' : 'Clear chat'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[650px] sm:h-[720px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isEmergency = msg.triageLevel === 'emergency';
            const isUrgent = msg.triageLevel === 'urgent';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-teal-600 text-white'
                      : isEmergency
                      ? 'bg-rose-600 text-white'
                      : isUrgent
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-800 text-teal-300 border border-teal-500/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble & Content */}
                <div className={`space-y-2.5 max-w-[85%] sm:max-w-[75%]`}>
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs transition-all ${
                      isUser
                        ? 'bg-teal-600 text-white rounded-tr-xs'
                        : isEmergency
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-400 dark:border-rose-700 text-rose-950 dark:text-rose-100 rounded-tl-xs'
                        : isUrgent
                        ? 'bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100 rounded-tl-xs'
                        : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    {/* Triage Badge if applicable */}
                    {!isUser && msg.triageLevel && msg.triageLevel !== 'info' && (
                      <div className="mb-2 flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            isEmergency
                              ? 'bg-rose-600 text-white animate-pulse'
                              : isUrgent
                              ? 'bg-amber-500 text-white'
                              : 'bg-teal-600 text-white'
                          }`}
                        >
                          {isEmergency ? (
                            <>
                              <AlertTriangle className="w-3 h-3" />
                              <span>{isKm ? 'សង្គ្រោះបន្ទាន់ (Emergency)' : 'Emergency Alert'}</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              <span>{isKm ? 'បន្ទាន់ (Urgent)' : 'Urgent Assessment'}</span>
                            </>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Message Body with simple markdown line parsing */}
                    <div className="space-y-2 whitespace-pre-line font-medium">
                      {msg.content}
                    </div>

                    {/* Bot Audio Reader controls */}
                    {!isUser && (
                      <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <div className="text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <TextToSpeechButton text={msg.content} size="sm" variant="outline" />
                      </div>
                    )}
                  </div>

                  {/* Suggested Action Buttons if present */}
                  {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.suggestedActions.map((act, i) => (
                        <Link
                          key={i}
                          href={act.link || '#'}
                          className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-xs transition-all ${
                            act.type === 'call_119'
                              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-bounce'
                              : 'bg-teal-50 dark:bg-teal-950/60 border border-teal-600 dark:border-teal-500 text-teal-900 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/60'
                          }`}
                        >
                          <span>{isKm ? act.labelKm : act.labelEn}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Nearby Hospitals Cards if attached */}
                  {!isUser && msg.facilities && msg.facilities.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Hospital className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>{isKm ? 'មន្ទីរពេទ្យសង្គ្រោះបន្ទាន់ជិតបំផុត៖' : 'Nearest Emergency Hospitals:'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.facilities.map((fac) => (
                          <div
                            key={fac.id}
                            className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-1 text-xs"
                          >
                            <div className="font-extrabold text-slate-900 dark:text-white">
                              {isKm ? fac.nameKm : fac.nameEn}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                              <span>{isKm ? fac.provinceKm : fac.provinceEn}</span>
                              {fac.distanceKm && (
                                <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">
                                  {fac.distanceKm} km
                                </span>
                              )}
                            </div>
                            <a
                              href={`tel:${fac.phone}`}
                              className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline block pt-0.5"
                            >
                              📞 {fac.phone}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Reply Pills */}
                  {!isUser && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickReplies.map((reply, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendMessage(reply)}
                          className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-teal-800 dark:hover:text-teal-200 text-xs font-semibold transition-all text-left"
                        >
                          💬 {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-2xl bg-slate-800 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                <span>{isKm ? 'SokhaCare AI កំពុងវិភាគរោគសញ្ញា...' : 'SokhaCare AI is analyzing symptoms...'}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <VoiceInputButton
              size="md"
              onTranscript={(text) => {
                const combined = inputText ? `${inputText} ${text}` : text;
                setInputText(combined);
              }}
            />

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('chatPlaceholder')}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm font-medium transition-all"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 active:scale-95"
              title={isKm ? 'ផ្ញើសារ' : 'Send'}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Safety Disclaimer Subtext */}
          <div className="mt-2 text-center text-[10px] text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1 font-medium">
            <ShieldAlert className="w-3 h-3 text-rose-500" />
            <span>{t('chatEmergencyNote')}</span>
          </div>
        </div>
      </div>

      {/* Bottom Quick Links to Structured Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/predict"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 rounded-2xl flex items-center gap-3 transition-all shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 dark:text-white">
              {isKm ? 'ការពិនិត្យរោគសញ្ញាបេះដូង (16 កត្តា)' : 'Cardiovascular Risk Engine'}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {isKm ? 'គំរូ ML ជាមួយរបៀបវេជ្ជបណ្ឌិត & អ្នកជំងឺ' : '16-Feature ML model with doctor mode'}
            </div>
          </div>
        </Link>

        <Link
          href="/facilities"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 rounded-2xl flex items-center gap-3 transition-all shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold">
            <Hospital className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 dark:text-white">
              {isKm ? 'ផែនទីមន្ទីរពេទ្យ & មណ្ឌលសុខភាព' : 'Hospital Directory & Map'}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {isKm ? 'ស្វែងរកមន្ទីរពេទ្យជិតបំផុតតាមរយៈ GPS' : 'GPS-enabled nearby facility finder'}
            </div>
          </div>
        </Link>

        <Link
          href="/trust"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 rounded-2xl flex items-center gap-3 transition-all shadow-xs"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 dark:text-white">
              {isKm ? 'វិធានសុវត្ថិភាពវេជ្ជសាស្ត្រ AI' : 'Medical Safety Protocols'}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {isKm ? 'គោលការណ៍សុវត្ថិភាព 10 ចំណុច' : '10 core clinical AI safety rules'}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
