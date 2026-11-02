'use client';

import React, { useState, useEffect } from 'react';
import { Flame, X, MessageSquare, Zap, Volume2 } from 'lucide-react';
import { speakText, SoundFX } from '@/lib/speech';

interface FloatingMascotProps {
  soundEnabled: boolean;
  onOpenStage: () => void;
}

const BUSTER_TIPS = [
  "Hey! Dars qilish o'rniga qayerga qarayapsan? 😏",
  "Grammatikani xato qilsang, baribir mening oldimga kelasan! 🔥",
  "Bugun biror marta ham inglizcha gapirib ko'rdingmi o'zi? 😂",
  "Meni bos-chi, aqlingni tekshirib ko'raylik! ⚡",
  "'I am agree' deb gapiradiganlardan emasmisan harholda? 🤨",
];

export default function FloatingMascot({ soundEnabled, onOpenStage }: FloatingMascotProps) {
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isWinking, setIsWinking] = useState(false);

  // Randomly pop up witty bubbles every 25 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMinimized) {
        const randomTip = BUSTER_TIPS[Math.floor(Math.random() * BUSTER_TIPS.length)];
        setBubbleText(randomTip);
        setIsWinking(true);
        setTimeout(() => setIsWinking(false), 2000);

        // Hide bubble after 6 seconds
        setTimeout(() => {
          setBubbleText(null);
        }, 6000);
      }
    }, 25000);

    return () => clearInterval(interval);
  }, [isMinimized]);

  const handleClickMascot = () => {
    if (soundEnabled) SoundFX.playClick();
    onOpenStage();
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => {
          setIsMinimized(false);
          setBubbleText("Men qaytdim! Meni yashirib bo'lmaydi! 😏");
        }}
        title="Professor Busterni ko'rsatish"
        className="fixed bottom-5 right-5 z-40 p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl border border-orange-400/50 hover:scale-110 transition flex items-center gap-1.5 text-xs font-black animate-bounce"
      >
        <Flame className="w-4 h-4 text-white" />
        <span>Buster 🔥</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 lg:bottom-5 right-5 z-40 flex flex-col items-end select-none animate-fade-in pointer-events-auto">
      {/* Comic Speech Bubble */}
      {bubbleText && (
        <div className="mb-2 max-w-[240px] p-3 rounded-2xl bg-slate-900/95 border border-orange-500/50 shadow-2xl text-xs text-slate-100 font-semibold relative animate-bounce backdrop-blur-md">
          <div className="flex items-start justify-between gap-1">
            <p className="leading-snug">{bubbleText}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setBubbleText(null);
              }}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Pointer tail down */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 border-r border-b border-orange-500/50 rotate-45" />
        </div>
      )}

      {/* Floating 3D Character Disc */}
      <div className="relative group cursor-pointer" onClick={handleClickMascot}>
        {/* Close / Minimize Pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(true);
          }}
          title="Vaqtincha yashirish"
          className="absolute -top-1 -left-1 z-50 w-5 h-5 rounded-full bg-slate-900/80 border border-white/20 text-slate-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Outer Glowing Rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-600 blur-md opacity-40 group-hover:opacity-80 transition animate-pulse" />

        {/* Mascot Avatar Circular Container */}
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-slate-950 border-2 border-orange-500/60 p-1 shadow-2xl transition-all duration-300 group-hover:scale-110 flex items-center justify-center overflow-hidden">
          {/* Mini SVG Professor Buster */}
          <svg viewBox="0 0 100 100" className="w-full h-full animate-float-slow">
            <defs>
              <linearGradient id="miniSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>

            {/* Body */}
            <path d="M25 90 C25 75, 40 70, 50 70 C60 70, 75 75, 75 90 Z" fill="#312e81" />
            <polygon points="45,70 50,76 55,70" fill="#ffffff" />
            <circle cx="50" cy="76" r="2" fill="#dc2626" />

            {/* Head */}
            <circle cx="50" cy="46" r="26" fill="url(#miniSkin)" stroke="#ea580c" strokeWidth="1.5" />

            {/* Hair */}
            <path d="M26 42 C24 22, 36 18, 50 18 C64 18, 76 22, 74 42 C70 26, 62 24, 50 24 C38 24, 30 26, 26 42 Z" fill="#451a03" />

            {/* Glasses */}
            <circle cx="39" cy="46" r="9" fill="rgba(255,255,255,0.2)" stroke="#1e293b" strokeWidth="2" />
            <circle cx="61" cy="46" r="9" fill="rgba(255,255,255,0.2)" stroke="#1e293b" strokeWidth="2" />
            <line x1="48" y1="46" x2="52" y2="46" stroke="#1e293b" strokeWidth="2" />

            {/* Eyes */}
            {isWinking ? (
              <>
                <line x1="35" y1="46" x2="43" y2="46" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                <circle cx="61" cy="46" r="3.5" fill="#0f172a" />
              </>
            ) : (
              <>
                <circle cx="39" cy="46" r="3.5" fill="#0f172a" />
                <circle cx="61" cy="46" r="3.5" fill="#0f172a" />
              </>
            )}

            {/* Smile / Smirk */}
            <path d="M44 58 Q50 63 57 57" stroke="#7c2d12" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>

          {/* Flame pill badge */}
          <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center text-[10px] text-white shadow-md">
            🔥
          </span>
        </div>
      </div>
    </div>
  );
}
