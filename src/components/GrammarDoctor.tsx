'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Stethoscope,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Copy,
  Check,
  Lightbulb,
  Search,
  Bookmark,
  GraduationCap,
  X,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  XCircle,
} from 'lucide-react';
import {
  GRAMMAR_SERIES_INFO,
  GRAMMAR_BOOKS_METADATA,
  GRAMMAR_TOPICS_LIST,
  GrammarSeries,
  GrammarCategory,
  GrammarTopic,
} from '@/lib/data/grammar-curriculum';
import { speakText, SoundFX } from '@/lib/speech';

interface GrammarResult {
  isCorrect: boolean;
  original: string;
  corrected: string;
  nativeVersion: string;
  cefrLevel: string;
  explanationUz: string;
  suggestions: string[];
}

interface GrammarDoctorProps {
  apiKey: string;
  soundEnabled: boolean;
  onActivity: () => void;
}

export default function GrammarDoctor({ apiKey, soundEnabled, onActivity }: GrammarDoctorProps) {
  // Main view mode: 'library' (Textbook rules) vs 'doctor' (AI Diagnostic)
  const [activeMode, setActiveMode] = useState<'library' | 'doctor'>('library');

  // Library filters
  const [selectedSeries, setSelectedSeries] = useState<GrammarSeries>('All');
  const [selectedBook, setSelectedBook] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<GrammarCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);

  // Mastered topics tracked in localStorage
  const [masteredTopics, setMasteredTopics] = useState<string[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem('lingua_mastered_grammar_topics');
    if (saved) {
      try {
        setMasteredTopics(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const toggleMasteredTopic = (id: string) => {
    let next: string[];
    if (masteredTopics.includes(id)) {
      next = masteredTopics.filter((item) => item !== id);
    } else {
      next = [...masteredTopics, id];
      if (soundEnabled) SoundFX.playSuccess();
    }
    setMasteredTopics(next);
    localStorage.setItem('lingua_mastered_grammar_topics', JSON.stringify(next));
    onActivity();
  };

  // Filter books metadata based on chosen series
  const availableBooks = useMemo(() => {
    if (selectedSeries === 'All') return GRAMMAR_BOOKS_METADATA;
    return GRAMMAR_BOOKS_METADATA.filter((b) => b.series === selectedSeries);
  }, [selectedSeries]);

  // Categories list
  const categoriesList: { id: GrammarCategory; label: string }[] = [
    { id: 'All', label: 'Barchasi' },
    { id: 'Tenses', label: 'Zamonlar (Tenses)' },
    { id: 'Modals', label: 'Modal Fe\'llar' },
    { id: 'Passive & Causative', label: 'Majhul & Kauzativ' },
    { id: 'Conditionals & Wishes', label: 'Shart Mayli & Istak' },
    { id: 'Reported Speech', label: 'O\'zlashtirma Gap' },
    { id: 'Clauses & Inversion', label: 'Inversiya & Urg\'u' },
    { id: 'Gerund & Infinitives', label: 'Gerund & Infinitiv' },
    { id: 'Nouns & Articles', label: 'Ot & Sifatlar' },
  ];

  // Filtered topics list
  const filteredTopics = useMemo(() => {
    return GRAMMAR_TOPICS_LIST.filter((topic) => {
      if (selectedSeries !== 'All' && topic.series !== selectedSeries) return false;
      if (selectedBook !== 'All' && topic.book !== selectedBook) return false;
      if (selectedCategory !== 'All' && topic.category !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitleEn = topic.titleEn.toLowerCase().includes(q);
        const matchTitleUz = topic.titleUz.toLowerCase().includes(q);
        const matchUnit = topic.unit.toLowerCase().includes(q);
        const matchFormula = topic.formula.toLowerCase().includes(q);
        const matchExpl = topic.explanationUz.toLowerCase().includes(q);
        if (!matchTitleEn && !matchTitleUz && !matchUnit && !matchFormula && !matchExpl) {
          return false;
        }
      }

      return true;
    });
  }, [selectedSeries, selectedBook, selectedCategory, searchQuery]);

  // Interactive Quiz state inside Topic Modal
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);
  const [isQuizAnswerChecked, setIsQuizAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleSelectQuizAnswer = (ans: string, correctAns: string) => {
    if (isQuizAnswerChecked) return;
    setSelectedQuizAnswer(ans);
    setIsQuizAnswerChecked(true);
    onActivity();

    if (ans === correctAns) {
      setQuizScore((prev) => prev + 10);
      if (soundEnabled) SoundFX.playSuccess();
    } else {
      if (soundEnabled) SoundFX.playChime();
    }
  };

  // Copied formula state
  const [copiedFormula, setCopiedFormula] = useState(false);
  const handleCopyFormula = (formula: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  // --- AI Grammar Doctor State & Handlers ---
  const [inputText, setInputText] = useState('');
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorResult, setDoctorResult] = useState<GrammarResult | null>(null);
  const [doctorCopied, setDoctorCopied] = useState(false);

  const sampleMistakes = [
    { label: 'Yosh aytish xatosi', text: 'I have 22 years old and I work as teacher.' },
    { label: 'Inkor shakli xatosi', text: 'She don\'t likes watching horror movies.' },
    { label: 'Ot va artikl xatosi', text: 'She gave me an useful advice yesterday.' },
    { label: 'Gerund / Infinitiv', text: 'I am looking forward to meet you soon.' },
    { label: 'Inversiya xatosi', text: 'Never I have seen such beautiful city.' },
  ];

  const handleAnalyze = async (textToTest?: string) => {
    const text = (textToTest || inputText).trim();
    if (!text || doctorLoading) return;

    if (soundEnabled) SoundFX.playClick();
    setDoctorLoading(true);
    onActivity();

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: text, apiKey }),
      });

      const data = await res.json();
      if (!data.error) {
        setDoctorResult(data);
        if (soundEnabled) {
          if (data.isCorrect) SoundFX.playSuccess();
          else SoundFX.playChime();
        }
      }
    } catch (err) {
      console.error('Analyze error:', err);
    } finally {
      setDoctorLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setDoctorCopied(true);
    setTimeout(() => setDoctorCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-5 space-y-6 animate-fade-in">
      {/* 1. Header Banner & Mode Switcher */}
      <div className="bg-gradient-to-r from-white via-teal-50/30 to-indigo-50/30 dark:from-slate-900 dark:via-teal-950/20 dark:to-indigo-950/20 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-teal-600 text-white shadow-lg shadow-teal-500/25">
              <BookOpen className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Grammatika Akademiyasi & Doctor</span>
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-sm uppercase">
                  Master Curricula
                </span>
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Grammarway 1-4 • Murphy (Red, Blue, Green) • Destination B1, B2, C1/C2
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
            <button
              onClick={() => {
                setActiveMode('library');
                if (soundEnabled) SoundFX.playClick();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeMode === 'library'
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📚 Darsliklar Grammatikasi</span>
            </button>
            <button
              onClick={() => {
                setActiveMode('doctor');
                if (soundEnabled) SoundFX.playClick();
              }}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeMode === 'doctor'
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>🩺 AI Grammar Doctor</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <div className="bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 p-2.5 rounded-2xl text-center shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jami Mavzular</span>
            <span className="text-lg font-black text-teal-600 dark:text-teal-400">{GRAMMAR_TOPICS_LIST.length} ta dars</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 p-2.5 rounded-2xl text-center shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filtrda mavjud</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">{filteredTopics.length} ta</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 p-2.5 rounded-2xl text-center shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">O'zlashtirilgan</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{masteredTopics.length} ta</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 p-2.5 rounded-2xl text-center shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Test Ballari</span>
            <span className="text-lg font-black text-amber-500">{quizScore} ball</span>
          </div>
        </div>
      </div>

      {activeMode === 'library' ? (
        /* =========================================================
           TAB 1: TEXTBOOK GRAMMAR LIBRARY (GRAMMARWAY, MURPHY, DESTINATION)
           ========================================================= */
        <div className="space-y-6">
          {/* Series Selection Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                <span>Grammatika Darsligini Tanlang:</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {GRAMMAR_SERIES_INFO.map((series) => {
                const isSelected = selectedSeries === series.id;
                return (
                  <button
                    key={series.id}
                    onClick={() => {
                      setSelectedSeries(series.id);
                      setSelectedBook('All');
                      if (soundEnabled) SoundFX.playClick();
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                      isSelected
                        ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white border-teal-500 shadow-lg shadow-teal-500/25 scale-[1.02]'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-teal-400 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{series.icon}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                      )}
                    </div>
                    <div className="mt-2">
                      <h3 className={`font-black text-sm tracking-tight ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {series.name}
                      </h3>
                      <p className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                        {series.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specific Book & Category Filters Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            {/* Specific Book Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 text-teal-600" />
                <span>Kitob:</span>
              </span>
              <button
                onClick={() => setSelectedBook('All')}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                  selectedBook === 'All'
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                Barchasi ({availableBooks.length})
              </button>
              {availableBooks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBook(b.id);
                    if (soundEnabled) SoundFX.playClick();
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
                    selectedBook === b.id
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{b.badge}</span>
                  <span className="text-[10px] font-mono opacity-80">({b.level})</span>
                </button>
              ))}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 pb-1 no-scrollbar">
              <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Bo'lim:</span>
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Grammatika qoidasi, formula yoki o'zbekcha mavzu nomi bo'yicha qidirish..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Topics Grid */}
          {filteredTopics.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center shadow-lg space-y-3">
              <Search className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Mos keluvchi grammatika mavzusi topilmadi
              </h3>
              <p className="text-xs text-slate-500">
                Qidiruv so'zini o'zgartiring yoki filtrlarni tozalang.
              </p>
              <button
                onClick={() => {
                  setSelectedSeries('All');
                  setSelectedBook('All');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
              >
                Barcha filtrlarni tozalash
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTopics.map((topic) => {
                const isMastered = masteredTopics.includes(topic.id);
                return (
                  <div
                    key={topic.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500/50 rounded-3xl p-5 shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group relative overflow-hidden"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-[10px] border border-teal-200 dark:border-teal-800">
                            {topic.book} • {topic.unit}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px] font-bold">
                            {topic.level}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleMasteredTopic(topic.id)}
                          title={isMastered ? "O'zlashtirilganlar ro'yxatidan chiqarish" : "O'zlashtirildi deb belgilash"}
                          className={`p-1.5 rounded-xl border transition ${
                            isMastered
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                              : 'text-slate-400 border-slate-200 dark:border-slate-700 hover:text-emerald-500'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition leading-snug">
                        {topic.titleEn}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        {topic.titleUz}
                      </p>

                      {/* Formula Card */}
                      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-2.5 mt-3 font-mono text-[11px] text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2">
                        <span className="line-clamp-1">{topic.formula}</span>
                        <button
                          onClick={() => handleCopyFormula(topic.formula)}
                          title="Formulani nusxalash"
                          className="text-slate-400 hover:text-teal-600 p-1"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Explanation Snippet */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                        {topic.explanationUz}
                      </p>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-400">
                        {topic.practice.length} ta interaktiv test
                      </span>

                      <button
                        onClick={() => {
                          setSelectedTopic(topic);
                          setSelectedQuizAnswer(null);
                          setIsQuizAnswerChecked(false);
                          if (soundEnabled) SoundFX.playClick();
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-500/20 transition"
                      >
                        <span>Darsni O'rganish & Test</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. TOPIC DETAIL & PRACTICE MODAL */}
          {selectedTopic && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-xs">
                        {selectedTopic.book} • {selectedTopic.unit}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-xs font-bold">
                        CEFR {selectedTopic.level}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {selectedTopic.titleEn}
                    </h2>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-bold">
                      {selectedTopic.titleUz}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Formula Highlight Box */}
                <div className="bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-teal-500/10 border border-teal-200/60 dark:border-teal-800/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-extrabold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                      Grammatik Formula & Tuzilishi:
                    </span>
                    <button
                      onClick={() => handleCopyFormula(selectedTopic.formula)}
                      className="text-xs font-bold text-teal-600 flex items-center gap-1 hover:underline"
                    >
                      {copiedFormula ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedFormula ? 'Nusxalandi' : 'Nusxalash'}</span>
                    </button>
                  </div>
                  <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {selectedTopic.formula}
                  </p>
                </div>

                {/* Explanation in Uzbek */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Qoida Izohi (O'zbek tilida):
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {selectedTopic.explanationUz}
                  </p>
                </div>

                {/* Key Rules Breakdown */}
                {selectedTopic.keyPointsUz && selectedTopic.keyPointsUz.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Asosiy Qoidalar & Muhim Jihatlar:
                    </span>
                    <ul className="space-y-1.5">
                      {selectedTopic.keyPointsUz.map((pt, i) => (
                        <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Examples Section with Audio */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Namunaviy Misollar:
                  </span>
                  <div className="space-y-2">
                    {selectedTopic.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm"
                      >
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            "{ex.en}"
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            "{ex.uz}"
                          </p>
                        </div>
                        <button
                          onClick={() => speakText(ex.en)}
                          className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 hover:bg-teal-100 shrink-0"
                          title="Talaffuzni eshitish"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Student Mistakes */}
                {selectedTopic.commonMistakesUz && selectedTopic.commonMistakesUz.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      <span>E'tibor bering: Ko'p qilinadigan xatolar va tuzoqlar:</span>
                    </span>
                    <div className="space-y-2">
                      {selectedTopic.commonMistakesUz.map((m, i) => (
                        <div
                          key={i}
                          className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-3.5 text-xs space-y-1.5"
                        >
                          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold">
                            <span>❌ Xato:</span>
                            <span className="font-mono">{m.wrong}</span>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <span>✅ To'g'ri:</span>
                            <span className="font-mono">{m.correct}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 italic pt-1 border-t border-amber-200/50 dark:border-amber-900/30">
                            💡 Nega: {m.whyUz}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Practice Quiz */}
                {selectedTopic.practice && selectedTopic.practice.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span>Tezkor Bilim Sinovi:</span>
                      </span>
                    </div>

                    {selectedTopic.practice.map((q) => (
                      <div
                        key={q.id}
                        className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 space-y-3"
                      >
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {q.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, i) => {
                            const isChosen = selectedQuizAnswer === opt;
                            const isCorrect = opt === q.correctAnswer;

                            let btnCls =
                              'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400';

                            if (isQuizAnswerChecked) {
                              if (isCorrect) {
                                btnCls = 'bg-emerald-500 text-white border-emerald-500 font-bold';
                              } else if (isChosen && !isCorrect) {
                                btnCls = 'bg-red-500 text-white border-red-500';
                              }
                            }

                            return (
                              <button
                                key={i}
                                disabled={isQuizAnswerChecked}
                                onClick={() => handleSelectQuizAnswer(opt, q.correctAnswer)}
                                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${btnCls}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {isQuizAnswerChecked && (
                          <div className="text-xs pt-1">
                            <p className="font-semibold text-slate-700 dark:text-slate-300">
                              💡 Izoh: {q.explanationUz}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Modal Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => toggleMasteredTopic(selectedTopic.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      masteredTopics.includes(selectedTopic.id)
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{masteredTopics.includes(selectedTopic.id) ? '✅ O\'zlashtirildi' : 'O\'zlashtirildi deb belgilash'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-teal-500/20"
                  >
                    Yopish
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* =========================================================
           TAB 2: AI GRAMMAR DOCTOR & SENTENCE DIAGNOSIS
           ========================================================= */
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-violet-500/10 border border-teal-200/50 dark:border-teal-800/40 rounded-3xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-500 text-white shadow-lg shadow-teal-500/25 mb-3">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              AI Sentence Doctor & Diagnostic
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto mt-1">
              Istalgan inglizcha gap yoki matningizni yozing. AI grammatik xatolarni topadi, o'zbek tilida qoidasini tushuntiradi va uni ona tili (native) darajasiga ko'taradi.
            </p>

            {/* Quick Sample Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-xs font-semibold text-slate-500">Namuna xatolar:</span>
              {sampleMistakes.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInputText(sample.text);
                    handleAnalyze(sample.text);
                  }}
                  className="text-xs px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 rounded-full font-medium transition shadow-sm"
                >
                  ⚡ {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Tekshiriluvchi gap yoki matn:
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Masalan: Yesterday I go to supermarket and buyed some milk..."
              className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {inputText.trim() ? `${inputText.trim().split(/\s+/).length} ta so'z` : '0 ta so\'z'}
              </span>
              <button
                onClick={() => handleAnalyze()}
                disabled={!inputText.trim() || doctorLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 disabled:opacity-40 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-500/20 transition"
              >
                {doctorLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Tahlil qilinmoqda...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tekshirish & Tashxis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Doctor Analysis Results Card */}
          {doctorResult && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-lg space-y-5 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  {doctorResult.isCorrect ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white">
                      {doctorResult.isCorrect ? 'A\'lo! Gap grammatik jihatdan to\'g\'ri' : 'E\'tibor bering: Grammatik xatoliklar mavjud'}
                    </h3>
                    <p className="text-xs text-slate-500">Tahlil muvaffaqiyatli yakunlandi</p>
                  </div>
                </div>

                {doctorResult.cefrLevel && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
                    Daraja: {doctorResult.cefrLevel}
                  </span>
                )}
              </div>

              {/* Side by side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Kiritilgan variant:
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                    {doctorResult.original}
                  </p>
                </div>

                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                      Tuzatilgan to'g'ri shakli:
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speakText(doctorResult.corrected)}
                        title="Audio tinglash"
                        className="p-1 rounded text-emerald-600 hover:bg-emerald-100"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(doctorResult.corrected)}
                        title="Nusxalash"
                        className="p-1 rounded text-emerald-600 hover:bg-emerald-100"
                      >
                        {doctorCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 leading-relaxed font-mono">
                    {doctorResult.corrected}
                  </p>
                </div>
              </div>

              {/* Native Speaker Alternative */}
              {doctorResult.nativeVersion && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Ona tili egasi (Native Speaker) kabi aytish varianti:</span>
                    </div>
                    <button
                      onClick={() => speakText(doctorResult.nativeVersion)}
                      title="Audio tinglash"
                      className="p-1 rounded text-indigo-600 hover:bg-indigo-100"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-sm italic font-medium text-indigo-950 dark:text-indigo-100">
                    "{doctorResult.nativeVersion}"
                  </p>
                </div>
              )}

              {/* Uzbek Explanation */}
              {doctorResult.explanationUz && (
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                    <span>Grammatik qoida va izoh (O'zbek tilida):</span>
                  </span>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {doctorResult.explanationUz}
                  </p>
                </div>
              )}

              {/* Suggestions */}
              {doctorResult.suggestions && doctorResult.suggestions.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
                    Foydali sinonimlar va iboralar:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {doctorResult.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => speakText(sug)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-teal-50 hover:text-teal-700 transition font-medium"
                      >
                        <Volume2 className="w-3 h-3 text-slate-400" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
