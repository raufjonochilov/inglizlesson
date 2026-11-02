'use client';
import { ArrowUpRight, BookOpen, Check, Clock3, Lock } from 'lucide-react';
import { Lesson } from '@/lib/data/curriculum';
interface Props { lesson: Lesson; isCompleted: boolean; isCurrent: boolean; isUnlocked: boolean; onStart: () => void; }
export default function LessonCard3D({lesson, isCompleted, isCurrent, isUnlocked, onStart}: Props) {
  return <button onClick={onStart} disabled={!isUnlocked} className={`lesson-tile ${isCurrent ? 'current' : ''} ${isCompleted ? 'complete' : ''}`}>
    <span className="lesson-tile-top"><span className="lesson-number">{String(lesson.number).padStart(2, '0')}</span><span className="lesson-status">{isCompleted ? <><Check size={12}/>Bajarildi</> : isCurrent ? <><span className="live-dot"/>Davom eting</> : <Lock size={12}/>}</span></span>
    <span className="lesson-tile-title">{lesson.title}</span><span className="lesson-tile-desc">{lesson.descriptionUz}</span>
    <span className="lesson-tile-bottom"><span><Clock3 size={12}/>{lesson.durationMin} daqiqa<span className="mx-1 opacity-40">·</span><BookOpen size={12}/>{lesson.exercises.length} mashq</span><span className="lesson-arrow">{isUnlocked ? <ArrowUpRight size={17}/> : <Lock size={14}/>}</span></span>
  </button>;
}
