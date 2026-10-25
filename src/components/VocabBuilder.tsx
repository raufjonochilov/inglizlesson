'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Volume2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  Eye,
  Shuffle,
  Search,
  SlidersHorizontal,
  Bookmark,
  GraduationCap,
  List,
  Volume1,
} from 'lucide-react';
import {
  VOCABULARY_LIST,
  VocabWord,
  BOOK_SERIES_LIST,
  BOOKS_METADATA,
  BookSeries,
} from '@/lib/data/vocab';
import { speakText, SoundFX } from '@/lib/speech';

interface VocabBuilderProps {
  soundEnabled: boolean;
  onActivity: () => void;
}

export default function VocabBuilder({ soundEnabled, onActivity }: VocabBuilderProps) {
  // Navigation & Filtering State
  const [selectedSeries, setSelectedSeries] = useState<BookSeries>('All');
  const [selectedBook, setSelectedBook] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [masteredFilter, setMasteredFilter] = useState<'all' | 'learning' | 'mastered'>('all');

  // View Mode: flashcard, quiz, list
  const [mode, setMode] = useState<'flashcard' | 'quiz' | 'list'>('flashcard');

  // Flashcard State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Quiz State
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  // Load mastered words from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lingua_mastered_words');
    if (saved) {
      try {
        setMasteredIds(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Filter books metadata based on chosen series
  const availableBooks = useMemo(() => {
    if (selectedSeries === 'All') return BOOKS_METADATA;
    return BOOKS_METADATA.filter((b) => b.series === selectedSeries);
  }, [selectedSeries]);

  // Current active book details
  const activeBookInfo = useMemo(() => {
    if (selectedBook === 'All') return null;
    return BOOKS_METADATA.find((b) => b.id === selectedBook) || null;
  }, [selectedBook]);

  // Filtered word list
  const filteredWords = useMemo(() => {
    let list = VOCABULARY_LIST.filter((w) => {
      // Series filter
      if (selectedSeries !== 'All' && w.series !== selectedSeries) return false;
      // Specific Book filter
      if (selectedBook !== 'All' && w.book !== selectedBook) return false;
      // CEFR level filter
      if (selectedLevel !== 'All' && w.level !== selectedLevel) return false;
      // Mastered filter
      if (masteredFilter === 'learning' && masteredIds.includes(w.id)) return false;
      if (masteredFilter === 'mastered' && !masteredIds.includes(w.id)) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchWord = w.word.toLowerCase().includes(q);
        const matchTr = w.translationUz.toLowerCase().includes(q);
        const matchDef = w.definitionEn.toLowerCase().includes(q);
        const matchCat = w.category.toLowerCase().includes(q);
        const matchSyn = w.synonyms.some((s) => s.toLowerCase().includes(q));
        if (!matchWord && !matchTr && !matchDef && !matchCat && !matchSyn) return false;
      }
      return true;
    });

    if (isShuffled) {
      // Deterministic order or seeded copy
      return [...list].sort((a, b) => a.id.localeCompare(b.id) * -1);
    }

    return list;
  }, [selectedSeries, selectedBook, selectedLevel, masteredFilter, searchQuery, isShuffled, masteredIds]);

  // Reset indices when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setQuizQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  }, [selectedSeries, selectedBook, selectedLevel, masteredFilter, searchQuery]);

  const currentWord = filteredWords[currentIndex] || filteredWords[0];

  // Navigation handlers
  const handleNextWord = () => {
    if (filteredWords.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
    if (soundEnabled) SoundFX.playClick();
  };

  const handlePrevWord = () => {
    if (filteredWords.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
    if (soundEnabled) SoundFX.playClick();
  };

  const toggleMastered = (id: string) => {
    let next: string[];
    if (masteredIds.includes(id)) {
      next = masteredIds.filter((item) => item !== id);
    } else {
      next = [...masteredIds, id];
      if (soundEnabled) SoundFX.playSuccess();
    }
    setMasteredIds(next);
    localStorage.setItem('lingua_mastered_words', JSON.stringify(next));
    onActivity();
  };

  const handleSpeak = (text: string, rate: number = 0.95, wordId?: string) => {
    if (wordId) setPlayingAudioId(wordId);
    speakText(text, {
      rate,
      onEnd: () => setPlayingAudioId(null),
      onError: () => setPlayingAudioId(null),
    });
  };

  // Keyboard navigation
  useEffect(() => {
    if (mode !== 'flashcard') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight') {
        handleNextWord();
      } else if (e.key === 'ArrowLeft') {
        handlePrevWord();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, filteredWords.length]);

  // Quiz logic
  const quizTarget = filteredWords.length > 0 ? filteredWords[quizQuestionIndex % filteredWords.length] : null;

  useEffect(() => {
    if (!quizTarget || filteredWords.length === 0) return;
    const wrong = VOCABULARY_LIST
      .filter((w) => w.id !== quizTarget.id && w.translationUz !== quizTarget.translationUz)
      .map((w) => w.translationUz);
    const shuffledWrong = wrong.sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [...shuffledWrong, quizTarget.translationUz].sort(() => 0.5 - Math.random());
    setCurrentOptions(options);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
  }, [quizQuestionIndex, quizTarget, filteredWords.length]);

  const handleSelectOption = (opt: string) => {
    if (isAnswerChecked || !quizTarget) return;
    setSelectedAnswer(opt);
    setIsAnswerChecked(true);
    onActivity();

    if (opt === quizTarget.translationUz) {
      setQuizScore((prev) => prev + 10);
      if (soundEnabled) SoundFX.playSuccess();
    } else {
      if (soundEnabled) SoundFX.playChime();
    }
  };

  const handleNextQuizQuestion = () => {
    setQuizQuestionIndex((prev) => prev + 1);
    if (soundEnabled) SoundFX.playClick();
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-5 space-y-6 animate-fade-in">
      {/* 1. Header & Learning Stats */}
      <div className="bg-gradient-to-r from-white via-indigo-50/40 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>3D Leksika & Lug'at Akademiyasi</span>
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm uppercase tracking-wider">
                    All Books
                  </span>
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Essential Words 1-6 • Destination B1-C2 • English Vocabulary in Use (Cambridge)
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
            <button
              onClick={() => setMode('flashcard')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition ${
                mode === 'flashcard'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🗂️ Flashcard</span>
            </button>
            <button
              onClick={() => setMode('quiz')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition ${
                mode === 'quiz'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🎯 Quiz Test</span>
            </button>
            <button
              onClick={() => setMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition ${
                mode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Kitob Ro'yxati</span>
            </button>
          </div>
        </div>

        {/* Global Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <div className="bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 p-2.5 rounded-2xl text-center shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Barcha So'zlar</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{VOCABULARY_LIST.length} ta</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 p-2.5 rounded-2xl text-center shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Filtrda mavjud</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">{filteredWords.length} ta</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 p-2.5 rounded-2xl text-center shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Yodlanganlar</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{masteredIds.length} ta</span>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 p-2.5 rounded-2xl text-center shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">O'rganilmoqda</span>
            <span className="text-lg font-black text-amber-600 dark:text-amber-400">
              {Math.max(0, VOCABULARY_LIST.length - masteredIds.length)} ta
            </span>
          </div>
        </div>
      </div>

      {/* 2. Book Series Selector Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Darslik Seriyasini Tanlang:</span>
          </span>
          {activeBookInfo && (
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              {activeBookInfo.badge} ({activeBookInfo.level})
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {BOOK_SERIES_LIST.map((series) => {
            const isSelected = selectedSeries === series.id;
            return (
              <button
                key={series.id}
                onClick={() => {
                  setSelectedSeries(series.id);
                  setSelectedBook('All');
                  setCurrentIndex(0);
                  setIsFlipped(false);
                  if (soundEnabled) SoundFX.playClick();
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-indigo-500 shadow-lg shadow-indigo-500/25 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{series.icon}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm animate-pulse" />
                  )}
                </div>
                <div className="mt-2">
                  <h3 className={`font-black text-sm tracking-tight leading-snug ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {series.name}
                  </h3>
                  <p className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {series.countDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Specific Book / Level Pills Sub-Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Kitob / Level:
            </span>
          </div>

          {/* Quick CEFR Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Daraja:</span>
            {['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevel(lvl);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition ${
                  selectedLevel === lvl
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Book Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => {
              setSelectedBook('All');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              selectedBook === 'All'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            Barchasi ({availableBooks.length} ta kitob)
          </button>
          {availableBooks.map((b) => {
            const isChosen = selectedBook === b.id;
            return (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedBook(b.id);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                  if (soundEnabled) SoundFX.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
                  isChosen
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span>{b.badge}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isChosen ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {b.level}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Book Detail Card */}
        {activeBookInfo && (
          <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px]">
                {activeBookInfo.badge}
              </span>
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {activeBookInfo.name}
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                  {activeBookInfo.descriptionUz}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded font-bold">
              CEFR {activeBookInfo.level}
            </span>
          </div>
        )}
      </div>

      {/* 4. Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="So'z, o'zbekcha tarjima yoki mavzu bo'yicha qidirish..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Mastered filter pills */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold shrink-0">
          <button
            onClick={() => setMasteredFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition ${
              masteredFilter === 'all'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Hammasi
          </button>
          <button
            onClick={() => setMasteredFilter('learning')}
            className={`px-2.5 py-1 rounded-lg transition ${
              masteredFilter === 'learning'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            O'rganilmoqda
          </button>
          <button
            onClick={() => setMasteredFilter('mastered')}
            className={`px-2.5 py-1 rounded-lg transition ${
              masteredFilter === 'mastered'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            ✅ Yodlangan
          </button>
        </div>
      </div>

      {/* 5. MAIN CONTENT AREA */}
      {filteredWords.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center shadow-lg space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Mos keluvchi so'zlar topilmadi
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Qidiruv so'zini o'zgartiring yoki filtrlarni (seriya, kitob, o'rganilgan statusi) bekor qiling.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedBook('All');
              setSelectedLevel('All');
              setMasteredFilter('all');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
          >
            Barcha filtrlarni tozalash
          </button>
        </div>
      ) : mode === 'flashcard' ? (
        /* 3D FLASHCARD VIEW */
        <div className="space-y-4">
          {/* 3D Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[360px] sm:min-h-[380px] bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/20 border-2 border-indigo-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between relative transition-all duration-300 hover:border-indigo-400 dark:hover:border-indigo-500/60 group"
            style={{ perspective: '1000px' }}
          >
            {/* Top Bar of Card */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 bg-indigo-100/80 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black rounded-lg border border-indigo-200 dark:border-indigo-800">
                  {currentWord.book}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-md">
                  {currentWord.level}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {currentWord.partOfSpeech}
                </span>
              </div>

              {/* Action Buttons inside Card */}
              <div className="flex items-center gap-2">
                {/* Shuffle toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsShuffled(!isShuffled);
                  }}
                  title={isShuffled ? "Tartibli tartib" : "Tasodifiy tartib (Shuffle)"}
                  className={`p-2 rounded-xl border transition ${
                    isShuffled
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'text-slate-400 hover:text-amber-500 border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                {/* Mastered toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMastered(currentWord.id);
                  }}
                  title={
                    masteredIds.includes(currentWord.id)
                      ? "Yodlanganlar ro'yxatidan chiqarish"
                      : "Yodlangan deb belgilash"
                  }
                  className={`p-2 rounded-xl border transition ${
                    masteredIds.includes(currentWord.id)
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-emerald-600 border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>

                {/* Slow audio button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentWord.word, 0.65, `${currentWord.id}-slow`);
                  }}
                  title="Sekin talaffuz (0.65x)"
                  className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition border border-indigo-100 dark:border-indigo-900"
                >
                  <Volume1 className="w-4 h-4" />
                </button>

                {/* Normal audio button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentWord.word, 0.95, currentWord.id);
                  }}
                  title="Standart talaffuz (1.0x)"
                  className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-500/25"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Front & Back Content */}
            {!isFlipped ? (
              /* CARD FRONT */
              <div className="text-center py-10 sm:py-14 space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500">
                  {currentWord.category}
                </div>

                <h2 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
                  {currentWord.word}
                </h2>

                <p className="text-indigo-600 dark:text-indigo-400 text-lg sm:text-xl font-mono tracking-wide font-medium">
                  {currentWord.phonetic}
                </p>

                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 text-xs text-slate-500 font-semibold bg-white/80 dark:bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm group-hover:border-indigo-400 transition">
                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                    <span>O'zbekcha tarjima & misollar uchun kartani bosing</span>
                  </div>
                </div>
              </div>
            ) : (
              /* CARD BACK */
              <div className="py-4 space-y-4 animate-fade-in text-left">
                {/* Uzbek translation */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-wider block">
                    O'zbekcha tarjimasi:
                  </span>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {currentWord.translationUz}
                  </p>
                </div>

                {/* English definition */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Inglizcha ta'rif:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic font-medium mt-0.5">
                    "{currentWord.definitionEn}"
                  </p>
                </div>

                {/* Example sentence with Uzbek translation */}
                <div className="bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      Kontekstli misol:
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(currentWord.exampleEn);
                      }}
                      className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Jumlani eshitish</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    "{currentWord.exampleEn}"
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    "{currentWord.exampleUz}"
                  </p>
                </div>

                {/* Synonyms tags */}
                {currentWord.synonyms && currentWord.synonyms.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">
                      Sinonimlar:
                    </span>
                    {currentWord.synonyms.map((syn, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-medium"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Footer Info */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="font-medium">
                So'z {currentIndex + 1} / {filteredWords.length}
              </span>
              <span className="font-semibold flex items-center gap-1.5">
                {masteredIds.includes(currentWord.id) ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Yodlangan</span>
                  </span>
                ) : (
                  <span className="text-slate-400">O'rganilmoqda</span>
                )}
              </span>
            </div>
          </div>

          {/* Navigation Controls Bar */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrevWord}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Oldingi</span>
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kartani aylantirish</span>
            </button>

            <button
              onClick={handleNextWord}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/25 transition"
            >
              <span>Keyingi</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-400">
            Maslahat: Klaviaturadagi <strong>← Oldingi</strong>, <strong>→ Keyingi</strong> va <strong>Space (Aylantirish)</strong> tugmalaridan foydalanishingiz mumkin.
          </p>
        </div>
      ) : mode === 'quiz' ? (
        /* QUIZ TEST VIEW */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Tezkor Bilim Sinovi • {quizTarget?.book || 'Leksika'}
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                To'g'ri o'zbekcha tarjimani tanlang
              </h3>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3.5 py-1.5 rounded-2xl text-amber-700 dark:text-amber-300 text-xs font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Ball: {quizScore}</span>
            </div>
          </div>

          {quizTarget && (
            <>
              {/* Word Prompt */}
              <div className="text-center py-6 space-y-2 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    {quizTarget.book} • {quizTarget.level}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {quizTarget.word}
                  </h2>
                  <button
                    onClick={() => handleSpeak(quizTarget.word)}
                    className="p-2.5 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm font-mono text-slate-400">{quizTarget.phonetic}</p>
                <p className="text-xs text-slate-500 italic">"{quizTarget.definitionEn}"</p>
              </div>

              {/* 4 Choices Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentOptions.map((opt, i) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrectOpt = opt === quizTarget.translationUz;

                  let buttonStyle =
                    'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400';

                  if (isAnswerChecked) {
                    if (isCorrectOpt) {
                      buttonStyle =
                        'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrectOpt) {
                      buttonStyle =
                        'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-800 dark:text-red-200';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-4 rounded-2xl border-2 text-left font-medium text-sm transition flex items-center justify-between ${buttonStyle}`}
                    >
                      <span className="font-semibold">{opt}</span>
                      {isAnswerChecked && isCorrectOpt && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                      {isAnswerChecked && isSelected && !isCorrectOpt && (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next Question Button */}
              {isAnswerChecked && (
                <div className="pt-2 flex justify-between items-center">
                  <div className="text-xs text-slate-500">
                    {selectedAnswer === quizTarget.translationUz ? (
                      <span className="text-emerald-600 font-bold">Ajoyib! To'g'ri javob topildi.</span>
                    ) : (
                      <span className="text-red-500 font-bold">
                        Noto'g'ri. To'g'ri javob: "{quizTarget.translationUz}"
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleNextQuizQuestion}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/20"
                  >
                    <span>Keyingi savol</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* 6. KITOB RO'YXATI (DICTIONARY / TABLE VIEW) */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {filteredWords.length} ta so'z ro'yxati:
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredWords.map((item, idx) => {
              const isMastered = masteredIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-indigo-400 dark:hover:border-slate-700 transition flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                          {item.word}
                        </h4>
                        <span className="text-xs font-mono text-slate-400">
                          {item.phonetic}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSpeak(item.word, 0.95, item.id)}
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleMastered(item.id)}
                          className={`p-1.5 rounded-lg border transition ${
                            isMastered
                              ? 'bg-emerald-500 text-white border-emerald-500'
                              : 'text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {item.translationUz}
                    </p>

                    <p className="text-[11px] text-slate-500 italic mt-0.5">
                      "{item.definitionEn}"
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 mt-2 border border-slate-100 dark:border-slate-750">
                      <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                        "{item.exampleEn}"
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        "{item.exampleUz}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {item.book}
                    </span>
                    <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono font-bold">
                      {item.level} • {item.partOfSpeech}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
