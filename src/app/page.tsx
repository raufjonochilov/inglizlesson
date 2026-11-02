'use client';

import React, { useState, useEffect } from 'react';
import Navbar, { ActiveTab } from '@/components/Navbar';
import CourseRoadmap from '@/components/CourseRoadmap';
import InteractiveLessonPlayer from '@/components/InteractiveLessonPlayer';
import SpeakingPartner from '@/components/SpeakingPartner';
import GrammarDoctor from '@/components/GrammarDoctor';
import IeltsSimulator from '@/components/IeltsSimulator';
import VocabBuilder from '@/components/VocabBuilder';
import PronunciationCoach from '@/components/PronunciationCoach';
import SarcasticCoach from '@/components/SarcasticCoach';
import MotionLayer from '@/components/MotionLayer';

import { Lesson, COURSE_UNITS } from '@/lib/data/curriculum';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streak, setStreak] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load persisted completed lessons
    const savedLessons = localStorage.getItem('lingua_completed_lessons');
    if (savedLessons) {
      try {
        setCompletedLessonIds(JSON.parse(savedLessons));
      } catch {}
    }

    // Load persisted settings
    const savedKey = localStorage.getItem('lingua_custom_api_key');
    if (savedKey) setApiKey(savedKey);

    const savedSound = localStorage.getItem('lingua_sound_enabled');
    if (savedSound !== null) setSoundEnabled(savedSound === 'true');

    // Load and update streak
    const lastActiveDate = localStorage.getItem('lingua_last_active_date');
    const todayStr = new Date().toDateString();
    const storedStreak = parseInt(localStorage.getItem('lingua_streak_days') || '1', 10);

    if (lastActiveDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActiveDate === todayStr) {
        setStreak(storedStreak);
      } else if (lastActiveDate === yesterday.toDateString()) {
        const newStreak = storedStreak + 1;
        setStreak(newStreak);
        localStorage.setItem('lingua_streak_days', newStreak.toString());
        localStorage.setItem('lingua_last_active_date', todayStr);
      } else {
        setStreak(1);
        localStorage.setItem('lingua_streak_days', '1');
        localStorage.setItem('lingua_last_active_date', todayStr);
      }
    } else {
      localStorage.setItem('lingua_last_active_date', todayStr);
      localStorage.setItem('lingua_streak_days', '1');
    }
  }, []);

  const handleActivity = () => {
    const todayStr = new Date().toDateString();
    localStorage.setItem('lingua_last_active_date', todayStr);
  };

  const handleSoundToggle = (val: boolean) => {
    setSoundEnabled(val);
    localStorage.setItem('lingua_sound_enabled', val.toString());
  };

  const handleLessonComplete = (lessonId: string) => {
    handleActivity();
    if (!completedLessonIds.includes(lessonId)) {
      const next = [...completedLessonIds, lessonId];
      setCompletedLessonIds(next);
      localStorage.setItem('lingua_completed_lessons', JSON.stringify(next));
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500">LinguaPulse AI yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-light relative min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white cyber-grid overflow-hidden">
      {/* Ambient 3D Glowing Atmospheric Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/15 blur-[140px] pointer-events-none animate-float-slow" />
      <div className="fixed top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none animate-float-reverse" />

      {/* Floating 3D Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'instant' });
          if (tab !== 'lessons') {
            setSelectedLesson(null);
          }
        }}
        apiKey={apiKey}
        setApiKey={setApiKey}
        soundEnabled={soundEnabled}
        setSoundEnabled={handleSoundToggle}
        streak={streak}
      />

      {/* Main Content View with 3D Depth */}
      <main className={`studio-main module-${activeTab} relative z-10 flex-1`}>
        <div key={activeTab} className="module-entrance">
        {activeTab === 'lessons' && (
          selectedLesson ? (
            <InteractiveLessonPlayer
              lesson={selectedLesson}
              onComplete={handleLessonComplete}
              onBackToCourse={() => setSelectedLesson(null)}
              apiKey={apiKey}
              soundEnabled={soundEnabled}
            />
          ) : (
            <CourseRoadmap
              onNavigate={(tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'instant' }); }}
              completedLessonIds={completedLessonIds}
              onSelectLesson={(lesson) => setSelectedLesson(lesson)}
              soundEnabled={soundEnabled}
            />
          )
        )}

        {activeTab === 'speaking' && (
          <SpeakingPartner
            apiKey={apiKey}
            soundEnabled={soundEnabled}
            onActivity={handleActivity}
          />
        )}

        {activeTab === 'sarcastic' && (
          <SarcasticCoach
            apiKey={apiKey}
            soundEnabled={soundEnabled}
            onActivity={handleActivity}
          />
        )}

        {activeTab === 'grammar' && (
          <GrammarDoctor
            apiKey={apiKey}
            soundEnabled={soundEnabled}
            onActivity={handleActivity}
          />
        )}

        {activeTab === 'ielts' && (
          <IeltsSimulator
            apiKey={apiKey}
            soundEnabled={soundEnabled}
            onActivity={handleActivity}
          />
        )}

        {activeTab === 'vocab' && (
          <VocabBuilder
            soundEnabled={soundEnabled}
            onActivity={handleActivity}
          />
        )}

        {activeTab === 'pronunciation' && (
          <PronunciationCoach
            soundEnabled={soundEnabled}
            onActivity={handleActivity}
          />
        )}
        </div>
      </main>
      <MotionLayer />
    </div>
  );
}



