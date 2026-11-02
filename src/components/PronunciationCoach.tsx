'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Headphones,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  Flame,
  Zap,
  Layers,
  Shuffle,
  Volume1,
  Check,
  TrendingUp,
  BookOpen,
  MessageSquareQuote,
  Smile,
} from 'lucide-react';
import { PRONUNCIATION_DRILLS, PronunciationDrill } from '@/lib/data/pronunciation-drills';
import { speakText, stopSpeaking, isSpeechRecognitionSupported, SoundFX, playBusterSpeech } from '@/lib/speech';

interface PronunciationCoachProps {
  soundEnabled: boolean;
  onActivity: () => void;
}

type CategoryType = 'All' | 'Consonants' | 'Minimal Pairs' | 'Connected Speech' | 'Tongue Twisters';

export interface SarcasticFeedback {
  text: string;
  mood: 'roasting' | 'laughing' | 'surprised' | 'smirking';
  badge: string;
  emoji: string;
}

// Generate witty, sarcastic Professor Buster feedback based on pronunciation accuracy
function generateSarcasticFeedback(
  score: number,
  userSpeech: string,
  drill: PronunciationDrill,
  missedWords: string[]
): SarcasticFeedback {
  if (!userSpeech.trim() || score === 0) {
    const list: SarcasticFeedback[] = [
      {
        text: "Voybooo! 💀 Hech narsa eshitilmadi-ku! Yo mikrofoning o'chgan, yo tiling muzlab qolgan! Qani, 0.7x sekin tezlikda eshitib, qaytadan baland ovozda o'qi-chi!",
        mood: 'roasting',
        badge: 'MIKROFON HAM HUSHIDAN KETDI',
        emoji: '💀',
      },
      {
        text: "Hahaha! 🤣 Jimjitlik... Bu yangi 'silent pronunciation' uslubimi?! Uyalmasdan ovozingni chiqarib o'qi!",
        mood: 'laughing',
        badge: "JIMJITLIK SAN'ATI",
        emoji: '🤫',
      },
      {
        text: "Tavba! 🤦‍♂️ Mikrofoning seni eshitmay uxlab qoldi. Qani, yana bir bor mikrofon tugmasini bosib, balandroq gapir-chi!",
        mood: 'roasting',
        badge: 'MIKROFON UXLADI',
        emoji: '😴',
      },
    ];
    return list[Math.floor(Math.random() * list.length)];
  }

  if (score < 45) {
    const missedStr =
      missedWords.length > 0
        ? ` Ayniqsa "${missedWords.slice(0, 2).join('", "')}" so'zlarini butunlay boshqacha aytib yubording!`
        : '';
    const list: SarcasticFeedback[] = [
      {
        text: `Voybooo! 💀 Inglizcha o'qidingmi yoki shumer tilida afsun o'qidingmi?! Tizim atigi ${score}% tushundi!${missedStr} Qani, 0.7x sekin tezlikda eshitib qaytadan o'qi!`,
        mood: 'roasting',
        badge: 'QOVURILDING 🔥',
        emoji: '💀',
      },
      {
        text: `Hahaha! 🤣 Sen gapirganingda Britaniya qirolichasi bir ag'darilib tushdi!${missedStr} Shoshilmasdan har bir so'zni dona-dona aytishga harakat qil!`,
        mood: 'laughing',
        badge: 'QIROLICHA SHOKDA',
        emoji: '🤣',
      },
      {
        text: `Tavba qildim! 🤦‍♂️ Quloqlarim qonab ketay dedi-ku! Bu talaffuz emas, xuddi qadimgi traktor motori o't ololmayotganga o'xshaydi.${missedStr} O'zingni qo'lga ol va qayta o'qi!`,
        mood: 'roasting',
        badge: 'TRAKTOR MOTOR TALAFUZI',
        emoji: '🚜',
      },
      {
        text: `IELTS examiner buni eshitganda minus 2 ball qo'yib, imtihon zalidan qochib ketardi! 🏃‍♂️ Qani, nafasingni rostlab yana bir bor urinib ko'r!`,
        mood: 'roasting',
        badge: 'EXAMINER QOCHIB KETDI',
        emoji: '🏃‍♂️',
      },
    ];
    return list[Math.floor(Math.random() * list.length)];
  }

  if (score < 70) {
    const missedStr =
      missedWords.length > 0
        ? ` Ayniqsa "${missedWords.slice(0, 2).join('", "')}" so'zlarida gaping qovun bo'ldi!`
        : '';
    const list: SarcasticFeedback[] = [
      {
        text: `Hmm, yomon emas... lekin yaxshi ham emas! 🤨 O'zbekcha aksenting London tumanidek quyuq sezilib turibdi!${missedStr} Qizil so'zlarga bir qarab qo'y!`,
        mood: 'smirking',
        badge: 'LONDON TUMANI',
        emoji: '🤨',
      },
      {
        text: `Buni talaffuz desa ham bo'ladi, lekin inglizlar eshitsa tarjimon qidirib qoladi! 😏 Yarmini to'g'ri aytding, qolgan yarmini esa yutib yubording!${missedStr}`,
        mood: 'smirking',
        badge: 'TARJIMON TALAB QILINADI',
        emoji: '😏',
      },
      {
        text: `Chala qovurilgan kabobdek bo'ldi! 🥩 Boshlanishi yaxshi edi, o'rtasida esa tiling chigallashib ketdi.${missedStr} Yana bir marta urinib ko'r, deyarli o'xshayapti!`,
        mood: 'laughing',
        badge: 'CHALA QOVURILGAN',
        emoji: '🥩',
      },
    ];
    return list[Math.floor(Math.random() * list.length)];
  }

  if (score < 85) {
    const list: SarcasticFeedback[] = [
      {
        text: `Oho, aql bovar qilmaydi! 😲 Burningni ko'tarma-yu, lekin ${score}% bilan kutilganidan ancha yaxshi chiqdi! Salgina harakat qilsang, chet elliklar seni o'zlariniki deb o'ylashi mumkin!`,
        mood: 'surprised',
        badge: 'KUTILMAGAN NATIJA',
        emoji: '😲',
      },
      {
        text: `Durust, durust! 👏 ${score}% aniqlik — yomon emas. Faqat 1-2 ta tovushda o'zbekcha jilvang sezilib qoldi. 90% ga yetkaza olasanmi o'zi?!`,
        mood: 'smirking',
        badge: 'DEYARLI NATIVE',
        emoji: '👏',
      },
      {
        text: `Hayron qoldirding! 🧐 Buni qara-ya, tavakkal aytmadingmi harholda? Yana bir marta aytsang, 100% bo'lishi aniq!`,
        mood: 'surprised',
        badge: 'PROFESSOR HAYRATDA',
        emoji: '🧐',
      },
    ];
    return list[Math.floor(Math.random() * list.length)];
  }

  // 85% to 100%
  const list: SarcasticFeedback[] = [
    {
      text: `Iya?! BBC diktori senmiding?! 🎩 Xato topolmay qoldim-ku, asabimni buzding! Qoyil, lekin bu faqat bitta gap edi, keyingisida ko'ramiz! 😏`,
      mood: 'surprised',
      badge: 'BBC DIKTORI',
      emoji: '🎩',
    },
    {
      text: `Daho! 🔥 Hatto Oksford professorlari ham bunchalik tiniq aytolmasdi. Men — Professor Buster seni maqtashga majbur bo'ldim, buni tarixga yozib qo'yish kerak!`,
      mood: 'surprised',
      badge: 'OKSFORD DARAJASI',
      emoji: '🔥',
    },
    {
      text: `Shapkamni yechaman! 👑 ${score}% toza talaffuz. Bironta kamchilik topolmadim, afsuski kinoya qilolmayman... Hozircha! 😏`,
      mood: 'smirking',
      badge: 'KAMCHILIKSIZ NATIJA',
      emoji: '👑',
    },
  ];
  return list[Math.floor(Math.random() * list.length)];
}

const CATEGORIES: {
  id: CategoryType;
  labelUz: string;
  labelEn: string;
  icon: any;
  color: string;
  gradient: string;
  description: string;
}[] = [
  {
    id: 'All',
    labelUz: 'Barcha Mashqlar',
    labelEn: 'All 22 Drills',
    icon: Sparkles,
    color: 'text-indigo-400',
    gradient: 'from-indigo-600 to-purple-600',
    description: 'To\'liq 22 ta fonetik va talaffuz mashqlari',
  },
  {
    id: 'Consonants',
    labelUz: 'Undosh & Unlilar',
    labelEn: 'Consonants & Vowels',
    icon: Layers,
    color: 'text-cyan-400',
    gradient: 'from-cyan-600 to-blue-600',
    description: '/θ/, /ð/, /w/, /v/, /r/, /l/, schwa /ə/ va aspiratsiyalar',
  },
  {
    id: 'Minimal Pairs',
    labelUz: 'Minimal Juftliklar',
    labelEn: 'Minimal Pairs',
    icon: Shuffle,
    color: 'text-emerald-400',
    gradient: 'from-emerald-600 to-teal-600',
    description: 'O\'xshash tovushlarni ajratish: /ɪ/ vs /iː/, /ʊ/ vs /uː/, /b/ vs /v/',
  },
  {
    id: 'Connected Speech',
    labelUz: 'Uzluksiz Nutq',
    labelEn: 'Connected Speech',
    icon: Zap,
    color: 'text-amber-400',
    gradient: 'from-amber-600 to-orange-600',
    description: 'So\'zlarni ulash (linking), Flap-T va reduktsiyalar (wanna/gonna)',
  },
  {
    id: 'Tongue Twisters',
    labelUz: 'Tez Aytishlar',
    labelEn: 'Tongue Twisters',
    icon: Flame,
    color: 'text-rose-400',
    gradient: 'from-rose-600 to-pink-600',
    description: 'Chaqqonlik va artikulyatsiya bo\'yicha super mashqlar',
  },
];

export default function PronunciationCoach({ soundEnabled, onActivity }: PronunciationCoachProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedDrill, setSelectedDrill] = useState<PronunciationDrill>(PRONUNCIATION_DRILLS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [wordResults, setWordResults] = useState<{ word: string; isCorrect: boolean }[]>([]);
  const [audioState, setAudioState] = useState<'idle' | 'normal' | 'slow' | string>('idle');
  const [completedDrills, setCompletedDrills] = useState<string[]>([]);
  
  // Sarcastic Coach Buster Feedback State
  const [sarcasticFeedback, setSarcasticFeedback] = useState<SarcasticFeedback | null>(null);
  const [isBusterSpeaking, setIsBusterSpeaking] = useState(false);
  const [busterAutoVoice, setBusterAutoVoice] = useState(true);

  const recognitionRef = useRef<any>(null);

  // Filtered drills list based on category
  const filteredDrills = selectedCategory === 'All'
    ? PRONUNCIATION_DRILLS
    : PRONUNCIATION_DRILLS.filter((d) => d.category === selectedCategory);

  // Current drill index in filtered list
  const currentIndex = filteredDrills.findIndex((d) => d.id === selectedDrill.id);

  // Speech helper: Professor Buster speaks in natural Uzbek
  const handlePlayBusterFeedback = (text: string) => {
    if (!soundEnabled) return;
    stopSpeaking();
    setIsBusterSpeaking(true);
    playBusterSpeech(
      text,
      () => setIsBusterSpeaking(false),
      () => setIsBusterSpeaking(false)
    );
  };

  // Initialize Speech Recognition
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
        setSpokenText(text);
        evaluatePronunciation(text, selectedDrill.sentence);
      };

      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);

      recognitionRef.current = rec;
    }

    return () => {
      stopSpeaking();
      setIsBusterSpeaking(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, [selectedDrill, busterAutoVoice, soundEnabled]);

  const cleanWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');

  const evaluatePronunciation = (userSpeech: string, targetSentence: string) => {
    onActivity();
    const targetWords = targetSentence.split(/\s+/);
    const spokenWords = userSpeech.split(/\s+/).map(cleanWord);

    let matchCount = 0;
    const results = targetWords.map((original) => {
      const cleaned = cleanWord(original);
      const isCorrect = spokenWords.includes(cleaned);
      if (isCorrect) matchCount++;
      return { word: original, isCorrect };
    });

    const score = Math.round((matchCount / targetWords.length) * 100);
    setWordResults(results);
    setAccuracyScore(score);

    // Generate Professor Buster's sarcastic feedback based on result
    const missed = results.filter((r) => !r.isCorrect).map((r) => r.word);
    const feedback = generateSarcasticFeedback(score, userSpeech, selectedDrill, missed);
    setSarcasticFeedback(feedback);

    if (score >= 70 && !completedDrills.includes(selectedDrill.id)) {
      setCompletedDrills((prev) => [...prev, selectedDrill.id]);
    }

    if (soundEnabled) {
      if (score >= 80) SoundFX.playSuccess();
      else if (score >= 50) SoundFX.playChime();
      else SoundFX.playBuzzer();

      if (busterAutoVoice) {
        setTimeout(() => {
          handlePlayBusterFeedback(feedback.text);
        }, 500);
      }
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Brauzeringiz ovoz yozishni qo'llab-quvvatlamaydi (Google Chrome yoki Microsoft Edge tavsiya etiladi).");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      stopSpeaking();
      setIsBusterSpeaking(false);
      setSpokenText('');
      setAccuracyScore(null);
      setWordResults([]);
      setSarcasticFeedback(null);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        if (soundEnabled) SoundFX.playClick();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handlePlayNormal = () => {
    stopSpeaking();
    setIsBusterSpeaking(false);
    setAudioState('normal');
    speakText(selectedDrill.sentence, {
      rate: 0.9,
      onEnd: () => setAudioState('idle'),
      onError: () => setAudioState('idle'),
    });
  };

  const handlePlaySlow = () => {
    stopSpeaking();
    setIsBusterSpeaking(false);
    setAudioState('slow');
    speakText(selectedDrill.sentence, {
      rate: 0.68,
      pitch: 0.95,
      onEnd: () => setAudioState('idle'),
      onError: () => setAudioState('idle'),
    });
  };

  const handlePlayWord = (word: string) => {
    stopSpeaking();
    setIsBusterSpeaking(false);
    const clean = word.replace(/[^a-zA-Z']/g, '');
    setAudioState(clean);
    speakText(clean, {
      rate: 0.75,
      onEnd: () => setAudioState('idle'),
      onError: () => setAudioState('idle'),
    });
  };

  const selectDrill = (drill: PronunciationDrill) => {
    stopSpeaking();
    setIsBusterSpeaking(false);
    setSelectedDrill(drill);
    setSpokenText('');
    setAccuracyScore(null);
    setWordResults([]);
    setSarcasticFeedback(null);
    setAudioState('idle');
  };

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < filteredDrills.length - 1) {
      selectDrill(filteredDrills[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      selectDrill(filteredDrills[currentIndex - 1]);
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Easy':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Hard':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'Master':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* 3D Header Hero */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-8 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Headphones className="w-3.5 h-3.5" />
              <span>AI Fonetika & Talaffuz Murabbiyi</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ingliz Tili <span className="neon-text-gradient">Sof Talaffuz</span> Laboratoriyasi
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              O'zbek tilida mavjud bo'lmagan murakkab inglizcha tovushlar (/θ/, /ð/, /w/, /r/), minimal juftliklar, uzluksiz nutq reduktsiyalari va dunyoga mashhur tez aytishlarni mikrofon orqali mashq qiling.
            </p>
          </div>

          {/* Quick Progress Stat */}
          <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-white/10 shrink-0 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {completedDrills.length} <span className="text-xs font-normal text-slate-400">/ 22</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">O'zlashtirilgan mashqlar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'All'
            ? PRONUNCIATION_DRILLS.length
            : PRONUNCIATION_DRILLS.filter(d => d.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                // If current drill not in selected category, pick first from new category
                if (cat.id !== 'All' && selectedDrill.category !== cat.id) {
                  const firstOfCat = PRONUNCIATION_DRILLS.find(d => d.category === cat.id);
                  if (firstOfCat) selectDrill(firstOfCat);
                }
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-800/90 border-indigo-500/60 shadow-lg shadow-indigo-500/20 translate-y-[-2px]'
                  : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-800/50'
              }`}
            >
              {isSelected && (
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.gradient}`} />
              )}
              <div className="flex items-center justify-between mb-1.5">
                <div className={`p-1.5 rounded-lg bg-white/5 ${cat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  {count} ta
                </span>
              </div>
              <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                {cat.labelUz}
              </h3>
              <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                {cat.labelEn}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Practice Arena & Drills Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Active Practice 3D Interactive Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Drill Header Info & Controls */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${getLevelBadge(selectedDrill.level)}`}>
                  {selectedDrill.level}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/5 text-indigo-300 border border-white/10">
                  {selectedDrill.category}
                </span>
              </div>

              {/* Navigation controls (prev / next) */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex <= 0}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Oldingi mashq"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-400 font-mono px-1">
                  {currentIndex + 1} / {filteredDrills.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= filteredDrills.length - 1}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition"
                  title="Keyingi mashq"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Focus Sound Banner */}
            <div className="flex items-center justify-between gap-3 bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-black text-sm">
                  🎯
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                    Fokus Tovush
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    {selectedDrill.focusSound}
                  </div>
                </div>
              </div>

              {/* Dual Speed Audio Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayNormal}
                  disabled={audioState === 'normal'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                    audioState === 'normal'
                      ? 'bg-indigo-600 text-white animate-pulse'
                      : 'bg-white/10 text-indigo-300 hover:bg-white/15 hover:text-white'
                  }`}
                  title="Oddiy tezlikda (1.0x)"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>1.0x Ovoz</span>
                </button>

                <button
                  onClick={handlePlaySlow}
                  disabled={audioState === 'slow'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                    audioState === 'slow'
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30'
                  }`}
                  title="Sekin va aniq artikulyatsiya (0.7x)"
                >
                  <Volume1 className="w-3.5 h-3.5" />
                  <span>0.7x Sekin</span>
                </button>
              </div>
            </div>

            {/* Sentence Presentation Box */}
            <div className="text-center py-6 px-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                Ovoz chiqarib o'qing (so'z ustiga bosib tinglashingiz mumkin):
              </span>

              {/* Interactive Word-by-Word Sentence */}
              <div className="text-xl sm:text-2xl font-black text-white leading-relaxed flex flex-wrap justify-center gap-2">
                {wordResults.length > 0 ? (
                  wordResults.map((item, idx) => {
                    const isPlayingThis = audioState === cleanWord(item.word);
                    return (
                      <button
                        key={idx}
                        onClick={() => handlePlayWord(item.word)}
                        className={`px-2.5 py-1 rounded-xl transition duration-200 cursor-pointer ${
                          isPlayingThis
                            ? 'scale-110 shadow-lg ring-2 ring-indigo-400'
                            : ''
                        } ${
                          item.isCorrect
                            ? 'text-emerald-300 bg-emerald-950/50 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                            : 'text-rose-400 bg-rose-950/50 border border-rose-500/40 underline decoration-wavy'
                        }`}
                        title="Tinglash uchun bosing"
                      >
                        {item.word}
                      </button>
                    );
                  })
                ) : (
                  selectedDrill.sentence.split(/\s+/).map((word, idx) => {
                    const isPlayingThis = audioState === cleanWord(word);
                    return (
                      <button
                        key={idx}
                        onClick={() => handlePlayWord(word)}
                        className={`px-2 py-0.5 rounded-lg transition-all duration-150 hover:bg-indigo-500/20 hover:text-indigo-300 text-white ${
                          isPlayingThis ? 'bg-indigo-600 text-white scale-105 shadow-md' : ''
                        }`}
                        title="Tinglash uchun bosing"
                      >
                        {word}
                      </button>
                    );
                  })
                )}
              </div>

              {/* IPA Phonetic Transcription */}
              <div className="inline-block px-4 py-1.5 rounded-xl bg-slate-900/80 border border-white/10">
                <p className="text-xs sm:text-sm text-cyan-300 font-mono tracking-wide">
                  {selectedDrill.phonetic}
                </p>
              </div>
            </div>

            {/* Target Words Pills */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Asosiy tovushli kalit so'zlar:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedDrill.targetWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePlayWord(word)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 text-xs font-semibold text-slate-300 hover:text-white transition group"
                  >
                    <Volume2 className="w-3 h-3 text-indigo-400 group-hover:text-indigo-300" />
                    <span>{word}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Teacher's Articulation Tip (Ustoz Maslahati) */}
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-md">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-black text-amber-300 block tracking-wide">
                  Ustoz Maslahati (Talaffuz Qoidasi):
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {selectedDrill.tipUz}
                </p>
              </div>
            </div>

            {/* Result / Evaluation Feedback Panel */}
            {accuracyScore !== null && (
              <div className="p-4 sm:p-5 bg-slate-900/80 rounded-2xl border border-white/10 space-y-3 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">
                      Tizim eshitgan matn:
                    </span>
                    <p className="text-sm font-semibold text-white italic mt-0.5">
                      "{spokenText || 'Hech narsa aniqlanmadi'}"
                    </p>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-xl text-white font-black text-sm flex items-center gap-2 shadow-lg ${
                      accuracyScore >= 80
                        ? 'bg-emerald-600 shadow-emerald-500/20'
                        : accuracyScore >= 50
                        ? 'bg-amber-500 shadow-amber-500/20'
                        : 'bg-rose-500 shadow-rose-500/20'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Aniqlik: {accuracyScore}%</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 pt-1 border-t border-white/5 flex items-center justify-between">
                  <span>
                    {accuracyScore >= 80
                      ? "A'lo daraja! 🎉 Tovushlar sof va aniq talaffuz qilindi."
                      : accuracyScore >= 50
                      ? "Yaxshi urinish! 👍 Qizil bilan belgilangan so'zlarga e'tibor qarating."
                      : "Sekinroq o'qib ko'ring! 💪 0.7x tezlikdagi namunani tinglab qaytaring."}
                  </span>

                  {currentIndex < filteredDrills.length - 1 && accuracyScore >= 70 && (
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-1 font-bold text-indigo-400 hover:text-indigo-300 underline"
                    >
                      Keyingisiga o'tish <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Professor Buster Sarcastic & Witty Roast Card */}
                {sarcasticFeedback && (
                  <div
                    className={`mt-2 p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
                      sarcasticFeedback.mood === 'roasting'
                        ? 'bg-gradient-to-br from-red-950/70 via-slate-900/90 to-red-950/50 border-red-500/50 shadow-xl shadow-red-500/15'
                        : sarcasticFeedback.mood === 'laughing'
                        ? 'bg-gradient-to-br from-amber-950/70 via-slate-900/90 to-orange-950/50 border-amber-500/50 shadow-xl shadow-amber-500/15'
                        : sarcasticFeedback.mood === 'surprised'
                        ? 'bg-gradient-to-br from-indigo-950/70 via-slate-900/90 to-purple-950/50 border-indigo-500/50 shadow-xl shadow-indigo-500/15'
                        : 'bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 border-orange-500/40 shadow-xl shadow-orange-500/10'
                    }`}
                  >
                    {/* Atmospheric Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-start gap-3.5 relative z-10">
                      {/* Buster Animated Mascot Avatar */}
                      <div className="relative shrink-0 mt-0.5">
                        <div
                          className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl transition-transform duration-300 ${
                            isBusterSpeaking
                              ? 'scale-110 ring-2 ring-orange-400 bg-orange-600/30 border-orange-400 animate-pulse'
                              : 'bg-slate-800/80 border-white/10 hover:scale-105'
                          }`}
                        >
                          <span>{sarcasticFeedback.emoji}</span>
                        </div>
                        {isBusterSpeaking && (
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-ping" />
                        )}
                      </div>

                      {/* Content & Actions */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-orange-400 flex items-center gap-1.5 uppercase tracking-wider">
                              <MessageSquareQuote className="w-4 h-4" />
                              Professor Buster Kinoyasi:
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-white/10 text-slate-300 border border-white/10">
                              {sarcasticFeedback.badge}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Replay Buster Audio Button */}
                            <button
                              type="button"
                              onClick={() => handlePlayBusterFeedback(sarcasticFeedback.text)}
                              disabled={isBusterSpeaking}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                                isBusterSpeaking
                                  ? 'bg-orange-500 text-white animate-pulse'
                                  : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-white border border-orange-500/30'
                              }`}
                              title="Buster ovozida eshitish (O'zbekcha)"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>{isBusterSpeaking ? 'Gapirmoqda...' : 'Eshitish'}</span>
                            </button>

                            {/* Auto Voice Toggle */}
                            <button
                              type="button"
                              onClick={() => {
                                const next = !busterAutoVoice;
                                setBusterAutoVoice(next);
                                if (!next) stopSpeaking();
                              }}
                              className={`p-1.5 rounded-xl border text-xs transition ${
                                busterAutoVoice
                                  ? 'bg-white/10 text-orange-300 border-orange-400/40'
                                  : 'bg-white/5 text-slate-500 border-white/10'
                              }`}
                              title={busterAutoVoice ? "Buster avto-ovozini o'chirish" : "Buster avto-ovozini yoqish"}
                            >
                              {busterAutoVoice ? (
                                <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                              ) : (
                                <VolumeX className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Roast / Praise Speech Bubble */}
                        <p className="text-sm font-medium text-slate-100 leading-relaxed italic bg-black/25 p-3 rounded-xl border border-white/5">
                          "{sarcasticFeedback.text}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Futuristic Sound Wave Equalizer (visible when recording) */}
            {isRecording && (
              <div className="flex items-center justify-center gap-1.5 py-2">
                <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-10 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-12 bg-cyan-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-8 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.2s]" />
                <span className="w-1.5 h-5 bg-rose-400 rounded-full animate-bounce [animation-delay:-0.4s]" />
              </div>
            )}

            {/* 3D Glowing Recording Button */}
            <div className="flex flex-col items-center justify-center pt-2">
              <button
                onClick={toggleRecording}
                className={`relative group flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm text-white shadow-xl transition-all duration-300 transform active:scale-95 ${
                  isRecording
                    ? 'bg-rose-600 shadow-rose-600/40 ring-4 ring-rose-500/30 animate-pulse'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5 text-white animate-spin" />
                    <span>Tugatish (Diqqat bilan tinglanmoqda...)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 text-white" />
                    <span>Mikrofonni Yoqib O'qish</span>
                  </>
                )}
              </button>

              <span className="text-[11px] text-slate-400 mt-2.5 font-medium">
                Tugmani bosing, gapni tabiiy ritmda o'qing va natijani ko'ring
              </span>
            </div>
          </div>
        </div>

        {/* Right: 3D Drills Explorer List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Mashqlar Ro'yxati</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {filteredDrills.length} ta dars
            </span>
          </div>

          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredDrills.map((drill, idx) => {
              const isSelected = drill.id === selectedDrill.id;
              const isCompleted = completedDrills.includes(drill.id);

              return (
                <div
                  key={drill.id}
                  onClick={() => selectDrill(drill)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer card-3d relative overflow-hidden ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500/80 shadow-lg shadow-indigo-500/20 translate-x-1'
                      : 'glass-card border-white/5 hover:border-white/20 hover:bg-slate-800/60'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500" />
                  )}

                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${getLevelBadge(drill.level)}`}>
                        {drill.level}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isCompleted && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          <Check className="w-3 h-3" /> O'tdi
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-cyan-300 font-bold bg-white/5 px-2 py-0.5 rounded-md">
                        {drill.focusSound.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs sm:text-sm font-extrabold text-white truncate group-hover:text-indigo-300">
                    {drill.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-1 italic mt-1 font-normal">
                    "{drill.sentence}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
