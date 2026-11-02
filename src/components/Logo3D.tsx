'use client';

import React, { useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { SoundFX } from '@/lib/speech';

interface Logo3DProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  onClick?: () => void;
}

export default function Logo3D({ size = 'md', showText = true, onClick }: Logo3DProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Calculate 3D tilt angles (max 25 degrees)
    setRotate({
      x: -(y / (rect.height / 2)) * 22,
      y: (x / (rect.width / 2)) * 22,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleClick = () => {
    SoundFX.playChime();
    onClick?.();
  };

  // Dimensions based on size
  const iconSize = size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-20 h-20' : 'w-12 h-12';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="inline-flex items-center gap-3 cursor-pointer select-none perspective-1000 group py-1"
      style={{ perspective: 1000 }}
    >
      {/* 3D Kinetic Emblem Container */}
      <div
        className={`relative ${iconSize} transition-transform duration-200 ease-out preserve-3d`}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovered ? 1.15 : 1})`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Ambient Halo Behind Emblem */}
        <div className="absolute inset-[-6px] rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow" />

        {/* 3D Gyroscopic Outer Orbit Ring 1 */}
        <div
          className="absolute inset-[-4px] rounded-full border border-indigo-400/50 pointer-events-none"
          style={{
            transform: 'rotateX(68deg) rotateY(15deg) translateZ(10px)',
            animation: 'spin 5s linear infinite',
          }}
        >
          {/* Orbital Bead Light */}
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] absolute -top-1 left-1/2 -translate-x-1/2" />
        </div>

        {/* 3D Gyroscopic Counter Ring 2 */}
        <div
          className="absolute inset-[-4px] rounded-full border border-purple-400/50 pointer-events-none"
          style={{
            transform: 'rotateX(-68deg) rotateY(-20deg) translateZ(-8px)',
            animation: 'spin 7s linear infinite reverse',
          }}
        >
          {/* Orbital Bead Light */}
          <div className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_10px_#e879f9] absolute -bottom-1 left-1/2 -translate-x-1/2" />
        </div>

        {/* Central 3D Faceted Crystal Core */}
        <div
          className="relative w-full h-full rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 border border-white/40 shadow-2xl overflow-hidden flex items-center justify-center"
          style={{
            transform: 'translateZ(18px)',
            boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.6)',
          }}
        >
          {/* Prismatic Diamond Facets Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/40 via-transparent to-black/60 pointer-events-none" />

          {/* Dynamic Laser Beam Shimmer across Core */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

          {/* Central Holographic Emblem Icon */}
          <div className="relative z-10 flex items-center justify-center">
            <Sparkles className="w-1/2 h-1/2 text-cyan-200 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)] animate-pulse" />
          </div>

          {/* Bottom Depth Rim */}
          <div className="absolute bottom-0 inset-x-0 h-1.5 bg-indigo-950/80 blur-[1px]" />
        </div>
      </div>

      {/* Holographic 3D Typography */}
      {showText && (
        <div
          className="flex flex-col transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${rotate.x * 0.4}deg) rotateY(${rotate.y * 0.4}deg) translateZ(12px)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className={`font-black ${textSize} tracking-tight bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(99,102,241,0.35)] group-hover:from-cyan-300 group-hover:via-white group-hover:to-fuchsia-300 transition-all duration-300`}
            >
              LinguaPulse
            </span>

            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-400/40 text-cyan-300 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.4)] backdrop-blur-md">
              AI 3.0
            </span>
          </div>

          <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase -mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
            <span>Interactive Academy</span>
          </span>
        </div>
      )}
    </div>
  );
}
