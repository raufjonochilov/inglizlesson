'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Key,
  Mic,
  Stethoscope,
  GraduationCap,
  BookOpen,
  Headphones,
  Check,
  X,
  Sliders,
  Play,
  RotateCcw,
  Award,
  LayoutGrid,
} from 'lucide-react';
import {
  SoundFX,
  getVoiceConfig,
  saveVoiceConfig,
  previewVoice,
  getAvailableBrowserVoices,
  VoiceConfig,
  stopSpeaking,
} from '@/lib/speech';
import Logo3D from '@/components/Logo3D';

export type ActiveTab = 'lessons' | 'speaking' | 'sarcastic' | 'grammar' | 'ielts' | 'vocab' | 'pronunciation';
export type NavGroup = 'learn' | 'ai' | 'exam';

export interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  group: NavGroup;
  description: string;
}

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  streak: number;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  apiKey,
  setApiKey,
  soundEnabled,
  setSoundEnabled,
  streak,
}: NavbarProps) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [showHubModal, setShowHubModal] = useState(false);
  const [mobileCategory, setMobileCategory] = useState<'all' | NavGroup>('all');

  // Voice Settings Modal State
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>({
    engine: 'hd-studio',
    accent: 'en-US',
    preferredVoiceName: '',
    speed: 0.95,
    pitch: 1.0,
  });
  const [availableVoices, setAvailableVoices] = useState<{ name: string; lang: string; isNatural: boolean }[]>([]);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  useEffect(() => {
    setVoiceConfig(getVoiceConfig());
  }, []);

  const openVoiceSettings = () => {
    setVoiceConfig(getVoiceConfig());
    setAvailableVoices(getAvailableBrowserVoices());
    setShowVoiceModal(true);
    if (soundEnabled) SoundFX.playClick();
  };

  const navGroups: { key: 'all' | NavGroup; label: string; icon: string }[] = [
  { key: 'all', label: 'Barchasi', icon: '🌟' },
  { key: 'learn', label: "O'rganish", icon: '📚' },
  { key: 'ai', label: 'AI Amaliyot', icon: '🤖' },
  { key: 'exam', label: 'Imtihon', icon: '🏆' },
];

const navItems: NavItem[] = [
  // 1. O'rganish (Core Curriculum & Books)
  {
    id: 'lessons',
    label: 'Darslar',
    icon: <GraduationCap className="w-4 h-4" />,
    badge: '18 Dars',
    group: 'learn',
    description: "18 darslik interaktiv yo'l xaritasi va asosiy bosqichma-bosqich kurs",
  },
  {
    id: 'grammar',
    label: 'Grammatika',
    icon: <BookOpen className="w-4 h-4" />,
    badge: 'Kitoblar',
    group: 'learn',
    description: "Murphy, Grammarway va Destination kitoblari qoidalari",
  },
  {
    id: 'vocab',
    label: 'Lug‘at',
    icon: <Sparkles className="w-4 h-4" />,
    badge: 'Flashcards',
    group: 'learn',
    description: "Essential Words, Destination va 3D Flashcard lug'at",
  },

  // 2. AI Amaliyot & Muloqot (Interactive AI Practice)
  {
    id: 'speaking',
    label: 'AI Repetitor',
    icon: <Mic className="w-4 h-4" />,
    badge: 'Ovozli',
    group: 'ai',
    description: "Ovozli muloqot va real vaqtdagi erkin suhbatdosh",
  },
  {
    id: 'sarcastic',
    label: 'Kinoyachi AI',
    icon: <Flame className="w-4 h-4 text-orange-400" />,
    badge: 'Buster 🔥',
    group: 'ai',
    description: "Professor Buster bilan jonli qovurish, tuzoqlar va erkin bahs",
  },
  {
    id: 'pronunciation',
    label: 'Talaffuz',
    icon: <Headphones className="w-4 h-4" />,
    badge: 'Coach',
    group: 'ai',
    description: "Fonetika, urg'u va so'zlarni to'g'ri talaffuz qilish mashqlari",
  },

  // 3. Imtihon & Sertifikat (Exam Prep)
  {
    id: 'ielts',
    label: 'IELTS 9',
    icon: <Award className="w-4 h-4 text-amber-400" />,
    badge: 'Examiner',
    group: 'exam',
    description: "IELTS Speaking & Writing rasmiy simulyatori va imtihonchisi",
  },
];

  const handleTabClick = (tab: ActiveTab) => {
    if (soundEnabled) SoundFX.playClick();
    setActiveTab(tab);
  };

  const handleSaveKey = () => {
    setApiKey(tempKey);
    localStorage.setItem('lingua_custom_api_key', tempKey);
    setShowKeyModal(false);
    if (soundEnabled) SoundFX.playSuccess();
  };

  const handleSaveVoiceConfig = () => {
    saveVoiceConfig(voiceConfig);
    setShowVoiceModal(false);
    stopSpeaking();
    if (soundEnabled) SoundFX.playSuccess();
  };

  const handlePreview = () => {
    setIsPreviewPlaying(true);
    const sample =
      voiceConfig.accent === 'uz-UZ'
        ? "Salom! Men Professor Busterman. LinguaPulse AI bilan o'zbekcha talaffuz endi 100% tiniq va tabiiy!"
        : 'Hello! Welcome to LinguaPulse AI. Practice speaking fluently every single day.';
    previewVoice(voiceConfig, sample);
    setTimeout(() => setIsPreviewPlaying(false), 3800);
  };

  const renderNavButton = (item: NavItem) => {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => handleTabClick(item.id)}
        title={item.description}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
          isActive
            ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/35 scale-105'
            : 'text-slate-400 hover:text-white hover:bg-white/10 hover:-translate-y-0.5'
        }`}
      >
        <span className={`${isActive ? 'animate-bounce' : ''}`}>{item.icon}</span>
        <span>{item.label}</span>
        {item.badge && (
          <span
            className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Floating 3D Island Navigation Dock */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-7xl transition-all duration-300">
        <div className="glass-dock rounded-3xl p-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-2 shadow-2xl border border-white/20">
          {/* 3D Kinetic Brand Logo & All-Modules Button */}
          <div className="flex items-center gap-2">
            <Logo3D size="sm" onClick={() => handleTabClick('lessons')} />

            {/* Quick Hub / Sitemap Button */}
            <button
              onClick={() => {
                setShowHubModal(true);
                if (soundEnabled) SoundFX.playClick();
              }}
              title="Barcha bo‘limlar menyusi (Hub)"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition hover:scale-105"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden xl:inline">Bo‘limlar</span>
            </button>
          </div>

          {/* Central 3D Flying Menu Tabs (Grouped & Ordered for Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            {/* Guruh 1: O'rganish (Darslar, Grammatika, Lug'at) */}
            <div className="flex items-center gap-0.5">
              {navItems.filter((i) => i.group === 'learn').map(renderNavButton)}
            </div>

            {/* Section Divider */}
            <div className="h-5 w-[1px] bg-white/15 mx-1" />

            {/* Guruh 2: AI Amaliyot (AI Repetitor, Kinoyachi AI, Talaffuz) */}
            <div className="flex items-center gap-0.5">
              {navItems.filter((i) => i.group === 'ai').map(renderNavButton)}
            </div>

            {/* Section Divider */}
            <div className="h-5 w-[1px] bg-white/15 mx-1" />

            {/* Guruh 3: Imtihon (IELTS 9) */}
            <div className="flex items-center gap-0.5">
              {navItems.filter((i) => i.group === 'exam').map(renderNavButton)}
            </div>
          </nav>

          {/* Right Floating Quick Action Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 pr-1">
            {/* Streak Counter with 3D Fire Pill */}
            <div
              title={`${streak} kunlik dars zanjiri!`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 rounded-2xl text-amber-300 text-xs font-black shadow-inner shadow-amber-500/20 hover:scale-105 transition"
            >
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{streak} kun</span>
            </div>

            {/* Voice Settings Button (Tiniq Ovoz Sozlamalari) */}
            <button
              onClick={openVoiceSettings}
              title="Tiniq Ovoz & Talaffuz Sozlamalari (Voice Settings)"
              className="p-2.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 hover:text-white transition shadow-sm hover:scale-105 flex items-center gap-1"
            >
              <Sliders className="w-4 h-4 text-indigo-400" />
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={() => {
                const nextVal = !soundEnabled;
                setSoundEnabled(nextVal);
                if (nextVal) SoundFX.playChime();
              }}
              title={soundEnabled ? "Ovoz effektlarini o'chirish" : "Ovoz effektlarini yoqish"}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition shadow-sm hover:scale-105"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-indigo-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* API Key Modal Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              title="Google Gemini AI kalit sozlamalari"
              className={`p-2.5 rounded-2xl border transition shadow-sm hover:scale-105 ${
                apiKey
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Segmented Navigation Bar */}
        <div className="lg:hidden mt-2 space-y-1.5">
          {/* Category Filter Chips & Quick Hub Button */}
          <div className="flex items-center justify-between gap-1 px-1">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {navGroups.map((g) => {
                const isSelected = mobileCategory === g.key;
                return (
                  <button
                    key={g.key}
                    onClick={() => {
                      setMobileCategory(g.key);
                      if (soundEnabled) SoundFX.playClick();
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-black whitespace-nowrap transition border ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/50 shadow-sm'
                        : 'bg-black/40 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{g.icon} {g.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowHubModal(true)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs shrink-0 flex items-center gap-1"
              title="Barcha bo‘limlar xaritasi"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          </div>

          {/* Nav Items Horizontal Row */}
          <div className="flex overflow-x-auto py-1 gap-1.5 no-scrollbar px-1">
            {navItems
              .filter((item) => mobileCategory === 'all' || item.group === mobileCategory)
              .map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-md ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400/40 shadow-indigo-500/30'
                        : 'glass-panel text-slate-300 hover:text-white'
                    }`}
                  >
                    <span className={isActive ? 'animate-bounce' : ''}>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-white/15 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </header>

      {/* Spacer so content doesn't get hidden behind floating header */}
      <div className="h-28 sm:h-28 lg:h-24" />

      {/* VOICE SETTINGS MODAL (TINIQ OVOZ SOZLAMALARI) */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="glass-panel border border-white/20 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-100 space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                  <Sliders className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-lg text-white">Tiniq Ovoz & Talaffuz Sozlamalari</h3>
                  <p className="text-xs text-slate-400">Nutq ovozini tiniqroq qilish va yangi ovoz tanlash</p>
                </div>
              </div>
              <button
                onClick={() => {
                  stopSpeaking();
                  setShowVoiceModal(false);
                }}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Voice Engine Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                1. Ovoz Texnologiyasi & Dvigateli:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* HD Studio Voice Option */}
                <button
                  type="button"
                  onClick={() => setVoiceConfig((prev) => ({ ...prev, engine: 'hd-studio' }))}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    voiceConfig.engine === 'hd-studio'
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-indigo-400 shadow-lg shadow-indigo-500/30 scale-[1.01]'
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black flex items-center gap-1.5">
                      <span>🌟 HD Studio Ovozi</span>
                    </span>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 uppercase">
                      Eng Tiniq
                    </span>
                  </div>
                  <p className="text-[11px] mt-1.5 opacity-90 leading-snug">
                    Google Cloud Neural studio talaffuzi. Tabiiy, yumshoq va 100% tiniq inson ovozi.
                  </p>
                </button>

                {/* Natural Browser Voice Option */}
                <button
                  type="button"
                  onClick={() => setVoiceConfig((prev) => ({ ...prev, engine: 'browser-natural' }))}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    voiceConfig.engine === 'browser-natural'
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-indigo-400 shadow-lg shadow-indigo-500/30 scale-[1.01]'
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black flex items-center gap-1.5">
                      <span>⚡ Natural Neural Voice</span>
                    </span>
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-500/40 uppercase">
                      Tezkor
                    </span>
                  </div>
                  <p className="text-[11px] mt-1.5 opacity-90 leading-snug">
                    Brauzeringizdagi Microsoft Jenny / Aria / Google US/UK tabiiy spiker ovozlari.
                  </p>
                </button>
              </div>
            </div>

            {/* 2. Accent Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                2. Talaffuz Tili & Lahjasi (Accent):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'uz-UZ', label: '🇺🇿 O\'zbekcha (UZ)', desc: 'Sardor Neural (Tabiiy)' },
                  { id: 'en-US', label: '🇺🇸 Amerika (US)', desc: 'General American' },
                  { id: 'en-GB', label: '🇬🇧 Britaniya (UK)', desc: 'Oxford RP' },
                  { id: 'en-AU', label: '🇦🇺 Avstraliya (AU)', desc: 'Australian' },
                ].map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setVoiceConfig((prev) => ({ ...prev, accent: acc.id as any }))}
                    className={`p-2.5 rounded-xl border text-center transition ${
                      voiceConfig.accent === acc.id
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md font-bold'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xs block font-bold">{acc.label}</span>
                    <span className="text-[10px] opacity-75">{acc.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Specific Speaker Voice Dropdown (when Natural Browser engine selected) */}
            {voiceConfig.engine === 'browser-natural' && availableVoices.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  3. Spiker Ovozini Tanlash:
                </label>
                <select
                  value={voiceConfig.preferredVoiceName || ''}
                  onChange={(e) => setVoiceConfig((prev) => ({ ...prev, preferredVoiceName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs border border-white/10 rounded-xl bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Avtomatik eng tabiiy ovoz tanlansin --</option>
                  {availableVoices.map((v, i) => (
                    <option key={i} value={v.name}>
                      {v.name} {v.isNatural ? '⭐ [Natural]' : ''} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 4. Speech Speed Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Nutq Tezligi (Speed):
                </label>
                <span className="text-xs font-mono font-bold text-indigo-400">
                  {voiceConfig.speed.toFixed(2)}x
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { rate: 0.75, label: '🐢 Sekin (0.75x)' },
                  { rate: 0.9, label: '👌 Qulay (0.90x)' },
                  { rate: 1.0, label: '⚡ Standart (1.0x)' },
                  { rate: 1.15, label: '🚀 Tez (1.15x)' },
                ].map((s) => (
                  <button
                    key={s.rate}
                    type="button"
                    onClick={() => setVoiceConfig((prev) => ({ ...prev, speed: s.rate }))}
                    className={`py-2 px-1.5 rounded-xl border text-[11px] font-bold text-center transition ${
                      Math.abs(voiceConfig.speed - s.rate) < 0.05
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                        : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Preview Audio Button */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePreview}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
                  isPreviewPlaying
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md animate-pulse'
                    : 'bg-slate-800 text-slate-200 border-white/10 hover:bg-slate-700'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPreviewPlaying ? "Tinglanmoqda..." : "▶️ Ovozni sinab ko'rish"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    stopSpeaking();
                    setShowVoiceModal(false);
                  }}
                  className="px-3.5 py-2 text-xs text-slate-400 hover:text-white font-bold"
                >
                  Bekor qilish
                </button>
                <button
                  type="button"
                  onClick={handleSaveVoiceConfig}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30"
                >
                  <Check className="w-4 h-4" />
                  <span>Saqlash</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Key Settings Modal with 3D Glass aesthetic */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="glass-panel border border-white/20 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-400" />
                <h3 className="font-black text-lg">Google Gemini API Kaliti</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Platforma sukut bo'yicha serverdagi standart kalit orqali ishlaydi. Agar o'zingizning shaxsiy Google AI Studio (Gemini) kalitingizdan foydalanmoqchi bo'lsangiz, uni quyida kiritishingiz mumkin:
            </p>

            <div className="mt-4">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                API Key (ixtiyoriy)
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-white/10 rounded-xl bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white font-bold"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveKey}
                className="flex items-center gap-1.5 px-5 py-2.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30"
              >
                <Check className="w-4 h-4" />
                <span>Saqlash</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. BARCHA BO'LIMLAR XARITASI (ALL MODULES HUB MODAL) */}
      {showHubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="glass-panel border border-white/20 rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl text-slate-100 space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                  <LayoutGrid className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-lg text-white">Platforma Bo‘limlari Xaritasi</h3>
                  <p className="text-xs text-slate-400">Barcha 7 ta bo‘lim 3 ta asosiy yo‘nalishga tartiblangan</p>
                </div>
              </div>
              <button
                onClick={() => setShowHubModal(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Categories Grid */}
            <div className="space-y-5">
              {/* Guruh 1: O'rganish */}
              <div className="space-y-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <span>📚 1. O‘quv Dasturlari & Nazariya (3 ta)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {navItems.filter((i) => i.group === 'learn').map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleTabClick(item.id);
                        setShowHubModal(false);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between hover:scale-[1.02] ${
                        activeTab === item.id
                          ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                          : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-indigo-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="p-2 rounded-xl bg-white/10 text-indigo-400">{item.icon}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-indigo-300">
                          {item.badge}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <h4 className="font-black text-sm text-white">{item.label}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guruh 2: AI Amaliyot */}
              <div className="space-y-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <span>🤖 2. Interaktiv AI Amaliyot & Muloqot (3 ta)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {navItems.filter((i) => i.group === 'ai').map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleTabClick(item.id);
                        setShowHubModal(false);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between hover:scale-[1.02] ${
                        activeTab === item.id
                          ? 'bg-purple-600/30 border-purple-400 text-white shadow-lg shadow-purple-500/20'
                          : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-purple-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="p-2 rounded-xl bg-white/10 text-purple-400">{item.icon}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-purple-300">
                          {item.badge}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <h4 className="font-black text-sm text-white">{item.label}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guruh 3: Imtihon */}
              <div className="space-y-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <span>🏆 3. Imtihon & Sertifikat (1 ta)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {navItems.filter((i) => i.group === 'exam').map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleTabClick(item.id);
                        setShowHubModal(false);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between hover:scale-[1.02] ${
                        activeTab === item.id
                          ? 'bg-amber-600/30 border-amber-400 text-white shadow-lg shadow-amber-500/20'
                          : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="p-2 rounded-xl bg-white/10 text-amber-400">{item.icon}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                          {item.badge}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <h4 className="font-black text-sm text-white">{item.label}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
