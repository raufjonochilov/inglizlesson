'use client';

import React from 'react';
import {
  CheckCircle2,
  Lock,
  Play,
  Star,
  Sparkles,
  Award,
  Clock,
  ChevronRight,
  Flame,
  Zap
} from 'lucide-react';
import { COURSE_UNITS, Lesson } from '@/lib/data/curriculum';

interface RoadmapQuest3DProps {
  completedLessonIds: string[];
  onSelectLesson: (lesson: Lesson) => void;
}

export default function RoadmapQuest3D({
  completedLessonIds,
  onSelectLesson,
}: RoadmapQuest3DProps) {
  const allLessons = COURSE_UNITS.flatMap((u) => u.lessons);

  return (
    <div className="relative py-8 max-w-3xl mx-auto perspective-1000">
      {/* Central Laser Energy Pipeline / Vertical Conduit */}
      <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500/30 rounded-full blur-[1px] shadow-[0_0_15px_rgba(99,102,241,0.5)] pointer-events-none" />

      {/* Serpentine Lesson Nodes */}
      <div className="relative z-10 space-y-12">
        {COURSE_UNITS.map((unit, unitIdx) => (
          <div key={unit.id} className="space-y-8">
            {/* Unit Milestone Marker in 3D */}
            <div className="flex justify-center">
              <div className="glass-panel border-2 border-indigo-400/50 rounded-2xl px-6 py-3 shadow-xl shadow-indigo-500/20 text-center flex items-center gap-3 backdrop-blur-xl">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 block">
                    {unit.level} Bosqichi
                  </span>
                  <h4 className="text-xs sm:text-sm font-black text-white">
                    {unit.titleUz}
                  </h4>
                </div>
              </div>
            </div>

            {/* Lessons along winding path */}
            <div className="space-y-6">
              {unit.lessons.map((lesson, lessonIdx) => {
                const isCompleted = completedLessonIds.includes(lesson.id);
                const globalIdx = allLessons.findIndex((l) => l.id === lesson.id);
                const prevLesson = globalIdx > 0 ? allLessons[globalIdx - 1] : null;
                const isUnlocked =
                  globalIdx === 0 ||
                  isCompleted ||
                  (prevLesson && completedLessonIds.includes(prevLesson.id));
                const isCurrent = isUnlocked && !isCompleted;

                // Alternate sides: left, center, right
                const alignment =
                  lessonIdx % 3 === 0
                    ? 'justify-start sm:pl-8'
                    : lessonIdx % 3 === 1
                    ? 'justify-end sm:pr-8'
                    : 'justify-center';

                return (
                  <div key={lesson.id} className={`flex items-center ${alignment}`}>
                    <div
                      onClick={() => {
                        if (isUnlocked) onSelectLesson(lesson);
                        else alert("Ushbu darsni ochish uchun avvalgi darsni yakunlang!");
                      }}
                      className={`relative w-full sm:w-[320px] rounded-3xl p-5 transition-all duration-300 cursor-pointer preserve-3d group ${
                        isCompleted
                          ? 'glass-card border-emerald-500/40 hover:border-emerald-400 shadow-xl shadow-emerald-500/10 hover:-translate-y-2'
                          : isCurrent
                          ? 'glass-card border-2 border-indigo-400 shadow-2xl shadow-indigo-500/35 ring-4 ring-indigo-500/20 scale-105 hover:-translate-y-2'
                          : 'glass-card border-white/5 opacity-50 hover:opacity-75'
                      }`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* Ambient Energy Flare for Current Lesson */}
                      {isCurrent && (
                        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 blur-lg opacity-40 animate-pulse-glow -z-10" />
                      )}

                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs text-white shadow-md ${
                              isCompleted
                                ? 'bg-emerald-600'
                                : isCurrent
                                ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-indigo-500/40 animate-bounce'
                                : 'bg-slate-800'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            ) : isCurrent ? (
                              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-500" />
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] font-black text-slate-400 font-mono block">
                              #{lesson.number}-DARS
                            </span>
                            <span className="text-[10px] font-bold text-indigo-400">
                              {lesson.level} • {lesson.durationMin} daq
                            </span>
                          </div>
                        </div>

                        {isCurrent && (
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/30 text-cyan-300 border border-indigo-400/40 animate-pulse">
                            Hozirgi
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug mb-2">
                        {lesson.titleUz}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {lesson.descriptionUz}
                      </p>

                      {/* Action Button */}
                      <div className="flex justify-end pt-2 border-t border-white/10">
                        <span
                          className={`text-xs font-black flex items-center gap-1 ${
                            isCompleted
                              ? 'text-emerald-400'
                              : isCurrent
                              ? 'text-cyan-300'
                              : 'text-slate-500'
                          }`}
                        >
                          {isCompleted ? "Qayta ko'rish" : isCurrent ? "Darsni Boshlash" : "Qulflangan"}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
