'use client';
import { useEffect, useState } from 'react';
import { AudioLines, Play, Square, ArrowUpRight, Volume2 } from 'lucide-react';
import { getVoiceConfig, saveVoiceConfig, speakText, stopSpeaking, VoiceConfig } from '@/lib/speech';

export default function VoiceStudio() {
  const [language, setLanguage] = useState<'uz' | 'en' | 'mixed'>('uz');
  const [state, setState] = useState('idle');
  const [config, setConfig] = useState<VoiceConfig>(() => getVoiceConfig());
  const samples = {
    uz: 'Salom! Har kuni kichik bir qadam — katta natijaning boshlanishi. Bugun ingliz tilini birga o‘rganamiz.',
    en: 'Every conversation is a new beginning. Take your time, find your voice, and enjoy learning English.',
    mixed: 'Bugungi iboramiz: "Take your time." Bu — shoshilmang, degani. "You are doing great!" Siz juda yaxshi harakat qilyapsiz.',
  };
  useEffect(() => {
    const update = (event: Event) => setState((event as CustomEvent).detail);
    const sync = () => setConfig(getVoiceConfig());
    window.addEventListener('lingua:speech', update);
    window.addEventListener('lingua:voice-settings', sync);
    return () => { window.removeEventListener('lingua:speech', update); window.removeEventListener('lingua:voice-settings', sync); stopSpeaking(); };
  }, []);
  const change = (value: Partial<VoiceConfig>) => { const next = { ...config, ...value }; setConfig(next); saveVoiceConfig(next); };
  const playing = state === 'loading' || state === 'speaking';
  const selectedSpeed = language === 'en' ? config.speed : (config.uzbekSpeed ?? 0.95);
  const speeds = language === 'en' ? [0.8, 1, 1.15] : [0.9, 1, 1.15];
  return <section className="voice-studio">
    <div className="flex items-center justify-between"><span className="section-eyebrow"><AudioLines size={14}/> OVOZ STUDIYASI</span><span className="studio-chip">UZ + EN</span></div>
    <h3>So‘zlarni his qiling.</h3><p className="text-sm text-slate-400 leading-relaxed">Tinglang. Takrorlang. O‘z ovozingizni toping.</p>
    <label className="voice-field block mt-4">Ovoz bazasi<select value={config.provider || 'microsoft'} onChange={e => change({ provider: e.target.value as 'local' | 'microsoft', engine: 'hd-studio' })}>{process.env.NEXT_PUBLIC_LOCAL_TTS_ENABLED === 'true' && <option value="local">Navoiy · Mahalliy o‘zbekcha</option>}<option value="microsoft">Microsoft · Sardor / Madina</option></select></label>
    <div className="voice-tabs" role="group" aria-label="Namuna tili">{([['uz', 'O‘zbekcha'], ['en', 'English'], ['mixed', 'Aralash']] as const).map(([id, label]) => <button key={id} aria-pressed={language === id} className={language === id ? 'selected' : ''} onClick={() => { stopSpeaking(); setLanguage(id); }}>{label}</button>)}</div>
    <div className={`waveform ${playing ? 'is-playing' : ''}`} aria-hidden="true">{Array.from({length: 38}, (_, i) => <span key={i} style={{height: `${12 + Math.sin(i * 1.7) ** 2 * 43}px`, animationDelay: `${i * 35}ms`}}/>)}</div>
    <p className="voice-sample" lang={language === 'en' ? 'en' : 'uz'}>“{samples[language]}”</p>
    <div className="grid grid-cols-2 gap-3 my-5"><label className="voice-field">Spiker<select disabled={config.provider === 'local'} value={config.gender || 'male'} onChange={e => change({gender: e.target.value as 'male' | 'female'})}><option value="male">{config.provider === 'local' ? 'Navoiy · Namuna ovozi' : 'Sardor · Erkak'}</option><option value="female">{config.provider === 'local' ? 'Navoiy · Namuna ovozi' : 'Madina · Ayol'}</option></select></label><label className="voice-field">English accent<select value={config.accent.startsWith('en') ? config.accent : 'en-US'} onChange={e => change({accent: e.target.value as VoiceConfig['accent']})}><option value="en-US">American · US</option><option value="en-GB">British · UK</option><option value="en-AU">Australian · AU</option></select></label></div>
    <div className="voice-speed"><span><Volume2 size={14}/> {language === 'en' ? 'English tezligi' : 'O‘zbekcha tezlik'}</span><div>{speeds.map(speed => <button key={speed} aria-pressed={selectedSpeed === speed} className={selectedSpeed === speed ? 'selected' : ''} onClick={() => change(language === 'en' ? { speed } : { uzbekSpeed: speed })}>{speed}×</button>)}</div></div>
    <button className="studio-play" onClick={() => playing ? stopSpeaking() : speakText(samples[language], { lang: language === 'en' ? (config.accent.startsWith('en') ? config.accent : 'en-US') : language === 'uz' ? 'uz-UZ' : 'uz-mixed', config })}>{playing ? <Square size={17}/> : <Play size={17} fill="currentColor"/>}{state === 'loading' ? 'Ovoz tayyorlanmoqda…' : playing ? 'To‘xtatish' : 'Ovozni tinglash'}<ArrowUpRight size={17} className="ml-auto"/></button>
    <p role="status" className="voice-status">{state === 'error' ? 'Ovoz yuklanmadi. Internetni tekshirib, qayta urinib ko‘ring.' : config.provider === 'local' ? 'O‘zbekcha: mahalliy Navoiy · English: Microsoft' : 'Microsoft · Tilga mos talaffuz · Tabiiy pauzalar'}</p>
  </section>;
}
