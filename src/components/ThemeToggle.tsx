'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { getStoredTheme, toggleTheme, Theme } from '@/lib/theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initial = getStoredTheme();
    setTheme(initial);
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-slate-800/40 border border-white/10" />
    );
  }

  return (
    <button
      onClick={handleToggle}
      aria-label="Mavzuni almashtirish (Tun/Kun)"
      title={theme === 'dark' ? "Yorug' mavzuga o'tish" : "Tungi mavzuga o'tish"}
      className="p-2 rounded-xl transition-all duration-300 flex items-center justify-center bg-slate-800/60 hover:bg-slate-700/80 text-amber-300 hover:text-amber-200 border border-white/10 shadow-sm"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-300 transition-transform rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-300 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
