'use client';
import { useState } from 'react';
import { ArrowUpRight, ArrowRight, BookOpen, Check, Headphones, Search, Sparkles, LayoutGrid, Map, Target } from 'lucide-react';
import { COURSE_UNITS, Lesson } from '@/lib/data/curriculum';
import LessonCard3D from './LessonCard3D';
import RoadmapQuest3D from './RoadmapQuest3D';
import VoiceStudio from './VoiceStudio';
import BusterAvatar from './BusterAvatar';
import PracticeShowcase from './PracticeShowcase';
import type { ActiveTab } from './Navbar';

interface Props { completedLessonIds: string[]; onSelectLesson: (lesson: Lesson) => void; soundEnabled: boolean; onNavigate: (tab: ActiveTab) => void; }
export default function CourseRoadmap({ completedLessonIds, onSelectLesson, onNavigate }: Props) {
  const [level, setLevel] = useState('All');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'quest'>('quest');
  const lessons = COURSE_UNITS.flatMap(unit => unit.lessons);
  const completed = lessons.filter(lesson => completedLessonIds.includes(lesson.id)).length;
  const progress = Math.round(completed / lessons.length * 100);
  const next = lessons.find(lesson => !completedLessonIds.includes(lesson.id));
  const filtered = COURSE_UNITS.map(unit => ({ ...unit, lessons: unit.lessons.filter(lesson => (level === 'All' || lesson.level === level) && `${lesson.title} ${lesson.titleUz} ${lesson.descriptionUz}`.toLowerCase().includes(query.trim().toLowerCase())) })).filter(unit => unit.lessons.length);
  return <div className="learning-dashboard animate-fade-in">
    <div className="dashboard-heading"><div><div className="section-eyebrow"><span className="live-dot"/> SIZNING YANGI BOSQICHINGIZ</div><h1>Salom, o‘rganuvchi <span className="greeting-spark">✳</span></h1><p>Bugungi kichik qadam — ertangi erkin suhbat.</p></div><div className="daily-intent"><Target size={17}/><span>Bugungi niyat<strong>15 daqiqa o‘zingiz uchun</strong></span></div></div>
    <section className="journey-hero">
      <div className="hero-copy"><span className="hero-tag"><Sparkles size={13}/> INGLIZ TILI, SIZNING RITMINGIZDA</span><h2>Ingliz tilida<br/><em>erkin gapiring.</em></h2><p>Birinchi so‘zdan ishonchli suhbatgacha. Darslar, AI hamkor va tabiiy talaffuz — barchasi bir makonda.</p><button className="mint-button" onClick={() => onSelectLesson(next || lessons[0])}>{next ? 'O‘rganishni davom ettirish' : 'Birinchi darsni takrorlash'}<ArrowUpRight size={19}/></button><div className="hero-footnote"><span className="mini-avatars"><i>A</i><i>U</i><i>EN</i></span><span>O‘zbekcha tushuntirish. Inglizcha amaliyot.</span></div></div>
      <div className="hero-art premium-hero-art"><div className="hero-orbit-ring"/><div className="hero-coach-label"><Sparkles size={16}/> Sizning AI ustozingiz</div><BusterAvatar mood="laughing" talking={false}/><div className="hero-speech-card">Ready for your next adventure?<span>Birga yangi bosqichga chiqamiz!</span></div><span className="hero-star star-one">✦</span><span className="hero-star star-two">✧</span></div>
    </section>
    <div className="dashboard-stats"><div><span className="stat-icon mint"><BookOpen size={20}/></span><span><strong>{lessons.length}</strong><small>Interaktiv dars</small></span><span className="stat-detail">A1 → B2</span></div><div><span className="stat-icon lilac"><Check size={20}/></span><span><strong>{completed}<em> / {lessons.length}</em></strong><small>Yakunlangan darslar</small></span><span className="stat-detail">{progress}%</span></div><div><span className="stat-icon peach"><Headphones size={20}/></span><span><strong>2 til</strong><small>Tabiiy ovozli amaliyot</small></span><span className="stat-detail">UZ + EN</span></div></div>
    <PracticeShowcase onNavigate={onNavigate}/><section className="practice-launchpad" aria-label="Tezkor amaliyot">
  <button onClick={()=>onNavigate('speaking')}><span className="launch-icon"><Headphones size={24}/></span><span><small>SPEAKING CLUB</small><strong>Bugun inglizcha gapiring</strong><em>AI hamkor bilan erkin suhbat</em></span><ArrowUpRight size={20}/></button>
  <button onClick={()=>onNavigate('sarcastic')}><span className="launch-icon"><Sparkles size={24}/></span><span><small>BUSTER CHALLENGE</small><strong>O‘zingizni sinab ko‘ring</strong><em>Qiziqarli savol, tezkor javob</em></span><ArrowUpRight size={20}/></button>
  <button onClick={()=>onNavigate('ielts')}><span className="launch-icon"><Target size={24}/></span><span><small>IELTS PRACTICE</small><strong>Maqsadingizga yaqinlashing</strong><em>Imtihonga bosqichma-bosqich tayyorgarlik</em></span><ArrowUpRight size={20}/></button>
</section>
<section className="achievement-strip" aria-label="Yutuqlar"><div className="achievement-intro"><span>✦</span><div><small>SIZNING YUTUQLARINGIZ</small><strong>Har qadam — yangi g‘alaba</strong></div></div>{[{goal:1,label:'Birinchi qadam',icon:'🚀'},{goal:5,label:'Bilim izlovchi',icon:'💎'},{goal:lessons.length,label:'Kurs ustasi',icon:'🏆'}].map(badge=><div key={badge.goal} className={`achievement-badge ${completed>=badge.goal?'earned':''}`}><span aria-hidden="true">{badge.icon}</span><div><strong>{badge.label}</strong><small>{completed>=badge.goal?'Qo‘lga kiritildi ✓':`${Math.min(completed,badge.goal)} / ${badge.goal} dars`}</small></div></div>)}</section>
    <div className="dashboard-columns"><div className="min-w-0">
      <div className="course-title"><div><span className="section-eyebrow">BOSQICHMA-BOSQICH</span><h2>Sizning o‘quv yo‘lingiz</h2></div><div className="view-toggle"><button onClick={() => setView('grid')} aria-label="Kartalar ko‘rinishi" aria-pressed={view === 'grid'}><LayoutGrid size={16}/></button><button onClick={() => setView('quest')} aria-label="Xarita ko‘rinishi" aria-pressed={view === 'quest'}><Map size={16}/></button></div></div>
      <div className="course-tools"><div className="level-tabs">{['All','A1','A2','B1','B2'].map(id => <button key={id} onClick={() => setLevel(id)} aria-pressed={level === id}>{id === 'All' ? 'Barchasi' : id}</button>)}</div><label className="course-search"><Search size={15}/><input aria-label="Dars qidirish" placeholder="Dars qidirish…" value={query} onChange={e => setQuery(e.target.value)}/></label></div>
      {view === 'quest' ? <RoadmapQuest3D completedLessonIds={completedLessonIds} onSelectLesson={onSelectLesson} visibleLessonIds={filtered.flatMap(unit => unit.lessons.map(lesson => lesson.id))}/> : <div className="space-y-7">{filtered.length === 0 && <div className="empty-courses"><Search size={24}/><p>Dars topilmadi. Boshqa so‘z bilan qidiring.</p></div>}{filtered.map(unit => <section key={unit.id}><div className="unit-title"><span>{unit.level}</span><h3>{unit.titleUz.replace(/^\d+-Bo'lim:\s*/, '')}</h3><small>{unit.lessons.length} dars</small></div><div className="grid sm:grid-cols-2 gap-3">{unit.lessons.map(lesson => { const index = lessons.findIndex(item => item.id === lesson.id); const done = completedLessonIds.includes(lesson.id); const unlocked = index === 0 || done || completedLessonIds.includes(lessons[index - 1].id); return <LessonCard3D key={lesson.id} lesson={lesson} isCompleted={done} isCurrent={unlocked && !done} isUnlocked={unlocked} onStart={() => { if (unlocked) onSelectLesson(lesson); }}/>; })}</div></section>)}</div>}
    </div><aside className="dashboard-rail"><VoiceStudio/><section className="progress-note"><div className="flex items-center gap-2 text-emerald-300"><Target size={18}/><strong>Har bir qadam hisobda</strong></div><div className="progress-track"><span style={{width: `${progress}%`}}/></div><p>{completed ? `${completed} ta dars yakunlandi. O‘z ritmingizda davom eting.` : 'Birinchi darsni yakunlang va o‘quv yo‘lingizni boshlang.'}</p>{next && <button onClick={() => onSelectLesson(next)}>Keyingi dars <ArrowRight size={15}/></button>}</section><div className="rail-quote">“A different language is a different vision of life.”<span>Yangi til — dunyoga yangi nigoh.</span></div></aside></div>
  </div>;
}




