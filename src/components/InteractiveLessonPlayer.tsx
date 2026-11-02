'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Volume2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Award,
  RotateCcw,
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Check,
  Play,
  Pause,
  FileText,
  X,
  Gauge
} from 'lucide-react';
import { Lesson, Exercise } from '@/lib/data/curriculum';
import { speakText, stopSpeaking, isSpeechRecognitionSupported, SoundFX } from '@/lib/speech';

interface InteractiveLessonPlayerProps {
  lesson: Lesson;
  onComplete: (lessonId: string) => void;
  onBackToCourse: () => void;
  apiKey: string;
  soundEnabled: boolean;
}

type LessonStep = 'theory' | 'vocab' | 'exercises' | 'teacher_check' | 'finished';

export default function InteractiveLessonPlayer({
  lesson,
  onComplete,
  onBackToCourse,
  apiKey,
  soundEnabled,
}: InteractiveLessonPlayerProps) {
  const [currentStep, setCurrentStep] = useState<LessonStep>('theory');
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  // Exercise state
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [rearrangedWords, setRearrangedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [exerciseFeedback, setExerciseFeedback] = useState<{
    isChecked: boolean;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);
  const [score, setScore] = useState(0);

  // Teacher Check state
  const [teacherChat, setTeacherChat] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [studentInput, setStudentInput] = useState('');
  const [isTeacherLoading, setIsTeacherLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [teacherPassed, setTeacherPassed] = useState(false);

  const recognitionRef = useRef<any>(null);

  const activeExercise: Exercise | undefined = lesson.exercises[currentExIndex];

  // Initialize rearrange words when exercise changes
  useEffect(() => {
    if (activeExercise && activeExercise.type === 'rearrange' && activeExercise.words) {
      setRearrangedWords([]);
      setAvailableWords([...activeExercise.words].sort(() => 0.5 - Math.random()));
    } else {
      setRearrangedWords([]);
      setAvailableWords([]);
    }
    setSelectedOption(null);
    setTypedAnswer('');
    setShowHint(false);
    setExerciseFeedback(null);
  }, [currentExIndex, activeExercise]);

  // Initialize teacher check
  useEffect(() => {
    if (currentStep === 'teacher_check' && teacherChat.length === 0) {
      const initialGreeting = lesson.teacherCheck.starterQuestion;
      setTeacherChat([{ role: 'assistant', text: initialGreeting }]);
      if (soundEnabled) SoundFX.playChime();
      speakText(initialGreeting, { rate: speechRate });
    }
  }, [currentStep, lesson, speechRate, soundEnabled]);

  // Setup speech recognition
  useEffect(() => {
    if (isSpeechRecognitionSupported() && typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setStudentInput(text);
        setIsListening(false);
      };

      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }

    return () => {
      stopSpeaking();
    };
  }, []);

  const playCustomAudio = (text: string, onEnd?: () => void) => {
    speakText(text, { rate: speechRate, onEnd });
  };

  // Play all examples sequentially
  const handlePlayAllExamples = () => {
    if (isPlayingAll) {
      stopSpeaking();
      setIsPlayingAll(false);
      return;
    }

    const allExamples = lesson.rules.flatMap((r) => r.examples.map((e) => e.en));
    if (allExamples.length === 0) return;

    setIsPlayingAll(true);
    let index = 0;

    const playNext = () => {
      if (index >= allExamples.length) {
        setIsPlayingAll(false);
        return;
      }
      playCustomAudio(allExamples[index], () => {
        index++;
        setTimeout(playNext, 600);
      });
    };

    playNext();
  };

  // Handle rearrange word clicks
  const handleWordClick = (word: string, index: number) => {
    if (exerciseFeedback?.isChecked) return;
    if (soundEnabled) SoundFX.playClick();
    setRearrangedWords([...rearrangedWords, word]);
    const nextAvailable = [...availableWords];
    nextAvailable.splice(index, 1);
    setAvailableWords(nextAvailable);
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (exerciseFeedback?.isChecked) return;
    if (soundEnabled) SoundFX.playClick();
    const nextArranged = [...rearrangedWords];
    nextArranged.splice(index, 1);
    setRearrangedWords(nextArranged);
    setAvailableWords([...availableWords, word]);
  };

  // Check exercise answer
  const handleCheckExercise = () => {
    if (!activeExercise || exerciseFeedback?.isChecked) return;

    let userAnswer = '';
    if (activeExercise.type === 'multiple-choice') {
      userAnswer = selectedOption || '';
    } else if (activeExercise.type === 'rearrange') {
      userAnswer = rearrangedWords.join(' ').trim();
    } else {
      userAnswer = typedAnswer.trim();
    }

    const clean = (s: string) => s.toLowerCase().replace(/[.,?!]/g, '').trim();
    const isCorrect = clean(userAnswer) === clean(activeExercise.correctAnswer);

    setExerciseFeedback({
      isChecked: true,
      isCorrect,
      explanation: activeExercise.explanationUz,
    });

    if (isCorrect) {
      setScore((prev) => prev + 25);
      if (soundEnabled) SoundFX.playSuccess();
    } else {
      if (soundEnabled) SoundFX.playChime();
    }
  };

  const handleNextExercise = () => {
    if (currentExIndex < lesson.exercises.length - 1) {
      setCurrentExIndex((prev) => prev + 1);
    } else {
      setCurrentStep('teacher_check');
    }
  };

  // Submit response to AI Teacher in Teacher Check
  const handleTeacherSubmit = async () => {
    const text = studentInput.trim();
    if (!text || isTeacherLoading) return;

    stopSpeaking();
    if (soundEnabled) SoundFX.playClick();

    const newHistory = [...teacherChat, { role: 'user' as const, text }];
    setTeacherChat(newHistory);
    setStudentInput('');
    setIsTeacherLoading(true);
    setTeacherPassed(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.text,
          })),
          persona: 'tutor',
          userLevel: lesson.level,
          lessonId: lesson.id,
          apiKey,
        }),
      });

      const data = await response.json();
      if (data.reply) {
        const replyText = data.reply as string;
        setTeacherChat((prev) => [...prev, { role: 'assistant', text: replyText }]);
        playCustomAudio(replyText);
        setTeacherPassed(data.passed === true && !data.isFallback);
        if (soundEnabled && data.passed === true) SoundFX.playSuccess();
      }
    } catch (e) {
      console.error(e);
      const fallbackMsg = "Ustoz bilan bog‘lanib bo‘lmadi. Javobingiz baholanmadi. Qayta urinib ko‘ring.";
      setTeacherChat((prev) => [...prev, { role: 'assistant', text: fallbackMsg }]);
      playCustomAudio(fallbackMsg);
      setTeacherPassed(false);
    } finally {
      setIsTeacherLoading(false);
    }
  };

  const handleFinishLesson = () => {
    if (!teacherPassed) return;
    if (soundEnabled) SoundFX.playSuccess();
    onComplete(lesson.id);
    setCurrentStep('finished');
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-6 animate-fade-in">
      {/* Top Header & Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
          <button
            onClick={onBackToCourse}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Darslar xaritasiga qaytish</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Audio speed selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">
              <Gauge className="w-3.5 h-3.5 text-indigo-500" />
              <button
                onClick={() => setSpeechRate(0.75)}
                className={`px-1 rounded ${speechRate === 0.75 ? 'text-indigo-600 font-black underline' : ''}`}
              >
                0.75x
              </button>
              <span>•</span>
              <button
                onClick={() => setSpeechRate(0.95)}
                className={`px-1 rounded ${speechRate === 0.95 ? 'text-indigo-600 font-black underline' : ''}`}
              >
                1.0x
              </button>
              <span>•</span>
              <button
                onClick={() => setSpeechRate(1.2)}
                className={`px-1 rounded ${speechRate === 1.2 ? 'text-indigo-600 font-black underline' : ''}`}
              >
                1.2x
              </button>
            </div>

            {/* Cheat Sheet Toggle */}
            <button
              onClick={() => setShowCheatSheet(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold hover:bg-amber-100 transition"
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>Konspekt</span>
            </button>

            <span className="text-xs font-extrabold px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-200 dark:border-indigo-800">
              {lesson.level} • {lesson.durationMin} daqiqa
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {lesson.titleUz}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{lesson.descriptionUz}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">To'plangan ball:</span>
            <span className="text-base font-black text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-800">
              ⚡ {score}
            </span>
          </div>
        </div>

        {/* Step Navigation Bar */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          {[
            { id: 'theory', label: '1. Nazariya', icon: '📖' },
            { id: 'vocab', label: '2. Yangi So\'zlar', icon: '🧠' },
            { id: 'exercises', label: '3. Mashqlar', icon: '✍️' },
            { id: 'teacher_check', label: '4. AI Ustoz', icon: '🧑‍🏫' },
          ].map((st) => {
            const isCurrent = currentStep === st.id;
            return (
              <button
                key={st.id}
                onClick={() => {
                  stopSpeaking();
                  setCurrentStep(st.id as LessonStep);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                <span>{st.icon}</span>
                <span className="hidden sm:inline">{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: THEORY & RULES */}
      {currentStep === 'theory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Grammatik qoidalar va misollar:
            </span>
            <button
              onClick={handlePlayAllExamples}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                isPlayingAll
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'
              }`}
            >
              {isPlayingAll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingAll ? "To'xtatish" : "Barchasini ketma-ket tinglash"}</span>
            </button>
          </div>

          {lesson.rules.map((rule, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4"
            >
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>{rule.title}</span>
              </h3>

              {rule.formula && (
                <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                    Grammatik formula:
                  </span>
                  <p className="text-sm font-black text-indigo-950 dark:text-indigo-200 font-mono">
                    {rule.formula}
                  </p>
                </div>
              )}

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {rule.explanationUz}
              </p>

              {/* Examples with speech */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Namunaviy jumlalar:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {rule.examples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3.5 flex items-start justify-between gap-3 group hover:border-indigo-400 transition"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          "{ex.en}"
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{ex.uz}</p>
                      </div>
                      <button
                        onClick={() => playCustomAudio(ex.en)}
                        title="Talaffuzni tinglash"
                        className="p-1.5 rounded-xl text-slate-400 group-hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 transition"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={() => {
                stopSpeaking();
                if (soundEnabled) SoundFX.playClick();
                setCurrentStep('vocab');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition"
            >
              <span>2-Qadam: Yangi so'zlarni o'rganish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: VOCABULARY */}
      {currentStep === 'vocab' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              Darsning Kalit So'zlari va Iboralari
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Har bir so'zning talaffuzini eshiting va misol jumlalarga diqqat qiling
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lesson.vocabulary.map((voc, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-400 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          {voc.word}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 font-mono">
                          {voc.phonetic}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">
                        {voc.partOfSpeech}
                      </span>
                    </div>

                    <button
                      onClick={() => playCustomAudio(voc.word)}
                      className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 hover:bg-indigo-100 transition"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {voc.translationUz}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                      "{voc.exampleEn}"
                    </p>
                    <p className="text-[11px] text-slate-400">"{voc.exampleUz}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep('theory')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Orqaga: Nazariya</span>
            </button>

            <button
              onClick={() => {
                stopSpeaking();
                if (soundEnabled) SoundFX.playClick();
                setCurrentStep('exercises');
              }}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition"
            >
              <span>3-Qadam: Interaktiv Mashqlarga O'tish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: INTERACTIVE EXERCISES */}
      {currentStep === 'exercises' && activeExercise && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          {/* Exercise Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">
              Topshiriq {currentExIndex + 1} / {lesson.exercises.length}
            </span>

            <div className="flex items-center gap-3">
              {activeExercise.hintUz && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? "Yordamni yopish" : "Yordam (Hint)"}</span>
                </button>
              )}

              <div className="w-28 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{
                    width: `${((currentExIndex + 1) / lesson.exercises.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Hint Card */}
          {showHint && activeExercise.hintUz && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 animate-fade-in flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{activeExercise.hintUz}</span>
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-1">
            {activeExercise.contextUz && (
              <span className="text-xs font-semibold text-slate-400 block">
                {activeExercise.contextUz}
              </span>
            )}
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-relaxed">
              {activeExercise.question}
            </h3>
          </div>

          {/* 1. Multiple Choice */}
          {activeExercise.type === 'multiple-choice' && activeExercise.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {activeExercise.options.map((opt, i) => (
                <button
                  key={i}
                  disabled={exerciseFeedback?.isChecked}
                  onClick={() => setSelectedOption(opt)}
                  className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition flex items-center justify-between ${
                    selectedOption === opt
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <span>{opt}</span>
                  {selectedOption === opt && (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* 2. Rearrange Words */}
          {activeExercise.type === 'rearrange' && (
            <div className="space-y-6 pt-2">
              <div className="min-h-[60px] p-4 bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-2xl flex flex-wrap gap-2 items-center">
                {rearrangedWords.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    Quyidagi so'zlarni bosib ketma-ket joylashtiring...
                  </span>
                ) : (
                  rearrangedWords.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRemoveWord(word, idx)}
                      className="px-3.5 py-2 bg-indigo-600 text-white font-extrabold text-sm rounded-xl shadow-sm hover:bg-red-500 transition"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {availableWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleWordClick(word, idx)}
                    className="px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-sm rounded-2xl hover:border-indigo-500 hover:scale-105 active:scale-95 transition shadow-sm"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Fill Blank or Translate */}
          {(activeExercise.type === 'fill-blank' || activeExercise.type === 'translate') && (
            <div className="pt-2">
              <input
                type="text"
                value={typedAnswer}
                disabled={exerciseFeedback?.isChecked}
                onChange={(e) => setTypedAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (!exerciseFeedback?.isChecked) handleCheckExercise();
                    else handleNextExercise();
                  }
                }}
                placeholder="Inglizcha javobingizni shu yerga yozing..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-base font-semibold focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* Feedback Card */}
          {exerciseFeedback && (
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 animate-fade-in ${
                exerciseFeedback.isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-900 dark:text-emerald-200'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-200 text-red-900 dark:text-red-200'
              }`}
            >
              {exerciseFeedback.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="text-xs font-black uppercase tracking-wider block">
                  {exerciseFeedback.isCorrect ? "To'g'ri! Barakalla!" : "Xato! To'g'ri javob:"}
                </span>
                {!exerciseFeedback.isCorrect && (
                  <p className="text-sm font-black mt-0.5 font-mono">
                    "{activeExercise.correctAnswer}"
                  </p>
                )}
                <p className="text-xs mt-1 opacity-90">{exerciseFeedback.explanation}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            {!exerciseFeedback?.isChecked ? (
              <button
                onClick={handleCheckExercise}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-500/25 transition"
              >
                Tekshirish
              </button>
            ) : (
              <button
                onClick={handleNextExercise}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-500/25 transition"
              >
                <span>
                  {currentExIndex < lesson.exercises.length - 1
                    ? 'Keyingi mashq'
                    : 'AI Ustoz bilan amaliyotga o\'tish'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 4: TEACHER CHECK */}
      {currentStep === 'teacher_check' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  Miss Sarah bilan Jonli Dars Mashg'uloti
                </h3>
                <p className="text-xs text-slate-500">
                  Darsni muvaffaqiyatli yakunlash uchun ustoz savollariga inglizcha javob bering
                </p>
              </div>
            </div>

            {teacherPassed && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Ustoz Tasdiqladi</span>
              </span>
            )}
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-200">
            <span className="font-bold block mb-1">🎯 Dars Maqsadi:</span>
            {lesson.teacherCheck.sampleGoalUz}
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60">
            {teacherChat.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-sm max-w-[80%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => playCustomAudio(msg.text)}
                      className="mt-1.5 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Eshitish</span>
                    </button>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTeacherLoading && (
              <div className="text-xs text-slate-400 italic pl-9">Ustoz javob yozmoqda...</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isListening) {
                  recognitionRef.current?.stop();
                  setIsListening(false);
                } else {
                  recognitionRef.current?.start();
                  setIsListening(true);
                  if (soundEnabled) SoundFX.playClick();
                }
              }}
              className={`p-3 rounded-xl transition ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTeacherSubmit()}
              placeholder="Javobingizni yozing yoki mikrofon orqali ayting..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={handleTeacherSubmit}
              disabled={!studentInput.trim() || isTeacherLoading}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-md transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleFinishLesson}
              disabled={!teacherPassed || isTeacherLoading}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/25 transition"
            >
              <Award className="w-5 h-5" />
              <span>Darsni Muvaffaqiyatli Yakunlash!</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: FINISHED CELEBRATION */}
      {currentStep === 'finished' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-white mx-auto shadow-xl shadow-amber-400/20 animate-bounce">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Tabriklaymiz! Dars Yakunlandi! 🎉
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Siz "{lesson.titleUz}" darsini a'lo darajada o'zlashtirdingiz. Yangi bilim va tajriba sizga keyingi bosqichlarda poydevor bo'ladi!
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-[120px]">
              <span className="text-xs font-bold text-slate-400 block">Dars Balli</span>
              <span className="text-2xl font-black text-indigo-600 mt-1 block">+{score}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-[120px]">
              <span className="text-xs font-bold text-slate-400 block">Darajangiz</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                {lesson.level}
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={onBackToCourse}
              className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/30 transition"
            >
              <span>Keyingi Darslarga O'tish</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* CHEAT SHEET MODAL / POPUP */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 dark:text-white">
                  Dars Konspekti: {lesson.titleUz}
                </h3>
              </div>
              <button
                onClick={() => setShowCheatSheet(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {lesson.rules.map((rule, idx) => (
                <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rule.title}</h4>
                  {rule.formula && (
                    <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                      {rule.formula}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 dark:text-slate-300">{rule.explanationUz}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowCheatSheet(false)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
