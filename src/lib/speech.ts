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

// Voice Configuration Interface
export interface VoiceConfig {
  engine: 'hd-studio' | 'browser-natural';
  accent: 'uz-UZ' | 'en-US' | 'en-GB' | 'en-AU';
  preferredVoiceName?: string;
  speed: number;
  pitch: number;
}

// Helper to detect if a sentence or text is predominantly Uzbek
export function isUzbekText(text: string): boolean {
  const lower = text.toLowerCase();
  const uzbekPatterns = [
    /\b(salom|men|sen|siz|biz|u|ular|uchun|bilan|emas|haqida|savol|xato|to['’‘`]?g['’‘`]?ri|bo['’‘`]?ladi|qanday|nima|qani|ko['’‘`]?r|ayt|gapir|ingliz|o['’‘`]?zbek|lekin|agar|juda|kerak|dedingmi|voybooo|hahaha|qovurilding|ustoz|tuzoq|dars|kitob|javob|bilasanmi|aytganingdek|shunday|mayli|rahmat|yaxshi|yo['’‘`]?q|qoyil|hayratdaman|bilarkansan|o['’‘`]?rgandingmi|shafqat|aqlingni|ishlat)\b/i,
    /[oOgG]['’‘`]/,
    /\b(emasman|emasmi|ekan|ekansan|bo'lsa|bo'lgan|qilmoq|qiladi|beradi|oladi|ber-chi|top-chi|tushuntir)\b/i,
  ];

  for (const pattern of uzbekPatterns) {
    if (pattern.test(lower)) return true;
  }
  return false;
}

const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  engine: 'hd-studio',
  accent: 'en-US',
  preferredVoiceName: '',
  speed: 0.95,
  pitch: 1.0,
};

// Global audio player instance for HD Studio TTS
let currentAudioPlayer: HTMLAudioElement | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Initialize voice listener
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function getVoiceConfig(): VoiceConfig {
  if (typeof window === 'undefined') return DEFAULT_VOICE_CONFIG;
  const saved = localStorage.getItem('lingua_voice_config');
  if (saved) {
    try {
      return { ...DEFAULT_VOICE_CONFIG, ...JSON.parse(saved) };
    } catch {}
  }
  return DEFAULT_VOICE_CONFIG;
}

export function saveVoiceConfig(config: VoiceConfig) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lingua_voice_config', JSON.stringify(config));
}

// Get clean list of available natural browser voices
export function getAvailableBrowserVoices(): { name: string; lang: string; isNatural: boolean }[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices();
  const englishVoices = voices.filter((v) => v.lang.startsWith('en'));

  // Sort natural/neural voices first
  return englishVoices
    .map((v) => ({
      name: v.name,
      lang: v.lang,
      isNatural:
        v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Neural') ||
        v.name.includes('Online') ||
        v.name.includes('Samantha') ||
        v.name.includes('Daniel') ||
        v.name.includes('Jenny') ||
        v.name.includes('Guy') ||
        v.name.includes('Aria'),
    }))
    .sort((a, b) => (b.isNatural ? 1 : 0) - (a.isNatural ? 1 : 0));
}

// Pick the best natural speech synthesis voice (Prioritize male voices)
function findBestVoice(accent: string, preferredVoiceName?: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Explicit user choice
  if (preferredVoiceName) {
    const exact = voices.find((v) => v.name === preferredVoiceName);
    if (exact) return exact;
  }

  // 2. High-priority neural / natural MALE voices for the chosen accent
  const maleVoices = voices.filter(
    (v) =>
      v.lang.startsWith(accent) &&
      (v.name.includes('Guy') ||
        v.name.includes('Ryan') ||
        v.name.includes('David') ||
        v.name.includes('Mark') ||
        v.name.includes('George') ||
        v.name.includes('Daniel') ||
        v.name.includes('Sardor'))
  );
  if (maleVoices.length > 0) return maleVoices[0];

  // 3. Any other voice matching accent excluding known female voices
  const nonFemaleVoice = voices.find(
    (v) =>
      v.lang.startsWith(accent) &&
      !v.name.includes('Jenny') &&
      !v.name.includes('Aria') &&
      !v.name.includes('Zira') &&
      !v.name.includes('Samantha') &&
      !v.name.includes('Madina')
  );
  if (nonFemaleVoice) return nonFemaleVoice;

  // 4. Any voice matching accent
  const accentVoice = voices.find((v) => v.lang.startsWith(accent));
  if (accentVoice) return accentVoice;

  // 5. Any English voice
  return voices.find((v) => v.lang.startsWith('en')) || null;
}

// Central Speech Playback Function
export function speakText(
  text: string,
  options: {
    lang?: string;
    rate?: number;
    pitch?: number;
    engine?: 'hd-studio' | 'browser-natural';
    onEnd?: () => void;
    onError?: () => void;
  } = {}
) {
  if (typeof window === 'undefined') return;

  // Stop any previous speech
  stopSpeaking();

  // Clean text: strip markdown characters
  const cleanText = text
    .replace(/[*_#`~[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleanText) return;

  const config = getVoiceConfig();
  const selectedEngine = options.engine || config.engine;
  const isUzbek = options.lang?.startsWith('uz') || isUzbekText(cleanText);
  const selectedLang = options.lang || (isUzbek ? 'uz-UZ' : (config.accent || 'en-US'));
  const selectedRate = options.rate ?? config.speed ?? 0.95;
  const selectedPitch = options.pitch ?? config.pitch ?? 1.0;

  // ============================================
  // ENGINE 1: HD STUDIO VOICE (Neural Cloud Audio)
  // ============================================
  if (selectedEngine === 'hd-studio') {
    // Send full clean text (up to 850 characters)
    const textChunk = cleanText.slice(0, 850);
    // Use local proxy /api/tts with detected language
    const ttsUrl = `/api/tts?text=${encodeURIComponent(textChunk)}&lang=${encodeURIComponent(selectedLang)}`;

    const audio = new Audio();
    currentAudioPlayer = audio;
    audio.playbackRate = Math.max(0.6, Math.min(1.5, selectedRate));

    let fallbackTriggered = false;
    const triggerBrowserFallback = () => {
      if (fallbackTriggered) return;
      fallbackTriggered = true;
      speakWithBrowserSynthesis(cleanText, selectedLang, selectedRate, selectedPitch, config.preferredVoiceName, options.onEnd, options.onError);
    };

    audio.onended = () => {
      currentAudioPlayer = null;
      options.onEnd?.();
    };

    audio.onerror = () => {
      currentAudioPlayer = null;
      triggerBrowserFallback();
    };

    audio.src = ttsUrl;
    audio.play().catch(() => {
      // If direct audio autoplay or network fails, fallback to natural browser voice
      triggerBrowserFallback();
    });

    return;
  }

  // ============================================
  // ENGINE 2: NATURAL BROWSER SYNTHESIS
  // ============================================
  speakWithBrowserSynthesis(
    cleanText,
    selectedLang,
    selectedRate,
    selectedPitch,
    config.preferredVoiceName,
    options.onEnd,
    options.onError
  );
}

// Fallback / Direct Browser Speech Synthesis
function speakWithBrowserSynthesis(
  text: string,
  lang: string,
  rate: number,
  pitch: number,
  preferredVoiceName?: string,
  onEnd?: () => void,
  onError?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  utterance.pitch = pitch;

  const bestVoice = findBestVoice(lang, preferredVoiceName);
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn('SpeechSynthesis error:', e);
    onError?.();
  };

  window.speechSynthesis.speak(utterance);
}

// Stop all playback immediately
export function stopSpeaking() {
  if (typeof window === 'undefined') return;

  if (currentAudioPlayer) {
    try {
      currentAudioPlayer.pause();
      currentAudioPlayer.currentTime = 0;
    } catch {}
    currentAudioPlayer = null;
  }

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

// Preview Voice
export function previewVoice(config: VoiceConfig, sampleText: string = 'Hello! Welcome to LinguaPulse AI. Practice speaking fluently every day.') {
  speakText(sampleText, {
    engine: config.engine,
    lang: config.accent,
    rate: config.speed,
    pitch: config.pitch,
  });
}

// Speech recognition helper
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

// Dedicated function to play pure native English audio (US/UK) with studio clarity
export function playEnglishNative(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined') return;
  stopSpeaking();
  const clean = text.replace(/[*_#`~[\]]/g, '').trim().slice(0, 800);
  if (!clean) return;

  const config = getVoiceConfig();
  const voiceName = config.accent === 'en-GB' ? 'en-GB-RyanNeural' : 'en-US-GuyNeural';
  const ttsUrl = `/api/tts?text=${encodeURIComponent(clean)}&voice=${encodeURIComponent(voiceName)}`;

  const audio = new Audio(ttsUrl);
  currentAudioPlayer = audio;
  audio.onended = () => {
    currentAudioPlayer = null;
    onEnd?.();
  };
  audio.onerror = () => {
    currentAudioPlayer = null;
    onEnd?.();
  };
  audio.play().catch(() => {
    currentAudioPlayer = null;
    onEnd?.();
  });
}

// Dedicated function to play Professor Buster's unified male voice (uz-UZ-SardorNeural)
// Guarantees a single consistent masculine persona, pristine Uzbek articulation, and zero random female/browser fallbacks
export function playBusterSpeech(
  text: string,
  onEnd?: () => void,
  onError?: () => void
) {
  if (typeof window === 'undefined') return;
  stopSpeaking();

  const clean = text
    .replace(/\[MOOD:\s*\w+\]/gi, '')
    .replace(/[*_#`~[\]]/g, ' ')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g, '')
    .trim()
    .slice(0, 950);

  if (!clean) {
    onEnd?.();
    return;
  }

  // Force voice=buster to guarantee single male Uzbek voice (Sardor Neural)
  const ttsUrl = `/api/tts?text=${encodeURIComponent(clean)}&voice=buster`;

  const audio = new Audio(ttsUrl);
  currentAudioPlayer = audio;
  audio.playbackRate = 1.0;

  audio.onended = () => {
    currentAudioPlayer = null;
    onEnd?.();
  };

  audio.onerror = (e) => {
    console.warn('Buster audio load error:', e);
    currentAudioPlayer = null;
    onError?.();
    // Do not fall back to browser synthesis English voice to prevent jarring voice switches
  };

  audio.play().catch((err) => {
    console.warn('Buster audio playback failed (e.g. autoplay block):', err);
    currentAudioPlayer = null;
    onError?.();
  });
}

