import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { NEURAL_VOICES, splitSpeechSegments, escapeSpeechXml } from '@/lib/voice-text';
import { synthesizeGeminiSpeech } from '@/lib/gemini-speech';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const cache = new Map<string, Buffer>();
const pending = new Map<string, Promise<Buffer>>();
const MAX_TEXT_LENGTH = 5000;

async function synthesize(text: string, voice: string, rate: number, pitch: number): Promise<Buffer> {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  if (key && region) {
    if (!/^[a-z0-9]+$/.test(region)) throw new Error('Invalid Azure Speech region');
    const locale = voice.split('-').slice(0, 2).join('-');
    const response = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST', signal: AbortSignal.timeout(15000),
      headers: { 'Ocp-Apim-Subscription-Key': key, 'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3', 'User-Agent': 'LinguaPulseAI' },
      body: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${locale}"><voice name="${voice}"><prosody rate="${Math.round((rate - 1) * 100)}%" pitch="${Math.round((pitch - 1) * 20)}Hz">${escapeSpeechXml(text)}</prosody></voice></speak>`,
    });
    if (!response.ok) throw new Error(`Azure Speech ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length) throw new Error('Empty Azure audio');
    return buffer;
  }
  const tts = new MsEdgeTTS({ connectionTimeoutMs: 7000, synthesisTimeoutMs: 12000 });
  try {
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    return await new Promise<Buffer>((resolve, reject) => {
      const timer = setTimeout(() => { reject(new Error('Speech timed out')); tts.close(); }, 15000);
      const { audioStream } = tts.toStream(escapeSpeechXml(text), {
        rate: (rate >= 1 ? '+' : '') + Math.round((rate - 1) * 100) + '%',
        pitch: (pitch >= 1 ? '+' : '') + Math.round((pitch - 1) * 20) + 'Hz',
      });
      const chunks: Buffer[] = [];
      audioStream.on('data', (chunk: Buffer) => chunks.push(chunk));
      audioStream.once('end', () => { clearTimeout(timer); const data = Buffer.concat(chunks); data.length ? resolve(data) : reject(new Error('Empty audio')); });
      audioStream.once('error', error => { clearTimeout(timer); reject(error); });
    });
  } finally { tts.close(); }
}

async function handleSpeech(params: Record<string, unknown>) {
  const { text } = params;
  if (typeof text !== 'string' || !text.trim()) return NextResponse.json({ error: 'Matn kiriting.' }, { status: 400 });
  if (text.length > MAX_TEXT_LENGTH) return NextResponse.json({ error: 'Matn 5000 belgidan oshmasin.' }, { status: 413 });
  const buster = ['buster', 'uz-sardor', 'uz-UZ-SardorNeural'].includes(String(params.voice));
  const explicitVoice = Object.values(NEURAL_VOICES).flatMap(v => Object.values(v)).find(v => v === params.voice);
  const accent = String(params.accent || (String(params.lang).startsWith('en') ? params.lang : 'en-US'));
  const englishAccent = accent in NEURAL_VOICES && accent !== 'uz-UZ' ? accent as keyof typeof NEURAL_VOICES : 'en-US';
  const gender = params.gender === 'female' && !buster ? 'female' : 'male';
  const rate = Math.min(1.3, Math.max(0.7, Number(params.rate) || 1));
  const uzbekRate = Math.min(1.15, Math.max(0.8, Number(params.uzbekRate) || 0.95));
  const pitch = Math.min(1.3, Math.max(0.7, Number(params.pitch) || 1));
  let provider = params.provider || 'microsoft';
  if (provider === 'local') {
    // Navoiy specializes in Uzbek; keep native English on its dedicated voice.
    if (String(params.lang).startsWith('en') && !buster) {
      provider = 'microsoft';
    } else {
      try {
        const response = await fetch('http://127.0.0.1:8765/tts', {
          method: 'POST', signal: AbortSignal.timeout(90000),
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, speed: uzbekRate }),
        });
        if (!response.ok) throw new Error(`Local TTS ${response.status}`);
        const buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.length <= 44 || buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') {
          throw new Error('Invalid local audio');
        }
        return new NextResponse(new Uint8Array(buffer), { headers: {
          'Content-Type': 'audio/wav', 'Cache-Control': 'private, max-age=3600',
          'X-TTS-Source': 'navoiy-local', 'X-TTS-Voice': 'Navoiy',
        } });
      } catch {
        return NextResponse.json({ error: 'Mahalliy ovoz xizmati ishlamayapti. Ovoz serverini ishga tushiring.' }, { status: 503 });
      }
    }
  }
  let usedFallback = false;
  if (provider === 'gemini') {
    try {
      const audio = await synthesizeGeminiSpeech({ text, lang: buster ? 'uz-mixed' : String(params.lang || 'auto'),
        accent, gender, rate, uzbekRate });
      return new NextResponse(new Uint8Array(audio.buffer), { headers: {
        'Content-Type': 'audio/wav', 'Cache-Control': 'private, max-age=3600',
        'X-TTS-Source': 'gemini', 'X-TTS-Voice': audio.voice,
      } });
    } catch (error) {
      console.error('Gemini speech unavailable:', error instanceof Error ? error.message : 'Unknown error');
      usedFallback = true;
    }
  }
  if (provider !== 'microsoft' && !usedFallback) return NextResponse.json({ error: 'Noma’lum ovoz bazasi.' }, { status: 400 });
  const lang = buster || params.lang === 'uz-mixed' ? 'uz-mixed'
    : String(params.lang).startsWith('uz') ? 'uz'
    : String(params.lang).startsWith('en') ? 'en' : 'auto';
  const segments = splitSpeechSegments(text, lang);
  if (!segments.length) return NextResponse.json({ error: 'O‘qiladigan matn topilmadi.' }, { status: 400 });
  const plan = segments.map(segment => ({ ...segment,
    rate: segment.lang === 'uz' ? uzbekRate : rate,
    pitch: segment.lang === 'uz' ? 1 : pitch,
    voice: segment.lang === 'uz'
    ? (explicitVoice?.startsWith('uz') ? explicitVoice : NEURAL_VOICES['uz-UZ'][gender])
    : (explicitVoice?.startsWith('en') ? explicitVoice : NEURAL_VOICES[englishAccent][gender]) }));
  const key = JSON.stringify({ plan, rate, pitch });
  try {
    let audio = cache.get(key);
    if (!audio) {
      let request = pending.get(key);
      if (!request) {
        request = (async () => {
          const buffers: Buffer[] = [];
          // Bounded concurrency keeps mixed speech responsive and preserves order.
          for (let index = 0; index < plan.length; index += 3) {
            buffers.push(...await Promise.all(plan.slice(index, index + 3).map(segment => synthesize(segment.text, segment.voice, segment.rate, segment.pitch))));
          }
          const result = Buffer.concat(buffers);
          if (cache.size >= 60) cache.delete(cache.keys().next().value!);
          cache.set(key, result);
          return result;
        })();
        pending.set(key, request);
        request.finally(() => pending.delete(key)).catch(() => {});
      }
      audio = await request;
    }
    return new NextResponse(new Uint8Array(audio), { headers: {
      'Content-Type': 'audio/mpeg', 'Cache-Control': 'private, max-age=3600',
      'X-TTS-Source': 'microsoft-neural', 'X-TTS-Voice': [...new Set(plan.map(s => s.voice))].join(','),
      ...(usedFallback ? { 'X-TTS-Fallback': 'gemini-unavailable' } : {}),
    } });
  } catch (error) {
    console.error('Neural speech unavailable:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Ovoz xizmati bilan bog‘lanib bo‘lmadi. Qayta urinib ko‘ring.' }, { status: 502 });
  }
}
export async function GET(req: NextRequest) { return handleSpeech(Object.fromEntries(new URL(req.url).searchParams)); }
export async function POST(req: NextRequest) {
  try { return await handleSpeech(await req.json()); }
  catch { return NextResponse.json({ error: 'So‘rov formati noto‘g‘ri.' }, { status: 400 }); }
}
