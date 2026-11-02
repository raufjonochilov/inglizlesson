import { normalizeSpeechText } from '@/lib/voice-text';

export interface GeminiSpeechOptions {
  text: string;
  lang: string;
  accent: string;
  gender: 'male' | 'female';
  rate: number;
  uzbekRate: number;
}

export interface GeminiSpeechAudio { buffer: Buffer; voice: string; }
const cache = new Map<string, GeminiSpeechAudio>();
const pending = new Map<string, Promise<GeminiSpeechAudio>>();
const MAX_CACHE_BYTES = 32 * 1024 * 1024;
let cacheBytes = 0;
let retryAfter = 0;

export async function synthesizeGeminiSpeech(options: GeminiSpeechOptions): Promise<GeminiSpeechAudio> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini ovozi uchun serverda GEMINI_API_KEY sozlanmagan.');
  const voice = options.gender === 'female' ? 'Kore' : 'Charon';
  const englishAccent = options.accent === 'en-GB' ? 'British English'
    : options.accent === 'en-AU' ? 'Australian English' : 'American English';
  const languageStyle = options.lang === 'uz-mixed'
    ? `Speak Uzbek explanations in natural standard Uzbek as a native speaker from Uzbekistan. Read quoted English examples in native ${englishAccent}. Keep the same speaker identity across languages.`
    : options.lang.startsWith('uz')
    ? 'Speak the complete text in natural standard Uzbek as a native Uzbek speaker from Uzbekistan. Use Uzbek pronunciation for vowels, q, x, h, o‘ and g‘. Avoid Russian, Turkish or English pronunciation of Uzbek words.'
    : options.lang.startsWith('en')
    ? `Speak in natural native ${englishAccent}.`
    : `Use native standard Uzbek pronunciation for Uzbek text and native ${englishAccent} for English text. Keep the same speaker identity.`;
  const style = `${languageStyle} Fluent, conversational teacher delivery; natural pitch, short sentence pauses, no drawn-out syllables or dramatic pauses. Uzbek pacing: ${options.uzbekRate} times normal speed. English pacing: ${options.rate} times normal speed. Read the transcript exactly, without introductions or added words.`;
  const text = normalizeSpeechText(options.text);
  const model = 'gemini-3.8-flash-tts';
  const key = JSON.stringify({ model, voice, text, style });
  const cached = cache.get(key);
  if (cached) return cached;
  const existing = pending.get(key);
  if (existing) return existing;
  // Cached voices remain usable even while the provider is rate-limited.
  if (Date.now() < retryAfter) throw new Error('Gemini so‘rov limiti: birozdan keyin qayta uriniladi.');
  const request = (async () => {
    const signal = AbortSignal.timeout(25000);
    const requestOptions = {
      method: 'POST', signal,
      headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        input: [{ type: 'user_input', content: [{ type: 'text', text,
          annotations: [{ type: 'speech_metadata', style }] }] }],
        response_format: { type: 'audio', mime_type: 'audio/wav' },
        generation_config: { speech_config: [{ voice }] },
      }),
    };
    let response!: Response;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', requestOptions);
      if (![408, 429, 500, 502, 503, 504].includes(response.status)) break;
      const header = response.headers.get('Retry-After');
      const seconds = header === null ? NaN : Number(header);
      const suggestedWait = Number.isFinite(seconds) ? seconds * 1000
        : header ? Date.parse(header) - Date.now() : NaN;
      const delay = Math.max(1000 * 2 ** attempt, Number.isFinite(suggestedWait) ? suggestedWait : 0);
      if (attempt === 2 || delay > 3000) {
        retryAfter = Date.now() + Math.max(30000, Number.isFinite(suggestedWait) ? suggestedWait : 0);
        break;
      }
      await response.body?.cancel();
      await new Promise(resolve => setTimeout(resolve, delay));
      signal.throwIfAborted();
    }
    if (!response.ok) throw new Error(`Gemini ovoz xizmati xatosi (${response.status}).`);
    retryAfter = 0;
    const data = await response.json();
    const outputs = (data.steps || []).filter((step: { type?: string }) => step.type === 'model_output');
    const blocks = outputs.flatMap((step: { content?: { type?: string; data?: string }[] }) => step.content || []);
    const audio = blocks.filter((block: { type?: string; data?: string }) => block.type === 'audio' && typeof block.data === 'string').at(-1);
    if (!audio) throw new Error('Gemini audio qaytarmadi.');
    const buffer = Buffer.from(audio.data, 'base64');
    if (buffer.length <= 44 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') {
      throw new Error('Gemini audio formati noto‘g‘ri.');
    }
    const result = { buffer, voice };
    if (buffer.length <= MAX_CACHE_BYTES) {
      while (cacheBytes + buffer.length > MAX_CACHE_BYTES || cache.size >= 40) {
        const oldest = cache.keys().next().value;
        if (!oldest) break;
        cacheBytes -= cache.get(oldest)!.buffer.length;
        cache.delete(oldest);
      }
      cache.set(key, result);
      cacheBytes += buffer.length;
    }
    return result;
  })();
  pending.set(key, request);
  try { return await request; }
  finally { pending.delete(key); }
}
