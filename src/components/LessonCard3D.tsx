'use client';

import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  Lock,
  Play,
  Clock,
  Star,
  Sparkles,
  ChevronRight,
  Flame,
  Zap
} from 'lucide-react';
import { Lesson } from '@/lib/data/curriculum';

interface LessonCard3DProps {
  lesson: Lesson;
  isCompleted: boolean;
  isCurrent: boolean;
  isUnlocked: boolean;
  onStart: () => void;
}

export default function LessonCard3D({
  lesson,
  isCompleted,
  isCurrent,
  isUnlocked,
  onStart,
}: LessonCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 16;
    const rotateY = ((x - centerX) / centerX) * 16;

    setRotate({ x: rotateX, y: rotateY });
    setMousePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onStart}
      className="relative select-none cursor-pointer perspective-1000 group py-2"
      style={{ perspective: 1000 }}
    >
      {/* 3D Kinetic Card Shell */}
      <div
        className={`relative rounded-3xl p-6 transition-all duration-300 ease-out preserve-3d overflow-hidden ${
          isCompleted
            ? 'glass-card border border-emerald-500/40 shadow-xl shadow-emerald-500/10'
            : isCurrent
            ? 'glass-card border-2 border-indigo-400 shadow-2xl shadow-indigo-500/30 ring-4 ring-indigo-500/20'
            : 'glass-card border border-white/5 opacity-55 hover:opacity-85'
        }`}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(${isHovered ? -8 : 0}px) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic Glass Refraction Light Spot (Tracks Mouse) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
          style={{
            background: `radial-gradient(circle 220px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.15), transparent 70%)`,
          }}
        />

        {/* Floating Top Status Row (Layer Z: 30px) */}
        <div
          className="flex items-center justify-between mb-4"
          style={{ transform: 'translateZ(30px)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-400 font-mono tracking-wider">
              #{lesson.number}-Dars
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/10 text-slate-300 border border-white/10 uppercase">
              {lesson.level}
            </span>
          </div>

          {isCompleted ? (
            <span className="flex items-center gap-1 text-[11px] font-black text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bajarildi</span>
            </span>
          ) : isCurrent ? (
            <span className="flex items-center gap-1.5 text-[11px] font-black text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-0.5 rounded-full shadow-[0_0_18px_rgba(99,102,241,0.5)] animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Hozirgi Dars</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-white/5">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Qulflangan</span>
            </span>
          )}
        </div>

        {/* 3D Floating Lesson Title (Layer Z: 24px) */}
        <div
          className="space-y-2 mb-6"
          style={{ transform: 'translateZ(24px)' }}
        >
          <h3
            className={`font-black text-base sm:text-lg leading-snug transition-colors duration-200 ${
              isCurrent
                ? 'text-white group-hover:text-cyan-300'
                : 'text-slate-100 group-hover:text-indigo-300'
            }`}
          >
            {lesson.titleUz}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {lesson.descriptionUz}
          </p>
        </div>

        {/* Bottom Details & 3D Action Button (Layer Z: 32px) */}
        <div
          className="flex items-center justify-between pt-4 border-t border-white/10"
          style={{ transform: 'translateZ(32px)' }}
        >
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lesson.durationMin} daqiqa</span>
          </div>

          <button
            type="button"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 shadow-lg ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                : isCurrent
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/40 group-hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isCompleted ? (
              <>
                <span>Takrorlash</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            ) : isCurrent ? (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Boshlash</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Qulflangan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
