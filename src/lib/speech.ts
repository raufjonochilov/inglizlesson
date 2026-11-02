// Web Audio Sound Effects Synthesizer & Speech Recognition/Synthesis helpers

export class SoundFX {
  private static ctx: AudioContext | null = null;

  private static getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  static playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.5, now + 0.3); // C6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch {}
  }

  static playChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.0, now + 0.12); // A5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  static playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  static playBuzzer() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(110, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }
}

// Shared voice settings and cancellation-safe playback for every learning module.
export { isUzbekText } from './voice-text';
import { isUzbekText, normalizeSpeechText, splitSpeechSegments } from './voice-text';
export interface VoiceConfig {
  provider?: 'gemini' | 'microsoft' | 'local';
  voiceSetupVersion?: number;
  engine: 'hd-studio' | 'browser-natural';
  accent: 'uz-UZ' | 'en-US' | 'en-GB' | 'en-AU';
  gender?: 'male' | 'female';
  preferredVoiceName?: string;
  speed: number;
  uzbekSpeed?: number;
  pitch: number;
}
const DEFAULT_VOICE_CONFIG: VoiceConfig = { provider: process.env.NEXT_PUBLIC_LOCAL_TTS_ENABLED === 'true' ? 'local' : 'microsoft', engine: 'hd-studio', accent: 'en-US', gender: 'male', speed: 1, uzbekSpeed: 1, pitch: 1 };
let currentAudioPlayer: HTMLAudioElement | null = null;
let controller: AbortController | null = null;
let audioUrl: string | null = null;
let playbackId = 0;
function publish(state: 'loading' | 'speaking' | 'idle' | 'error') {
  window.dispatchEvent(new CustomEvent('lingua:speech', { detail: state }));
}
export function getVoiceConfig(): VoiceConfig {
  if (typeof window === 'undefined') return { ...DEFAULT_VOICE_CONFIG };
  try {
    const saved = JSON.parse(localStorage.getItem('lingua_voice_config') || '{}');
    const provider = saved.voiceSetupVersion === 1 && ['local', 'microsoft'].includes(saved.provider)
      && (saved.provider !== 'local' || process.env.NEXT_PUBLIC_LOCAL_TTS_ENABLED === 'true')
      ? saved.provider : DEFAULT_VOICE_CONFIG.provider;
    return { ...DEFAULT_VOICE_CONFIG, ...saved, provider };
  }
  catch { return { ...DEFAULT_VOICE_CONFIG }; }
}
export function saveVoiceConfig(config: VoiceConfig) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lingua_voice_config', JSON.stringify({ ...config, voiceSetupVersion: 1 }));
    window.dispatchEvent(new Event('lingua:voice-settings'));
  }
}
export function getAvailableBrowserVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices().filter(v => /^(en|uz)/.test(v.lang)).map(v => ({
    name: v.name, lang: v.lang, isNatural: /Natural|Google|Neural|Online/i.test(v.name)
  })).sort((a,b) => Number(b.isNatural) - Number(a.isNatural));
}
export function stopSpeaking() {
  if (typeof window === 'undefined') return;
  playbackId++;
  controller?.abort(); controller = null;
  if (currentAudioPlayer) {
    currentAudioPlayer.onended = null; currentAudioPlayer.onerror = null;
    currentAudioPlayer.pause(); currentAudioPlayer.removeAttribute('src'); currentAudioPlayer.load();
    currentAudioPlayer = null;
  }
  if (audioUrl) { URL.revokeObjectURL(audioUrl); audioUrl = null; }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  publish('idle');
}
interface SpeakOptions {
  lang?: string; rate?: number; pitch?: number;
  engine?: VoiceConfig['engine']; voice?: string;
  onEnd?: () => void; onError?: () => void;
  config?: VoiceConfig;
}
export function speakText(raw: string, options: SpeakOptions = {}) {
  if (typeof window === 'undefined') return;
  stopSpeaking();
  const id = playbackId;
  const text = normalizeSpeechText(raw);
  if (!text) { options.onEnd?.(); return; }
  const config = options.config || getVoiceConfig();
  const provider = config.provider === 'local' ? 'local' : 'microsoft';
  const rate = Math.min(1.3, Math.max(0.7, options.rate ?? config.speed));
  const pitch = options.pitch ?? config.pitch;
  const englishAccent = config.accent.startsWith('en') ? config.accent : 'en-US';
  const lang = options.lang || (isUzbekText(text) ? 'auto' : englishAccent);
  const finish = (failed = false) => {
    if (id !== playbackId) return;
    if (audioUrl) { URL.revokeObjectURL(audioUrl); audioUrl = null; }
    currentAudioPlayer = null;
    publish(failed ? 'error' : 'idle');
    if (failed) options.onError?.(); else options.onEnd?.();
  };
  let browserStarted = false;
  const browser = () => {
    if (id !== playbackId) return;
    if (browserStarted) return;
    browserStarted = true;
    if (audioUrl) { URL.revokeObjectURL(audioUrl); audioUrl = null; }
    currentAudioPlayer = null;
    if (!('speechSynthesis' in window)) { finish(true); return; }
    const segments = splitSpeechSegments(text, lang === 'uz-mixed' ? 'uz-mixed' : lang.startsWith('uz') ? 'uz' : lang.startsWith('en') ? 'en' : 'auto');
    const voices = window.speechSynthesis.getVoices();
    const next = (index: number) => {
      if (id !== playbackId) return;
      if (index === segments.length) { finish(); return; }
      const segment = segments[index];
      const locale = segment.lang === 'uz' ? 'uz-UZ' : (lang.startsWith('en') ? lang : englishAccent);
      const compatible = voices.filter(v => v.lang.toLowerCase().startsWith(locale.slice(0,2)));
      const voice = compatible.find(v => v.name === config.preferredVoiceName) || compatible.find(v => v.lang === locale && /Natural|Neural|Google/i.test(v.name)) || compatible.find(v => v.lang === locale) || compatible[0];
      // Never pronounce Uzbek with an unrelated English or Turkish voice.
      if (!voice) { finish(true); return; }
      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.lang = locale; utterance.voice = voice;
      utterance.rate = segment.lang === 'uz' ? (config.uzbekSpeed ?? 0.95) : rate;
      utterance.pitch = segment.lang === 'uz' ? 1 : pitch;
      utterance.onend = () => next(index + 1);
      utterance.onerror = () => finish(true);
      publish('speaking'); window.speechSynthesis.speak(utterance);
    };
    next(0);
  };
  const requestedSegments = splitSpeechSegments(text, lang === 'uz-mixed' ? 'uz-mixed' : lang.startsWith('uz') ? 'uz' : lang.startsWith('en') ? 'en' : 'auto');
  const browserVoices = 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
  const hasBrowserVoices = requestedSegments.every(segment => browserVoices.some(voice => voice.lang.toLowerCase().startsWith(segment.lang)));
  // Use server synthesis when a saved browser preference has no Uzbek voice.
  if ((options.engine || config.engine) === 'browser-natural' && hasBrowserVoices) { browser(); return; }
  controller = new AbortController();
  const signal = controller.signal;
  publish('loading');
  const timeout = setTimeout(() => { if (id === playbackId) controller?.abort(); }, provider === 'local' ? 100000 : 45000);
  void (async () => {
    try {
      const response = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal,
        body: JSON.stringify({ text, lang, provider, accent: englishAccent, gender: config.gender || 'male', rate, uzbekRate: config.uzbekSpeed ?? 1, pitch, voice: options.voice }) });
      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || `Ovoz xizmati xatosi (${response.status}).`);
      }
      const blob = await response.blob();
      if (id !== playbackId) return;
      if (response.headers.get('X-TTS-Fallback')) {
        window.dispatchEvent(new CustomEvent('lingua:speech-notice', {
          detail: 'Gemini vaqtincha ishlamayapti. Microsoft ovozi ishlatilmoqda.',
        }));
      }
      audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl); currentAudioPlayer = audio;
      // Microsoft applies speed during synthesis, keeping natural pitch.
      audio.preservesPitch = true;
      audio.playbackRate = 1;
      audio.onended = () => finish(); audio.onerror = browser;
      await audio.play();
      if (id === playbackId) publish('speaking');
    } catch (error) {
      if (id !== playbackId) return;
      const blocked = error instanceof Error && error.name === 'NotAllowedError';
      const message = blocked ? 'Brauzer ovozni blokladi. Sayt uchun ovozga ruxsat bering.' : error instanceof Error ? error.message : 'Ovoz ijrosida xato yuz berdi.';
      console.warn('Speech playback failed:', message);
      window.dispatchEvent(new CustomEvent('lingua:speech-notice', { detail: message }));
      if (blocked) finish(true); else browser();
    }
    finally { clearTimeout(timeout); }
  })();
}
export function previewVoice(config: VoiceConfig, sampleText = 'Hello! A little practice every day makes a real difference.', callbacks: Pick<SpeakOptions, 'onEnd' | 'onError'> = {}) {
  speakText(sampleText, { config, lang: config.accent, ...callbacks });
}
export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
}
export function playEnglishNative(text: string, onEnd?: () => void) {
  const config = getVoiceConfig();
  speakText(text, { lang: config.accent.startsWith('en') ? config.accent : 'en-US', onEnd, onError: onEnd });
}
export function playBusterSpeech(text: string, onEnd?: () => void, onError?: () => void) {
  const config = getVoiceConfig();
  speakText(text, { voice: 'buster', lang: 'uz-mixed', onEnd, onError,
    config: { ...config, speed: Math.max(1.15, config.speed), uzbekSpeed: Math.max(1.15, config.uzbekSpeed ?? 1) } });
}
