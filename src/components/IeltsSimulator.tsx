'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Mic,
  MicOff,
  Volume2,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Play,
  RotateCcw
} from 'lucide-react';
import { IELTS_TOPICS, IeltsTopic } from '@/lib/data/ielts-topics';
import { speakText, stopSpeaking, isSpeechRecognitionSupported, SoundFX } from '@/lib/speech';

interface IeltsEvaluation {
  overallBand: number;
  scores: {
    fluency: number;
    lexical: number;
    grammar: number;
    pronunciation: number;
  };
  summaryUz: string;
  strengths: string[];
  weaknesses: string[];
  highBandPhrases: string[];
}

interface IeltsSimulatorProps {
  apiKey: string;
  soundEnabled: boolean;
  onActivity: () => void;
}

export default function IeltsSimulator({ apiKey, soundEnabled, onActivity }: IeltsSimulatorProps) {
  const [selectedTopic, setSelectedTopic] = useState<IeltsTopic>(IELTS_TOPICS[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<IeltsEvaluation | null>(null);

  // Cue card timers
  const [prepTimeLeft, setPrepTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isSpeechRecognitionSupported() && typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-GB'; // British English for IELTS

      rec.onresult = (event: any) => {
        let text = '';
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript + ' ';
        }
        setTranscript(text);
      };

      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);

      recognitionRef.current = rec;
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

  // Timer countdown for Part 2 preparation
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && prepTimeLeft > 0) {
      interval = setInterval(() => {
        setPrepTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (prepTimeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      if (soundEnabled) SoundFX.playSuccess();
      speakText("Preparation time is up! Please begin speaking now.", { lang: 'en-GB' });
    }
    return () => clearInterval(interval);
  }, [timerRunning, prepTimeLeft, soundEnabled]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Brauzeringiz ovoz yozishni qo'llab-quvvatlamaydi (Google Chrome yoki Edge tavsiya etiladi).");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      stopSpeaking();
      setTranscript('');
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        if (soundEnabled) SoundFX.playClick();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleExaminerAsk = (text: string) => {
    speakText(text, { lang: 'en-GB' });
  };

  const handleSubmitEvaluation = async () => {
    if (!transcript.trim() || isEvaluating) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    if (soundEnabled) SoundFX.playClick();
    setIsEvaluating(true);
    onActivity();

    const activeQ =
      selectedTopic.cueCard ? selectedTopic.cueCard.topic : selectedTopic.questions[currentQuestionIndex];

    try {
      const res = await fetch('/api/ielts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQ,
          transcript,
          apiKey,
        }),
      });

      const data = await res.json();
      if (!data.error) {
        setEvaluation(data);
        if (soundEnabled) SoundFX.playSuccess();
      }
    } catch (e) {
      console.error('Evaluation error:', e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md mb-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Official IELTS Speaking Band 9 Simulator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              IELTS Speaking Imtihon Xonasi
            </h2>
            <p className="text-blue-100/80 text-sm mt-1 max-w-xl">
              British Council standarti bo'yicha sun'iy intellektli imtihon oluvchi (Examiner) bilan suhbat qiling va 4 ta mezon bo'yicha aniq Band Score (1.0 - 9.0) oling.
            </p>
          </div>

          <div className="flex gap-2">
            {IELTS_TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopic(topic);
                  setCurrentQuestionIndex(0);
                  setEvaluation(null);
                  setTranscript('');
                  setPrepTimeLeft(60);
                  setTimerRunning(false);
                }}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition ${
                  selectedTopic.id === topic.id
                    ? 'bg-white text-blue-900 border-white shadow-md'
                    : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
                }`}
              >
                {topic.part}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Examination Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Examiner Question & Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {selectedTopic.part} • {selectedTopic.category}
              </span>
              <button
                onClick={() => {
                  const q = selectedTopic.cueCard
                    ? selectedTopic.cueCard.topic
                    : selectedTopic.questions[currentQuestionIndex];
                  handleExaminerAsk(q);
                }}
                className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                <Volume2 className="w-4 h-4" />
                <span>Examiner ovozini tinglash</span>
              </button>
            </div>

            {/* Cue Card view for Part 2 */}
            {selectedTopic.cueCard ? (
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl">
                  <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                    {selectedTopic.cueCard.topic}
                  </h4>
                  <p className="text-xs text-slate-500 mb-2 font-medium">You should say:</p>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside">
                    {selectedTopic.cueCard.bulletPoints.map((bp, i) => (
                      <li key={i}>{bp}</li>
                    ))}
                  </ul>
                </div>

                {/* 1 Minute Prep Countdown */}
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Tayyorgarlik vaqti: {prepTimeLeft} soniya</span>
                  </div>
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{timerRunning ? 'Pauza' : 'Tayyorgarlikni boshlash'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Part 1 / Part 3 Questions */
              <div className="mt-4 space-y-3">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  "{selectedTopic.questions[currentQuestionIndex]}"
                </h4>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400">
                    Savol {currentQuestionIndex + 1} / {selectedTopic.questions.length}
                  </span>
                  {selectedTopic.questions.length > 1 && (
                    <button
                      onClick={() => {
                        setCurrentQuestionIndex(
                          (prev) => (prev + 1) % selectedTopic.questions.length
                        );
                        setTranscript('');
                        setEvaluation(null);
                      }}
                      className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 font-semibold"
                    >
                      <span>Keyingi savol</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Spoken Answer Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Sizning Javobingiz (Nutq transkripti):
              </span>
              <span className="text-xs text-slate-400">
                {transcript.trim() ? `${transcript.trim().split(/\s+/).length} ta so'z` : '0 ta so\'z'}
              </span>
            </div>

            <textarea
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Mikrofon tugmasini bosing va inglizcha javob bering, yoki javobingizni shu yerga yozing..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-sm ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? 'Yozishni to\'xtatish' : 'Mikrofon bilan gapirish'}</span>
              </button>

              <button
                onClick={handleSubmitEvaluation}
                disabled={!transcript.trim() || isEvaluating}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-500/20 transition"
              >
                {isEvaluating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Examiner baholamoqda...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Examinerga topshirish & Baho olish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Band 9 Vocab Hints */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              Ushbu mavzu uchun Band 8-9 Iboralar:
            </h4>
            <div className="space-y-2">
              {selectedTopic.sampleVocab.map((vocab, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {vocab}
                  </span>
                  <button
                    onClick={() => speakText(vocab)}
                    className="p-1 text-slate-400 hover:text-indigo-600"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* IELTS Evaluation Report Card */}
      {evaluation && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Official Examination Report
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                IELTS Speaking Tahlili & Natija
              </h3>
            </div>

            {/* Big Band Score Circle */}
            <div className="flex items-center gap-3 bg-gradient-to-tr from-amber-500 to-orange-500 text-white px-5 py-3 rounded-2xl shadow-lg shadow-amber-500/25">
              <Award className="w-8 h-8" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block">
                  Overall Band
                </span>
                <span className="text-3xl font-black leading-none">
                  {evaluation.overallBand.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Criteria Subscores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Fluency & Coherence', score: evaluation.scores.fluency },
              { label: 'Lexical Resource', score: evaluation.scores.lexical },
              { label: 'Grammar Accuracy', score: evaluation.scores.grammar },
              { label: 'Pronunciation', score: evaluation.scores.pronunciation },
            ].map((crit, i) => (
              <div
                key={i}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-center"
              >
                <span className="text-[11px] font-semibold text-slate-500 block truncate">
                  {crit.label}
                </span>
                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block">
                  {crit.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>

          {/* Summary Uzbek */}
          <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-4">
            <p className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed">
              💡 {evaluation.summaryUz}
            </p>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Kuchli tomonlaringiz:</span>
              </span>
              <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                {evaluation.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>O'stirish kerak bo'lgan jihatlar:</span>
              </span>
              <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300 list-disc list-inside">
                {evaluation.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* High Band Phrases */}
          {evaluation.highBandPhrases && evaluation.highBandPhrases.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Keyingi safar uchun Band 8.5+ iboralari:
              </span>
              <div className="flex flex-wrap gap-2">
                {evaluation.highBandPhrases.map((phrase, i) => (
                  <button
                    key={i}
                    onClick={() => speakText(phrase, { lang: 'en-GB' })}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-slate-800 dark:text-slate-200 rounded-xl transition font-medium border border-slate-200 dark:border-slate-700"
                  >
                    <Volume2 className="w-3 h-3 text-slate-400" />
                    <span>"{phrase}"</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
