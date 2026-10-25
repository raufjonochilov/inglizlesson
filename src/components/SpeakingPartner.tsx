'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  RefreshCw,
  Sparkles,
  User,
  Bot,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Flame,
  Radio,
  ArrowRight
} from 'lucide-react';
import { speakText, stopSpeaking, isSpeechRecognitionSupported, SoundFX } from '@/lib/speech';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  feedback?: {
    mistake: string;
    correction: string;
    explanation: string;
  };
  timestamp: string;
}

interface SpeakingPartnerProps {
  apiKey: string;
  soundEnabled: boolean;
  onActivity: () => void;
}

export default function SpeakingPartner({ apiKey, soundEnabled, onActivity }: SpeakingPartnerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: "Hello! I am Sarah, your AI English speaking coach. You can talk to me via microphone or type your message. How are you doing today?",
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [persona, setPersona] = useState<'tutor' | 'friend' | 'interviewer' | 'ielts'>('tutor');
  const [level, setLevel] = useState<'Beginner (A1-A2)' | 'Intermediate (B1-B2)' | 'Advanced (C1)'>('Intermediate (B1-B2)');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [activeSpeakingMsgId, setActiveSpeakingMsgId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const supported = isSpeechRecognitionSupported();
    setSpeechSupported(supported);

    if (supported && typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInputText(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleListening = () => {
    if (!speechSupported) {
      alert("Kechirasiz, brauzeringiz mikrofon orqali ovoz yozishni qo'llab-quvvatlamaydi (Google Chrome yoki Edge tavsiya etiladi).");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      setInputText('');
      try {
        recognitionRef.current?.start();
        if (soundEnabled) SoundFX.playClick();
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    stopSpeaking();
    if (soundEnabled) SoundFX.playClick();

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);
    onActivity();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map(m => ({ role: m.role, content: m.content })),
          persona,
          userLevel: level,
          apiKey,
        }),
      });

      const data = await response.json();
      if (data.reply) {
        // Parse feedback if included
        let rawReply = data.reply as string;
        let parsedFeedback: Message['feedback'] = undefined;

        if (rawReply.includes('---FEEDBACK---')) {
          const parts = rawReply.split('---FEEDBACK---');
          rawReply = parts[0].trim();
          const feedbackText = parts[1];

          const mistakeMatch = feedbackText.match(/Mistake:\s*["']?([^"'\n]+)["']?/i);
          const correctionMatch = feedbackText.match(/Correction:\s*["']?([^"'\n]+)["']?/i);
          const explanationMatch = feedbackText.match(/Explanation:\s*["']?([^"'\n]+)["']?/i);

          if (correctionMatch) {
            parsedFeedback = {
              mistake: mistakeMatch ? mistakeMatch[1].trim() : '',
              correction: correctionMatch[1].trim(),
              explanation: explanationMatch ? explanationMatch[1].trim() : 'Tavsiya etilgan to\'g\'ri shakl',
            };
          }
        }

        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: rawReply,
          feedback: parsedFeedback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, aiMsg]);
        if (soundEnabled) SoundFX.playChime();

        if (autoSpeak) {
          setActiveSpeakingMsgId(aiMsg.id);
          speakText(rawReply, {
            onEnd: () => setActiveSpeakingMsgId(null),
            onError: () => setActiveSpeakingMsgId(null),
          });
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayVoice = (msgId: string, text: string) => {
    if (activeSpeakingMsgId === msgId) {
      stopSpeaking();
      setActiveSpeakingMsgId(null);
    } else {
      stopSpeaking();
      setActiveSpeakingMsgId(msgId);
      speakText(text, {
        onEnd: () => setActiveSpeakingMsgId(null),
        onError: () => setActiveSpeakingMsgId(null),
      });
    }
  };

  const starterTopics = [
    "Tell me about your favorite travel destination",
    "How can I sound more natural in English?",
    "Let's practice a mock job interview for IT",
    "What is the difference between 'make' and 'do'?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto p-2 sm:p-4 gap-4 animate-fade-in">
      {/* Top Controls Bar */}
      <div className="glass-panel rounded-3xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 border border-white/10">
        {/* Persona Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Hamkor:</span>
          <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5">
            {(
              [
                { id: 'tutor', name: '🎓 Miss Sarah' },
                { id: 'friend', name: '☕ Alex' },
                { id: 'interviewer', name: '💼 Intervyuer' },
                { id: 'ielts', name: '🇬🇧 IELTS Examiner' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={`px-3 py-1.5 text-xs rounded-xl font-bold transition-all duration-200 ${
                  persona === p.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Level & Audio Controls */}
        <div className="flex items-center gap-3">
          <select
            value={level}
            onChange={(e: any) => setLevel(e.target.value)}
            className="text-xs bg-slate-900/90 text-slate-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Beginner (A1-A2)">Boshlang'ich (A1-A2)</option>
            <option value="Intermediate (B1-B2)">O'rta (B1-B2)</option>
            <option value="Advanced (C1)">Yuqori (C1-C2)</option>
          </select>

          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            title={autoSpeak ? "Avtomatik ovozli o'qish yoqilgan" : "Avtomatik ovozli o'qish o'chirilgan"}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-xl border transition ${
              autoSpeak
                ? 'bg-indigo-600/30 border-indigo-400/40 text-indigo-300 font-bold shadow-sm'
                : 'bg-slate-900/80 border-white/10 text-slate-500'
            }`}
          >
            {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Avto-Ovoz</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto glass-panel rounded-3xl p-5 space-y-4 shadow-2xl border border-white/10">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              <div className="flex items-end gap-2.5 max-w-[85%] sm:max-w-[75%]">
                {!isUser && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/30">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-3xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white rounded-br-sm shadow-xl shadow-indigo-500/25 border border-indigo-400/30'
                      : 'glass-card text-slate-100 rounded-bl-sm border border-white/10 shadow-xl'
                  }`}
                >
                  <p>{msg.content}</p>

                  <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-black/5 dark:border-white/5">
                    <span
                      className={`text-[10px] ${
                        isUser ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {msg.timestamp}
                    </span>

                    {!isUser && (
                      <button
                        onClick={() => handlePlayVoice(msg.id, msg.content)}
                        className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        {activeSpeakingMsgId === msg.id ? (
                          <>
                            <Radio className="w-3 h-3 animate-spin text-indigo-500" />
                            <span>To'xtatish</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Eshitish</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Mistake & Correction Card */}
              {msg.feedback && (
                <div className="mt-2 ml-10 max-w-[85%] sm:max-w-[70%] bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-xs shadow-sm">
                  <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Grammatik Eslatma (Ustoz tavsiyasi):</span>
                  </div>
                  {msg.feedback.mistake && (
                    <div className="text-red-700 dark:text-red-400 line-through mb-0.5">
                      ❌ {msg.feedback.mistake}
                    </div>
                  )}
                  <div className="text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
                    ✅ {msg.feedback.correction}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 italic">
                    💡 {msg.feedback.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 italic pl-10">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <span>Ustoz o'ylamoqda...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starters (if conversation is short) */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1">
          <span className="text-[11px] font-medium text-slate-400">Mavzular:</span>
          {starterTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(topic)}
              className="text-xs px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 transition"
            >
              {topic}
            </button>
          ))}
        </div>
      )}

      {/* Input & Microphone Bar (3D Glass Dock) */}
      <div className="glass-panel border border-white/10 rounded-3xl p-3 shadow-2xl">
        {/* Live speech recognition status banner */}
        {isListening && (
          <div className="flex items-center justify-between bg-red-500/20 border border-red-500/40 rounded-2xl px-4 py-2 mb-2 text-xs text-red-300 font-bold animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
              <span>Mikrofon tinglamoqda... Inglizcha gapiring</span>
            </div>
            <button
              onClick={toggleListening}
              className="text-[11px] underline hover:text-white"
            >
              To'xtatish
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2.5"
        >
          {/* 3D Microphone button */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "Ovoz yozishni to'xtatish" : "Ovoz orqali gapirish"}
            className={`p-3.5 rounded-2xl transition-all duration-300 shadow-lg ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-red-500/40 scale-110'
                : 'bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/40 text-cyan-400 hover:scale-105 active:scale-95'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? 'Ovozingiz matnga aylanmoqda...'
                : 'Inglizcha xabaringizni yozing yoki mikrofonni bosing...'
            }
            className="flex-1 bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          {/* Send button with 3D gradient */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 text-white rounded-2xl transition-all duration-200 shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
