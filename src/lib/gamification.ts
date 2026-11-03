export interface UserStats {
  totalXP: number;
  level: number;
  lessonsCompleted: number;
  wordsLearned: number;
  speakingMessages: number;
  grammarChecks: number;
  ieltsSessions: number;
  pronunciationDrills: number;
  sarcasticInteractions: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  unlocked: boolean;
  category: 'lessons' | 'streak' | 'xp' | 'practice';
}

export interface ActivityItem {
  id: string;
  type: 'lesson' | 'speaking' | 'vocab' | 'grammar' | 'ielts' | 'pronunciation' | 'sarcastic' | 'streak';
  description: string;
  xp: number;
  timestamp: number;
}

const STORAGE_KEY_STATS = 'lingua_gamification_stats';
const STORAGE_KEY_ACTIVITIES = 'lingua_recent_activities';

export const XP_REWARDS = {
  LESSON_COMPLETE: 100,
  SPEAKING_MESSAGE: 15,
  VOCAB_WORD: 10,
  GRAMMAR_CHECK: 20,
  IELTS_SESSION: 50,
  PRONUNCIATION_DRILL: 15,
  SARCASTIC_COACH: 15,
  DAILY_STREAK: 30,
};

export function calculateLevel(totalXP: number): { level: number; currentLevelXP: number; nextLevelXP: number; progress: number } {
  // Each level requires: level * 150 XP
  // Level 1: 0-150, Level 2: 151-350, etc.
  let lvl = 1;
  let accumulated = 0;
  while (true) {
    const cost = lvl * 150;
    if (totalXP < accumulated + cost) {
      const currentLevelXP = totalXP - accumulated;
      const progress = Math.min(100, Math.round((currentLevelXP / cost) * 100));
      return { level: lvl, currentLevelXP, nextLevelXP: cost, progress };
    }
    accumulated += cost;
    lvl++;
  }
}

export function getStats(): UserStats {
  if (typeof window === 'undefined') {
    return getInitialStats();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (!raw) return getInitialStats();
    const parsed = JSON.parse(raw);
    const { level } = calculateLevel(parsed.totalXP || 0);
    return { ...parsed, level };
  } catch {
    return getInitialStats();
  }
}

function getInitialStats(): UserStats {
  return {
    totalXP: 0,
    level: 1,
    lessonsCompleted: 0,
    wordsLearned: 0,
    speakingMessages: 0,
    grammarChecks: 0,
    ieltsSessions: 0,
    pronunciationDrills: 0,
    sarcasticInteractions: 0,
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: new Date().toDateString(),
  };
}

export function saveStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  const { level } = calculateLevel(stats.totalXP);
  localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify({ ...stats, level }));
}

export function addXP(
  type: ActivityItem['type'],
  amount: number,
  description: string
): { newXP: number; leveledUp: boolean; newLevel: number } {
  const currentStats = getStats();
  const oldLevelInfo = calculateLevel(currentStats.totalXP);

  const updatedXP = currentStats.totalXP + amount;
  const newLevelInfo = calculateLevel(updatedXP);

  // Update specific metric counter
  const updatedStats: UserStats = {
    ...currentStats,
    totalXP: updatedXP,
    level: newLevelInfo.level,
    lessonsCompleted: type === 'lesson' ? currentStats.lessonsCompleted + 1 : currentStats.lessonsCompleted,
    wordsLearned: type === 'vocab' ? currentStats.wordsLearned + 1 : currentStats.wordsLearned,
    speakingMessages: type === 'speaking' ? currentStats.speakingMessages + 1 : currentStats.speakingMessages,
    grammarChecks: type === 'grammar' ? currentStats.grammarChecks + 1 : currentStats.grammarChecks,
    ieltsSessions: type === 'ielts' ? currentStats.ieltsSessions + 1 : currentStats.ieltsSessions,
    pronunciationDrills: type === 'pronunciation' ? currentStats.pronunciationDrills + 1 : currentStats.pronunciationDrills,
    sarcasticInteractions: type === 'sarcastic' ? currentStats.sarcasticInteractions + 1 : currentStats.sarcasticInteractions,
    lastActiveDate: new Date().toDateString(),
  };

  saveStats(updatedStats);
  logActivity(type, description, amount);

  return {
    newXP: updatedXP,
    leveledUp: newLevelInfo.level > oldLevelInfo.level,
    newLevel: newLevelInfo.level,
  };
}

export function logActivity(type: ActivityItem['type'], description: string, xp: number): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
    const list: ActivityItem[] = raw ? JSON.parse(raw) : [];
    const item: ActivityItem = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      description,
      xp,
      timestamp: Date.now(),
    };
    const updated = [item, ...list].slice(0, 30);
    localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(updated));
  } catch {}
}

export function getRecentActivities(): ActivityItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVITIES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getAchievements(stats: UserStats): Achievement[] {
  return [
    {
      id: 'first_step',
      title: 'Birinchi Qadam',
      description: '1 ta darsni muvaffaqiyatli yakunlang',
      icon: '🌱',
      target: 1,
      current: stats.lessonsCompleted,
      unlocked: stats.lessonsCompleted >= 1,
      category: 'lessons',
    },
    {
      id: 'course_master',
      title: 'Darslar Ustasi',
      description: '10 ta darsni to‘liq tamomlang',
      icon: '🎓',
      target: 10,
      current: stats.lessonsCompleted,
      unlocked: stats.lessonsCompleted >= 10,
      category: 'lessons',
    },
    {
      id: 'vocab_champ',
      title: 'So‘z Boyligi Boy',
      description: '50 ta yangi so‘zni o‘zlashtiring',
      icon: '📚',
      target: 50,
      current: stats.wordsLearned,
      unlocked: stats.wordsLearned >= 50,
      category: 'practice',
    },
    {
      id: 'speaking_hero',
      title: 'AI Suhbatdosh',
      description: 'Sarah va Alex bilan 20 marta suhbatlashing',
      icon: '🎙️',
      target: 20,
      current: stats.speakingMessages,
      unlocked: stats.speakingMessages >= 20,
      category: 'practice',
    },
    {
      id: 'grammar_doc',
      title: 'Grammatika Shifokori',
      description: '15 ta jumlangizni AI orqali tekshirtiring',
      icon: '🩺',
      target: 15,
      current: stats.grammarChecks,
      unlocked: stats.grammarChecks >= 15,
      category: 'practice',
    },
    {
      id: 'buster_victim',
      title: 'Busterning Sevimlisi',
      description: 'Professor Buster bilan 15 marta bahslashing',
      icon: '🔥',
      target: 15,
      current: stats.sarcasticInteractions,
      unlocked: stats.sarcasticInteractions >= 15,
      category: 'practice',
    },
    {
      id: 'streak_3',
      title: 'Intizomli O‘quvchi',
      description: 'Ketma-ket 3 kun faol bo‘ling',
      icon: '⚡',
      target: 3,
      current: stats.currentStreak,
      unlocked: stats.currentStreak >= 3,
      category: 'streak',
    },
    {
      id: 'streak_7',
      title: 'Haftalik Chempion',
      description: '7 kunlik o‘quv seriyasini saqlang',
      icon: '🔥',
      target: 7,
      current: stats.currentStreak,
      unlocked: stats.currentStreak >= 7,
      category: 'streak',
    },
    {
      id: 'xp_500',
      title: '500 XP Tajriba',
      description: 'Umumiy 500 XP ball to‘plang',
      icon: '⭐',
      target: 500,
      current: stats.totalXP,
      unlocked: stats.totalXP >= 500,
      category: 'xp',
    },
    {
      id: 'xp_2000',
      title: 'Ingliz Tili Yulduzi',
      description: '2000 XP ball to‘plang',
      icon: '👑',
      target: 2000,
      current: stats.totalXP,
      unlocked: stats.totalXP >= 2000,
      category: 'xp',
    },
  ];
}

export function exportFullProgress(): string {
  if (typeof window === 'undefined') return '{}';
  const data: Record<string, any> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('lingua_')) {
      data[key] = localStorage.getItem(key);
    }
  }
  return JSON.stringify(data, null, 2);
}

export function importFullProgress(jsonString: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const parsed = JSON.parse(jsonString);
    if (typeof parsed !== 'object' || parsed === null) return false;
    Object.keys(parsed).forEach((k) => {
      if (k.startsWith('lingua_') && typeof parsed[k] === 'string') {
        localStorage.setItem(k, parsed[k]);
      }
    });
    return true;
  } catch {
    return false;
  }
}
