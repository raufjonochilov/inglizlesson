'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  Award,
  Sparkles,
  ChevronRight,
  Clock,
  Flame,
  Star,
  Search,
  Filter,
  Layers,
  GraduationCap,
  Compass,
  Zap,
  Map,
  Grid
} from 'lucide-react';
import { COURSE_UNITS, Lesson, Unit } from '@/lib/data/curriculum';
import { SoundFX } from '@/lib/speech';
import Logo3D from '@/components/Logo3D';
import LessonCard3D from '@/components/LessonCard3D';
import RoadmapQuest3D from '@/components/RoadmapQuest3D';

interface CourseRoadmapProps {
  completedLessonIds: string[];
  onSelectLesson: (lesson: Lesson) => void;
  soundEnabled: boolean;
}

export default function CourseRoadmap({
  completedLessonIds,
  onSelectLesson,
  soundEnabled,
}: CourseRoadmapProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'quest'>('grid');

  const allLessons = COURSE_UNITS.flatMap((u) => u.lessons);
  const totalCompleted = completedLessonIds.length;
  const progressPercentage = Math.round((totalCompleted / allLessons.length) * 100);

  const nextActiveLesson =
    allLessons.find((l) => !completedLessonIds.includes(l.id)) || allLessons[0];

  const handleStart = (lesson: Lesson, isLocked: boolean) => {
    if (isLocked) {
      alert("Bu darsni ochish uchun avval undan oldingi darslarni muvaffaqiyatli yakunlang!");
      return;
    }
    if (soundEnabled) SoundFX.playClick();
    onSelectLesson(lesson);
  };

  const filteredUnits = COURSE_UNITS.map((unit) => {
    const matchingLessons = unit.lessons.filter((lesson) => {
      const matchesLevel = selectedLevel === 'All' || unit.level === selectedLevel;
      const matchesSearch =
        !searchQuery.trim() ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.titleUz.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.descriptionUz.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLevel && matchesSearch;
    });

    return {
      ...unit,
      lessons: matchingLessons,
    };
  }).filter((unit) => unit.lessons.length > 0);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in perspective-1000">
      
      {/* 3D Holographic Hero Banner */}
      <div className="relative rounded-3xl p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 shadow-2xl shadow-indigo-500/20 group">
        <div className="glass-panel rounded-[22px] p-6 sm:p-10 relative overflow-hidden">
          {/* Subtle light streak */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="shrink-0">
                <Logo3D size="lg" showText={false} />
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-black backdrop-blur-md shadow-sm">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Interaktiv 3D O'quv Ekotizimi</span>
                </div>
                
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Ingliz Tili <span className="neon-text-gradient">Akademiyasi</span>
                </h1>
                
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                  A1 poydevoridan tortib IELTS 8.5+ darajasidagi murakkab konstruksiyalargacha bo'lgan 18 ta dars. Har bir dars: formulalar, audio, Duolingo uslubidagi interaktiv mashqlar va jonli AI ustoz nazorati.
                </p>
              </div>
            </div>

            {/* Glowing 3D Progress Hologram */}
            <div className="glass-panel border border-white/15 p-6 rounded-3xl min-w-[260px] text-center space-y-3 shrink-0 shadow-xl shadow-black/40">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Kurs Progressi</span>
                <span className="text-indigo-400">{totalCompleted} / {allLessons.length} dars</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 py-1">
                <span className="text-4xl font-black neon-text-gradient">
                  {progressPercentage}%
                </span>
              </div>

              <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full transition-all duration-700 rounded-full shadow-lg shadow-indigo-500/50"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <span className="text-[11px] text-slate-400 block font-medium">
                {totalCompleted === allLessons.length
                  ? "🎉 Tabriklaymiz! Barcha darslar yakunlandi!"
                  : `Navbatdagi marra: ${nextActiveLesson?.titleUz || ''}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Fast Card (3D Floating Action) */}
      {nextActiveLesson && (
        <div className="glass-panel border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl shadow-indigo-500/10 hover:border-indigo-400 transition-all duration-300">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-md shadow-indigo-500/30">
                ⚡ Navbatdagi Dars
              </span>
              <span className="text-xs font-bold text-indigo-400">
                #{nextActiveLesson.number}-Dars • {nextActiveLesson.level} • {nextActiveLesson.durationMin} daqiqa
              </span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {nextActiveLesson.titleUz}
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300">
              {nextActiveLesson.descriptionUz}
            </p>
          </div>

          <button
            onClick={() => handleStart(nextActiveLesson, false)}
            className="flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/35 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Darsni Boshlash</span>
          </button>
        </div>
      )}

      {/* Filter, Search & View Switcher Bar */}
      <div className="glass-panel rounded-2xl p-3 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/10">
        {/* Level Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'All', label: 'Barchasi (18)' },
            { id: 'A1', label: 'A1 Boshlang\'ich (5)' },
            { id: 'A2', label: 'A2 Kundalik (5)' },
            { id: 'B1', label: 'B1 Erkin (4)' },
            { id: 'B2', label: 'B2 Yuqori (4)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedLevel(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                selectedLevel === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Mode Switcher & Search */}
        <div className="flex items-center gap-2">
          {/* 3D View Toggle */}
          <div className="flex bg-slate-900/90 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                if (soundEnabled) SoundFX.playClick();
                setViewMode('grid');
              }}
              title="3D Kartalar Matritsasi"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3D Kartalar</span>
            </button>
            <button
              onClick={() => {
                if (soundEnabled) SoundFX.playClick();
                setViewMode('quest');
              }}
              title="3D Sarguzasht Xaritasi"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'quest'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3D Xarita</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidiruv..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>
      </div>

      {/* RENDER VIEW: 3D Quest Map OR 3D Hologram Grid */}
      {viewMode === 'quest' ? (
        <RoadmapQuest3D
          completedLessonIds={completedLessonIds}
          onSelectLesson={(lesson) => onSelectLesson(lesson)}
        />
      ) : (
        /* 3D Hologram Grid View */
        <div className="space-y-10">
          {filteredUnits.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-3xl border border-white/10">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
              <p className="text-sm text-slate-400 font-semibold">
                Kiritilgan qidiruv so'zi bo'yicha darslar topilmadi
              </p>
            </div>
          ) : (
            filteredUnits.map((unit) => {
              const unitCompletedCount = unit.lessons.filter((l) =>
                completedLessonIds.includes(l.id)
              ).length;

              return (
                <div
                  key={unit.id}
                  className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/10 shadow-xl"
                >
                  {/* Unit Header with Hologram Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-full text-xs font-black shadow-sm">
                          {unit.level}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {unit.titleUz}
                        </h2>
                      </div>
                      <p className="text-xs text-slate-400">{unit.descriptionUz}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-900/60 px-3.5 py-1.5 rounded-xl border border-white/5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{unitCompletedCount} / {unit.lessons.length} dars yakunlangan</span>
                    </div>
                  </div>

                  {/* 3D Tilt Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {unit.lessons.map((lesson) => {
                      const isCompleted = completedLessonIds.includes(lesson.id);

                      const globalIdx = allLessons.findIndex((l) => l.id === lesson.id);
                      const prevLesson = globalIdx > 0 ? allLessons[globalIdx - 1] : null;
                      const isUnlocked = Boolean(
                        globalIdx === 0 ||
                        isCompleted ||
                        (prevLesson && completedLessonIds.includes(prevLesson.id))
                      );
                      const isCurrent = Boolean(isUnlocked && !isCompleted);

                      return (
                        <LessonCard3D
                          key={lesson.id}
                          lesson={lesson}
                          isCompleted={isCompleted}
                          isCurrent={isCurrent}
                          isUnlocked={isUnlocked}
                          onStart={() => handleStart(lesson, !isUnlocked)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
