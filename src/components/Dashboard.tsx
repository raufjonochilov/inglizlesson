'use client';

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  BookOpen,
  Sparkles,
  Award,
  Zap,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import {
  getStats,
  calculateLevel,
  getAchievements,
  getRecentActivities,
  exportFullProgress,
  importFullProgress,
  UserStats,
  Achievement,
  ActivityItem,
} from '@/lib/gamification';
import { SoundFX } from '@/lib/speech';

interface DashboardProps {
  soundEnabled: boolean;
  onNavigate: (tab: any) => void;
  onActivity: () => void;
}

export default function Dashboard({ soundEnabled, onNavigate, onActivity }: DashboardProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [importStatus, setImportStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'achievements' | 'activity'>('achievements');

  const loadData = () => {
    const s = getStats();
    setStats(s);
    setActivities(getRecentActivities());
    setAchievements(getAchievements(s));
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const levelInfo = calculateLevel(stats.totalXP);

  const handleExport = () => {
    const json = exportFullProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linguapulse-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (soundEnabled) SoundFX.playSuccess();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importFullProgress(content);
      if (success) {
        setImportStatus("Muvaffaqiyatli tiklandi! Sahifa yangilanmoqda...");
        if (soundEnabled) SoundFX.playSuccess();
        setTimeout(() => {
          loadData();
          setImportStatus('');
        }, 1200);
      } else {
        setImportStatus("Faylni yuklashda xatolik yuz berdi. JSON formati noto'g'ri.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 animate-fade-in">
      {/* Top Banner / User Level Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-2xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>O‘quvchi Darajasi</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3">
              <span>{levelInfo.level}-Daraja</span>
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-amber-400 text-slate-900 shadow">
                {levelInfo.level < 5 ? "Boshlang'ich" : levelInfo.level < 15 ? "Ilg'or" : "Ekspert Master"}
              </span>
            </h1>
            <p className="text-slate-200 text-sm max-w-md">
              Har bir topshiriq va suhbat orqali yangi XP ballari to‘plang va yangi mukofotlarni oching.
            </p>
          </div>

          <div className="w-full md:w-80 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>Keyingi darajagacha</span>
              <span className="text-amber-300">{levelInfo.currentLevelXP} / {levelInfo.nextLevelXP} XP</span>
            </div>
            <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${levelInfo.progress}%` }}
              />
            </div>
            <div className="text-right text-[11px] text-slate-300">
              {levelInfo.progress}% yakunlandi
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total XP */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.totalXP}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Umumiy XP Ball
            </div>
          </div>
        </div>

        {/* Card 2: Streak */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xl">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.currentStreak} kun
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Uzluksiz Seriya
            </div>
          </div>
        </div>

        {/* Card 3: Lessons */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.lessonsCompleted} / 18
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Tugatilgan Darslar
            </div>
          </div>
        </div>

        {/* Card 4: Practice actions */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.speakingMessages + stats.grammarChecks + stats.sarcasticInteractions}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              AI Mashg‘ulotlar
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Recommendations */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800/50 dark:to-slate-800/30 p-5 rounded-2xl border border-indigo-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Bugungi o‘quv rejasi
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              1 ta dars o‘ting va Sarah bilan 5 daqiqa inglizcha so‘zlashing (+150 XP)
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('lessons')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
          >
            <span>Darslarga o‘tish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('speaking')}
            className="px-4 py-2 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm transition"
          >
            AI Repetitor
          </button>
        </div>
      </div>

      {/* Toggle View: Yutuqlar (Achievements) vs So'nggi Harakatlar (Activities) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'achievements'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Yutuqlar & Nishonlar ({achievements.filter(a => a.unlocked).length}/{achievements.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'activity'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Faollik Tarixi ({activities.length})</span>
            </button>
          </div>
        </div>

        {activeTab === 'achievements' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {achievements.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  item.unlocked
                    ? 'bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-500/40 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{item.icon}</span>
                  {item.unlocked ? (
                    <span className="p-1 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Qulflangan
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                    {item.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold mb-1">
                    <span>Jarayon</span>
                    <span>{Math.min(item.current, item.target)} / {item.target}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.unlocked ? 'bg-amber-400' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${Math.min(100, (item.current / item.target) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/50">
            {activities.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                Hali hech qanday faollik qayd etilmagan. Topshiriqlarni boshlang!
              </div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                      ⚡
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {act.description}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(act.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 font-bold text-xs">
                    +{act.xp} XP
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Progress Backup / Sync Card */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-sm space-y-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Natijalarni Saqlash va Boshqa Qurilmaga Ko‘chirish (Backup)</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sizning barcha yakunlangan darslaringiz, XP ballaringiz va lug‘atingiz brauzeringizda saqlanadi. Brauzer tozalanganda yo‘qolmasligi uchun zaxira nusxa oling.
          </p>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 text-xs font-bold">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition"
          >
            <Download className="w-4 h-4" />
            <span>Progressni yuklab olish (.json)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-600 cursor-pointer shadow-sm transition">
            <Upload className="w-4 h-4" />
            <span>Fayldan tiklash</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
