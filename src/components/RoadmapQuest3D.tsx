'use client';
import { Check, Lock, Play, Flag, Star } from 'lucide-react';
import { COURSE_UNITS, Lesson } from '@/lib/data/curriculum';
interface Props { completedLessonIds: string[]; onSelectLesson: (lesson: Lesson) => void; visibleLessonIds?: string[] }
export default function RoadmapQuest3D({completedLessonIds,onSelectLesson,visibleLessonIds}:Props) {
 const all = COURSE_UNITS.flatMap(unit=>unit.lessons);
 if(visibleLessonIds?.length===0)return <div className="empty-courses">Dars topilmadi. Boshqa so‘z bilan qidiring.</div>;
 return <div className="quest-world">{COURSE_UNITS.map((unit,index)=>{
 const visible=unit.lessons.filter(lesson=>!visibleLessonIds || visibleLessonIds.includes(lesson.id));
 if(!visible.length)return null;
 const done=unit.lessons.filter(lesson=>completedLessonIds.includes(lesson.id)).length;
 return <section className="quest-chapter" key={unit.id}>
 <header><span className="chapter-icon"><Flag size={22}/></span><div><small>CHAPTER 0{index+1} · {unit.level}</small><h3>{unit.titleUz}</h3></div><span className="chapter-score">{done}/{unit.lessons.length}</span></header>
 <div className="quest-path">{visible.map((lesson,i)=>{
 const position=all.findIndex(item=>item.id===lesson.id);const complete=completedLessonIds.includes(lesson.id);const unlocked=position===0||complete||completedLessonIds.includes(all[position-1].id);
 return <div className={`quest-stop stop-${i%3} ${complete?'done':unlocked?'ready':'locked'}`} key={lesson.id}>
 <button className="quest-node" disabled={!unlocked} onClick={()=>onSelectLesson(lesson)} aria-label={`${lesson.titleUz || lesson.title}${!unlocked?' — qulflangan':''}`}>
 {complete?<Check size={26}/>:unlocked?<Play size={26} fill="currentColor"/>:<Lock size={22}/>}</button>
 <div className="quest-label"><small>{String(lesson.number).padStart(2,'0')} / {lesson.durationMin} DAQIQA</small><strong>{lesson.title}</strong><span>{complete?'✓ Yakunlandi':unlocked?'Sizning navbatdagi qadamingiz':'Avvalgi darsni yakunlang'}</span></div>
 </div>})}<div className={`chapter-trophy ${done===unit.lessons.length?'earned':''}`}><Star size={25}/><span>{done===unit.lessons.length?'Bosqich yakunlandi!':'Bosqich yutug‘i'}</span></div></div>
 </section>})}</div>;
}
