'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { VoiceInputButton } from '@/components/shared/VoiceInputButton';
import { TextToSpeechButton } from '@/components/shared/TextToSpeechButton';
import { SokhaCareLogoIcon } from '@/components/layout/SokhaCareLogoIcon';
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
  HeartPulse,
  RefreshCw,
  MapPin,
  Flame,
  Activity
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

/**
 * Format markdown text into styled React elements
 */
function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Heading ### or ##
        if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
          const headingText = trimmed.replace(/^#+\s*/, '');
          return (
            <h4 key={lineIdx} className="font-extrabold text-sm sm:text-base pt-1 pb-0.5 text-inherit">
              {formatInlineMarkdown(headingText)}
            </h4>
          );
        }

        // Bullet point - or *
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.substring(2);
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2">
              <span className="text-teal-600 dark:text-teal-400 font-bold shrink-0 mt-0.5">•</span>
              <span className="flex-1">{formatInlineMarkdown(bulletText)}</span>
            </div>
          );
        }

        // Numbered list (e.g., 1. 2.)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2">
              <span className="font-mono font-bold text-teal-700 dark:text-teal-400 shrink-0 text-xs mt-0.5">
                {numMatch[1]}.
              </span>
              <span className="flex-1">{formatInlineMarkdown(numMatch[2])}</span>
            </div>
          );
        }

        // Normal paragraph with inline formatting
        return (
          <p key={lineIdx} className="font-medium">
            {formatInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Parses bold **text** and emoji highlights inside inline text
 */
function formatInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-black text-inherit">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export default function ChatbotPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [quotaWarning, setQuotaWarning] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat?: number; lng?: number }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Initialize or update welcome message
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome-1',
      role: 'assistant',
      content: isKm
        ? `👋 **ជម្រាបសួរ! ខ្ញុំជា SokhaCare AI - ជំនួយការសុខភាពឆ្លាតវៃ**\n\nខ្ញុំអាចជួយលោកអ្នកពិគ្រោះរោគសញ្ញាបឋម រកមើលសញ្ញាអាសន្ន និងណែនាំមន្ទីរពេទ្យឯកទេសនៅកម្ពុជា។\n\nលោកអ្នកអាច**វាយអក្សរ** ឬ**ចុចប៊ូតុងមីក្រូហ្វូន 🎙️ ដើម្បីនិយាយជាភាសាខ្មែរ** ឬជ្រើសរើសប្រធានបទរហ័សខាងក្រោម៖`
        : `👋 **Hello! I am SokhaCare AI Health Assistant**\n\nI can help evaluate medical symptoms, screen for emergency red flags, and navigate to specialized hospitals across Cambodia.\n\nFeel free to **type** or **use the microphone button 🎙️ to speak in Khmer or English**, or select a prompt below:`,
      timestamp: new Date().toISOString(),
      triageLevel: 'info',
      quickReplies: isKm
        ? [
            'ខ្ញុំក្តៅខ្លួន និងឈឺក្បាល',
            'កូនខ្ញុំក្តៅខ្លួន 39°C',
            'រាករូស និងក្អួត ក្រោយញ៉ាំអាហារ',
            'ឈឺណែនទ្រូង និងហត់'
          ]
        : [
            'I have fever and headache',
            'Child has 39°C fever',
            'Diarrhea & vomiting after food',
            'Chest tightness and shortness of breath'
          ]
    };

    if (isInitialMount.current) {
      setMessages([welcomeMsg]);
      isInitialMount.current = false;
    } else {
      // If only welcome message is in state, update language
      setMessages((prev) => {
        if (prev.length <= 1) {
          return [welcomeMsg];
        }
        return prev;
      });
    }

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
      if (data.quotaExceeded && data.notice) {
        setQuotaWarning(data.notice);
      }
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
          triageLevel: 'info'
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
        ? '👋 ការសន្ទនាត្រូវបានសម្អាតរួចរាល់។ តើខ្ញុំអាចជួយលោកអ្នកពិនិត្យសុខភាពអ្វីខ្លះនៅថ្ងៃនេះ?'
        : '👋 Chat history cleared. How can I assist with your health today?',
      timestamp: new Date().toISOString(),
      triageLevel: 'info',
      quickReplies: isKm
        ? ['ខ្ញុំក្តៅខ្លួន និងឈឺក្បាល', 'ពិនិត្យហានិភ័យបេះដូង', 'កូនក្តៅខ្លួនខ្លាំង', 'ស្វែងរកមន្ទីរពេទ្យជិតបំផុត']
        : ['I have fever and headache', 'Heart disease assessment', 'Child high fever', 'Find nearby hospitals']
    };
    setMessages([welcomeMsg]);
  };

  // Find the last assistant message to show active quick replies
  const lastAssistantMessageIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return i;
    }
    return -1;
  })();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4">
      {/* Top Banner with Emergency Pill and Reset Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 p-4 sm:p-5 rounded-3xl text-white shadow-md border border-teal-800/60">
        <div className="flex items-center gap-3">
          <SokhaCareLogoIcon className="w-11 h-11 rounded-2xl" />
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

      {/* Quota Limit Warning Banner */}
      {quotaWarning && (
        <div className="bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 text-amber-900 dark:text-amber-200 px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="font-medium">{quotaWarning}</span>
          </div>
          <button
            type="button"
            onClick={() => setQuotaWarning(null)}
            className="text-amber-700 dark:text-amber-300 hover:underline font-bold text-xs shrink-0 cursor-pointer"
          >
            {isKm ? 'យល់ព្រម' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Main Chat Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[650px] sm:h-[720px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            const isEmergency = msg.triageLevel === 'emergency';
            const isUrgent = msg.triageLevel === 'urgent';
            const isLatestAssistant = index === lastAssistantMessageIndex;

            return (
              <div
                key={msg.id || index}
                className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                {isUser ? (
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs bg-teal-600 text-white">
                    <User className="w-4 h-4" />
                  </div>
                ) : (
                  <SokhaCareLogoIcon className="w-9 h-9 rounded-2xl" />
                )}

                {/* Message Bubble & Content */}
                <div className={`space-y-2.5 max-w-[88%] sm:max-w-[78%]`}>
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
                    {/* Triage Badge strictly for confirmed Emergency and Urgent clinical situations */}
                    {!isUser && (isEmergency || isUrgent) && (
                      <div className="mb-2.5 flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-xs ${
                            isEmergency
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {isEmergency ? (
                            <>
                              <AlertTriangle className="w-3 h-3" />
                              <span>{isKm ? '🚨 សង្គ្រោះបន្ទាន់ (Emergency)' : '🚨 Emergency Alert'}</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              <span>{isKm ? '⚠️ បន្ទាន់ (Urgent)' : '⚠️ Urgent Assessment'}</span>
                            </>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Rich Markdown Message Body */}
                    <div className="font-medium">
                      <MarkdownRenderer content={msg.content} />
                    </div>

                    {/* Bot Audio Reader controls */}
                    {!isUser && (
                      <div className="pt-2.5 mt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
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
                        <span>{isKm ? 'មន្ទីរពេទ្យឯកទេសជិតបំផុត៖' : 'Recommended Hospitals:'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.facilities.map((fac: any, fIdx: number) => {
                          const name = isKm ? fac.name_km || fac.nameKm || fac.name : fac.name_en || fac.nameEn || fac.name;
                          const province = isKm ? fac.province_km || fac.provinceKm || fac.province : fac.province_en || fac.provinceEn || fac.province;
                          const dist = fac.distance_km || fac.distanceKm;

                          return (
                            <div
                              key={fac.id || fIdx}
                              className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-1 text-xs shadow-xs"
                            >
                              <div className="font-extrabold text-slate-900 dark:text-white">
                                {name}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-teal-600" />
                                  {province}
                                </span>
                                {dist && (
                                  <span className="font-mono text-teal-700 dark:text-teal-400 font-bold">
                                    {dist} km
                                  </span>
                                )}
                              </div>
                              {fac.phone && (
                                <a
                                  href={`tel:${fac.phone}`}
                                  className="text-[11px] font-bold text-teal-700 dark:text-teal-400 hover:underline block pt-0.5"
                                >
                                  📞 {fac.phone}
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick Reply Pills on Latest Message */}
                  {!isUser && isLatestAssistant && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      {msg.quickReplies.map((reply, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendMessage(reply)}
                          disabled={loading}
                          className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 hover:border-teal-400 text-xs font-semibold transition-all shadow-xs text-left active:scale-95 disabled:opacity-50"
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
            <div className="flex gap-3 items-start animate-pulse">
              <div className="w-9 h-9 rounded-2xl bg-slate-800 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30 shadow-xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                <span className="font-semibold">
                  {isKm ? 'SokhaCare AI កំពុងវិភាគរោគសញ្ញា...' : 'SokhaCare AI is analyzing symptoms...'}
                </span>
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
            <ShieldAlert className="w-3 h-3 text-rose-500 shrink-0" />
            <span>{t('chatEmergencyNote')}</span>
          </div>
        </div>
      </div>

      {/* Bottom Quick Links to Structured Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/predict"
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 rounded-2xl flex items-center gap-3 transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
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
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 rounded-2xl flex items-center gap-3 transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
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
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 rounded-2xl flex items-center gap-3 transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
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
