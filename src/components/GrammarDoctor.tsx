'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setMasteredTopics(parsed.filter((id) => GRAMMAR_TOPICS_LIST.some(t => t.id === id)));
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
    { id: 'Nouns & Articles', label: 'Ot va artikllar' },
    { id: 'Connectors & Conjunctions', label: 'Bog‘lovchilar' },
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
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizScore, setQuizScore] = useState(0);
  const lessonDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selectedTopic) {
      lessonDialog.current?.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = previous; };
    }
  }, [selectedTopic]);
  const openTopic = (topic: GrammarTopic) => {
    setQuizAnswers({});
    setSelectedTopic(topic);
    onActivity();
  };
  const handleSelectQuizAnswer = (id: string, ans: string, correctAns: string) => {
    if (quizAnswers[id] !== undefined) return;
    setQuizAnswers(prev => ({ ...prev, [id]: ans }));
    onActivity();
    if (ans === correctAns) {
      setQuizScore(prev => prev + 10);
      if (soundEnabled) SoundFX.playSuccess();
    } else if (soundEnabled) SoundFX.playChime();
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
  const [assessmentError, setAssessmentError] = useState('');
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
    setAssessmentError('');
    setDoctorResult(null);
    onActivity();

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: text, apiKey }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Baholash bajarilmadi');
      if (!data.error) {
        setDoctorResult(data);
        if (soundEnabled) {
          if (data.isCorrect) SoundFX.playSuccess();
          else SoundFX.playChime();
        }
      }
    } catch (err) {
      console.error('Analyze error:', err);
      setAssessmentError(err instanceof Error ? err.message : 'Server bilan bog‘lanib bo‘lmadi. Qayta urinib ko‘ring.');
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
    <div className="grammar-studio">
      <header className="grammar-hero">
        <div className="grammar-hero-copy">
          <span className="grammar-eyebrow"><Sparkles size={15} /> GRAMMAR STUDIO</span>
          <h1>Qoidani tushuning.<br /><em>Ishonch bilan gapiring.</em></h1>
          <p>Bir mavzu, aniq formula, jonli misollar. Bilimingizni darhol mashqda sinab ko‘ring.</p>
          <div className="grammar-mode" aria-label="O‘rganish rejimi">
            <button aria-pressed={activeMode === 'library'} onClick={() => setActiveMode('library')}><BookOpen size={18} /> Darslar kutubxonasi</button>
            <button aria-pressed={activeMode === 'doctor'} onClick={() => setActiveMode('doctor')}><Stethoscope size={18} /> AI Grammar Doctor</button>
          </div>
        </div>
        <div className="grammar-formula-art" aria-hidden="true">
          <span className="grammar-art-label">GAP QURISH USTAXONASI</span>
          <div className="grammar-tokens"><span>I<small>ega</small></span><b>+</b><span>am<small>fe’l</small></span><b>+</b><span>ready<small>sifat</small></span></div>
          <div className="grammar-art-result"><CheckCircle2 size={21} /> I am ready to learn.</div>
          <span className="grammar-art-note">Kichik qadamlar. Katta o‘zgarish.</span>
        </div>
      </header>
      <div className="grammar-progress-strip">
        <div><span className="grammar-progress-icon"><GraduationCap /></span><span><strong>{masteredTopics.length} / {GRAMMAR_TOPICS_LIST.length}</strong><small>Mavzu o‘zlashtirilgan</small></span></div>
        <div className="grammar-progress-track" role="progressbar" aria-label="O‘zlashtirilgan mavzular" aria-valuenow={masteredTopics.length} aria-valuemin={0} aria-valuemax={GRAMMAR_TOPICS_LIST.length}><span style={{width: (masteredTopics.length / GRAMMAR_TOPICS_LIST.length * 100) + '%'}} /></div>
        <div><Sparkles size={20} /><span><strong>{quizScore} ball</strong><small>Ushbu sessiyadagi natija</small></span></div>
      </div>
      {activeMode === 'library' ? (
        <div className="grammar-library">
          <div className="grammar-section-title"><div><span className="grammar-eyebrow">SIZNING O‘QUV YO‘LINGIZ</span><h2>Bugun nimani o‘rganamiz?</h2></div><span>{filteredTopics.length} ta mavzu</span></div>
          <div className="grammar-collections">
            {GRAMMAR_SERIES_INFO.map((series, index) => {
              const total = GRAMMAR_TOPICS_LIST.filter(t => series.id === 'All' || t.series === series.id).length;
              return <button key={series.id} aria-pressed={selectedSeries === series.id} onClick={() => {setSelectedSeries(series.id); setSelectedBook('All');}}>
                <span className="grammar-collection-top"><BookOpen size={21} /><span>0{index + 1}</span></span>
                <strong>{series.name}</strong><span>{total} mavzu <ChevronRight size={15} /></span>
              </button>;
            })}
          </div>
          <div className="grammar-filters">
            <label className="grammar-search"><Search size={19}/><input aria-label="Grammatika mavzusini qidirish" placeholder="Mavzu yoki formulani qidiring…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></label>
            <label>Kitob<select value={selectedBook} onChange={e => setSelectedBook(e.target.value)}><option value="All">Barcha kitoblar</option>{availableBooks.map(book => <option key={book.id} value={book.id}>{book.name} · {book.level}</option>)}</select></label>
            <label>Bo‘lim<select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as GrammarCategory)}>{categoriesList.map(category => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label>
          </div>
          {filteredTopics.length === 0 ? <div className="grammar-empty"><Search size={32}/><h3>Mavzu topilmadi</h3><p>Boshqa so‘z yozing yoki filtrlarni tozalang.</p><button onClick={() => {setSelectedSeries('All');setSelectedBook('All');setSelectedCategory('All');setSearchQuery('');}}>Filtrlarni tozalash</button></div> :
            <div className="grammar-topic-grid">{filteredTopics.map((topic, index) => {
              const mastered = masteredTopics.includes(topic.id);
              return <article key={topic.id} className="grammar-topic" style={{'--card-delay': Math.min(index, 5) * 55 + 'ms'} as React.CSSProperties}>
                <div className="grammar-topic-meta"><span>{topic.level} <span>· {topic.series}</span></span><button aria-label={mastered ? 'O‘zlashtirilgan belgini olib tashlash' : 'O‘zlashtirildi deb belgilash'} aria-pressed={mastered} onClick={() => toggleMasteredTopic(topic.id)}>{mastered ? <CheckCircle2 size={20}/> : <Bookmark size={20}/>}</button></div>
                <span className="grammar-topic-unit">{topic.unit}</span><h3>{topic.titleEn}</h3><p>{topic.titleUz}</p>
                <div className="grammar-topic-formula"><span>FORMULA</span><code>{topic.formula}</code></div>
                <button className="grammar-open-lesson" onClick={() => openTopic(topic)}><span>{mastered ? 'Qayta mustahkamlash' : 'Darsni boshlash'}</span><span>{topic.practice.length} mashq <ChevronRight size={17}/></span></button>
              </article>;
            })}</div>}

          {/* 3. TOPIC DETAIL & PRACTICE MODAL */}
          {selectedTopic && (
            <dialog aria-label={selectedTopic.titleEn} ref={lessonDialog} className="grammar-lesson-dialog" onCancel={() => setSelectedTopic(null)} onClick={e => {if (e.target === e.currentTarget) setSelectedTopic(null);}}>
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
                    aria-label="Darsni yopish" onClick={() => setSelectedTopic(null)}
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
                            const isChosen = quizAnswers[q.id] === opt;
                            const isCorrect = opt === q.correctAnswer;

                            let btnCls =
                              'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400';

                            if ((quizAnswers[q.id] !== undefined)) {
                              if (isCorrect) {
                                btnCls = 'bg-emerald-500 text-white border-emerald-500 font-bold';
                              } else if (isChosen && !isCorrect) {
                                btnCls = 'bg-red-500 text-white border-red-500';
                              }
                            }

                            return (
                              <button
                                key={i}
                                disabled={(quizAnswers[q.id] !== undefined)}
                                onClick={() => handleSelectQuizAnswer(q.id, opt, q.correctAnswer)}
                                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition ${btnCls}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {(quizAnswers[q.id] !== undefined) && (
                          <div className="text-xs pt-1">
                            <p className="font-semibold text-slate-700 dark:text-slate-300">
                              {quizAnswers[q.id] === q.correctAnswer ? '🎉 Ajoyib! To‘g‘ri javob. ' : '💡 Keling, tushunib olamiz. '}{q.explanationUz}
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
            </dialog>
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
      {assessmentError && <p role="alert" className="text-red-500 p-3">{assessmentError}</p>}
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
