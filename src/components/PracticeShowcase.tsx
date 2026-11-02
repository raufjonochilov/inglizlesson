'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play, Mic, BookOpen, Target, Sparkles } from 'lucide-react';
import type { ActiveTab } from './Navbar';
import BusterAvatar from './BusterAvatar';
const modes = [
 {id:'speaking',label:'AI suhbat',title:'Gapirishni bugundan boshlang.',description:'Mavzu tanlang, fikringizni ayting va inglizcha suhbatni davom ettiring.',icon:Mic},
 {id:'sarcastic',label:'Buster sinovi',title:'Bitta savol. Yangi kashfiyot.',description:'Qiziqarli savollar bilan grammatikangizni sinang. Buster har bir javobga munosabat bildiradi.',icon:Sparkles},
 {id:'vocab',label:'So‘zlar',title:'Har bir so‘z — yangi imkoniyat.',description:'Kartani aylantiring, ma’nosini bilib oling va yangi so‘zlarni takrorlang.',icon:BookOpen},
 {id:'ielts',label:'IELTS',title:'Katta maqsad. Aniq amaliyot.',description:'Speaking savollari va imtihon bosqichlari bilan muntazam mashq qiling.',icon:Target},
] as const;
export default function PracticeShowcase({onNavigate}:{onNavigate:(id:ActiveTab)=>void}) {
 const [active,setActive]=useState(0);const [paused,setPaused]=useState(false);const [flipped,setFlipped]=useState(false);
 const root=useRef<HTMLElement>(null);const current=modes[active];const Icon=current.icon;
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  if(media.matches || !root.current)return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('motion-visible');observer.unobserve(entry.target);}}),{threshold:.12});
  root.current.querySelectorAll('[data-reveal]').forEach(el=>{el.classList.add('motion-pending');observer.observe(el);});
  return()=>observer.disconnect();
 },[]);
 const select=(i:number)=>{setActive(i);setFlipped(false);};
 return <section className="practice-showcase" ref={root}>
  <div className="skills-ribbon"><div className={`skills-track ${paused?'paused':''}`} aria-hidden="true">{[0,1].map(copy=><div key={copy}>{['SPEAK WITH CONFIDENCE','LEARN SOMETHING NEW','MEET YOUR AI COACH','BUILD YOUR ENGLISH'].map(word=><span key={word}>{word}<i>✦</i></span>)}</div>)}</div><button onClick={()=>setPaused(!paused)} aria-label={paused?'Harakatni davom ettirish':'Harakatni to‘xtatish'}>{paused?<Play size={15}/>:<Pause size={15}/>}</button></div>
  <header data-reveal><span className="section-eyebrow">BIR PLATFORMA. YANGI IMKONIYATLAR.</span><h2>O‘rganishning <em>o‘z ritmingizni</em> toping.</h2><p>Suhbat, bilim yoki sinov — bugun nimadan boshlaymiz?</p></header>
  <div className="showcase-tabs" role="tablist" aria-label="Amaliyot namunalari" data-reveal>{modes.map((mode,i)=><button role="tab" id={`preview-tab-${mode.id}`} aria-controls="practice-preview-panel" aria-selected={i===active} tabIndex={i===active?0:-1} key={mode.id} onClick={()=>select(i)} onKeyDown={event=>{let n=i;if(event.key==='ArrowRight')n=(i+1)%modes.length;else if(event.key==='ArrowLeft')n=(i+modes.length-1)%modes.length;else if(event.key==='Home')n=0;else if(event.key==='End')n=modes.length-1;else return;event.preventDefault();select(n);document.getElementById(`preview-tab-${modes[n].id}`)?.focus();}}><mode.icon size={17}/>{mode.label}</button>)}</div>
  <div className="showcase-window" data-reveal><div className="window-chrome"><span/><span/><span/><small>LINGUAPULSE / AMALIYOT NAMUNASI</small></div><div role="tabpanel" id="practice-preview-panel" aria-labelledby={`preview-tab-${current.id}`} className="showcase-panel" tabIndex={0}>
   <div className="showcase-copy" key={`copy-${active}`}><span className="showcase-icon"><Icon size={25}/></span><h3>{current.title}</h3><p>{current.description}</p><button className="showcase-cta" onClick={()=>onNavigate(current.id)}>Mashqni boshlash<ArrowUpRight size={18}/></button></div>
   <div className="showcase-demo" key={active}>
    {active===0&&<div className="chat-demo"><small>SUHBAT NAMUNASI</small><div>Hello! What would you like to talk about?</div><div className="chat-response">Let’s talk about my next adventure.</div><span className="demo-dots" aria-label="Suhbat animatsiyasi"><i/><i/><i/></span></div>}
    {active===1&&<div className="coach-demo"><BusterAvatar mood="laughing" talking={false}/><span>“I agree” yoki “I am agree”?</span></div>}
    {active===2&&<button className={`word-demo ${flipped?'flipped':''}`} onClick={()=>setFlipped(!flipped)} aria-label="Namuna so‘z tarjimasini ko‘rish"><small>{flipped?'O‘ZBEKCHA':'ENGLISH'}</small><strong>{flipped?'Kashf qilmoq':'Discover'}</strong><span>{flipped?'Yangi narsani bilib olmoq.':'/dɪˈskʌvə/'} </span><em>Kartani aylantirish ↻</em></button>}
    {active===3&&<div className="exam-demo"><small>SPEAKING JOURNEY</small>{['Part 1 · Tanishuv','Part 2 · Mavzu bo‘yicha nutq','Part 3 · Chuqur suhbat'].map((item,i)=><div key={item}><b>0{i+1}</b>{item}</div>)}<span>O‘z darajangizdan boshlang.</span></div>}
   </div>
  </div></div>
 </section>;
}
