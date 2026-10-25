import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

// In-memory cache to ensure instant playback for repeated questions & sentences
const audioCache = new Map<string, { buffer: Buffer; timestamp: number }>();
const MAX_CACHE_SIZE = 120;

// Helper to detect if text is predominantly Uzbek
function isUzbekText(text: string): boolean {
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

// Select optimal neural voice based on language and preferences (Male voices only)
function resolveVoice(lang: string, voiceParam: string | null, isUzbek: boolean): string {
  if (voiceParam) {
    if (voiceParam === 'buster' || voiceParam === 'uz-sardor' || voiceParam === 'uz-UZ-SardorNeural') {
      return 'uz-UZ-SardorNeural';
    }
    if (voiceParam === 'en-guy' || voiceParam === 'en-US-GuyNeural') return 'en-US-GuyNeural';
    if (voiceParam === 'en-ryan' || voiceParam === 'en-GB-RyanNeural') return 'en-GB-RyanNeural';
    // Default any other request to Sardor for Uzbek, Guy for English
    return isUzbek ? 'uz-UZ-SardorNeural' : 'en-US-GuyNeural';
  }

  if (isUzbek || lang.startsWith('uz')) {
    // Default to SardorNeural (rich natural authoritative male voice for Professor Buster)
    return 'uz-UZ-SardorNeural';
  }

  if (lang.startsWith('en-GB')) {
    return 'en-GB-RyanNeural';
  }

  return 'en-US-GuyNeural';
}

// Prepare and polish Uzbek and English text for crystal-clear neural pronunciation
function normalizeTtsText(raw: string, isUzbek: boolean): string {
  let text = raw
    // Strip mood tags like [MOOD: roasting] or [MOOD: smirking]
    .replace(/\[MOOD:\s*\w+\]/gi, '')
    // Strip markdown formatting
    .replace(/[*_#`~[\]]/g, ' ')
    // Normalize curly quotes and backticks to standard single quote for Uzbek words (o', g')
    .replace(/[\u2018\u2019\u02BB\u02BC\u0060\u00B4]/g, "'")
    // Strip emojis (surrogate pairs and symbols) which cause TTS glitches
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g, '')
    // Replace multiple punctuation marks with a single one
    .replace(/!{2,}/g, '!')
    .replace(/\?{2,}/g, '?')
    .replace(/\.{2,}/g, '.')
    // Clean excessive spaces
    .replace(/\s+/g, ' ')
    .trim();

  // Natural pause formatting for Uzbek humorous interjections
  if (isUzbek) {
    text = text
      .replace(/\b(Voybooo|Hahaha|Aha|Qoyil|Iya|Tavba)\s*!/gi, '$1,')
      .replace(/\b(dedingmi|ayt-chi|qani)\s*!/gi, '$1?');
  }

  return text.slice(0, 950);
}

// Helper to determine if a string segment is a substantial English phrase/sentence (>= 2 words)
function isEnglishPhrase(str: string): boolean {
  const clean = str.trim();
  if (!clean || clean.length < 3) return false;

  // Uzbek markers
  const uzbekPattern = /[oOgG]['’‘`]|(emas|bilan|haqida|uchun|dedingmi|topding|bo'ladi|ekan|qaychi|gap|so'z|ayt|ko'r|kerak|yaxshi|xato|to'g'ri|dars|maktab|abituriyent|tavba|voybooo|hahaha|emish|qo'shil|turmush)/i;
  if (uzbekPattern.test(clean)) return false;

  const words = clean.split(/\s+/).filter(Boolean);
  // Only switch to English voice for full sentences or phrases of 2 or more words
  // Single words (like 'to', 'with', 'meet', 'is', 'for') are pronounced naturally by Sardor Neural in flow
  if (words.length < 2) return false;

  const englishWords = /\b(i|am|you|he|she|it|we|they|agree|married|with|to|call|this|in|english|feel|good|myself|turn|switch|on|off|light|congratulate|birthday|hair|cut|had|have|normal|bad|look|forward|meeting|meet|explained|explain|rule|me|for|at|the|a|an|is|are|was|were|do|does|did|not|can|could|would|should|how|what|why|when|where|open|close|make|start|stop|as|usually|norm|seen|been|nice|pretty|fine|so|very|that|which|who)\b/i;
  return englishWords.test(clean);
}

// Check if entire text is purely English
function isPureEnglishText(text: string): boolean {
  const clean = text.trim();
  if (!clean) return false;
  const uzbekWords = /\b(salom|men|sen|siz|biz|u|ular|uchun|bilan|emas|haqida|savol|xato|to['’‘`]?g['’‘`]?ri|bo['’‘`]?ladi|qanday|nima|qani|ko['’‘`]?r|ayt|gapir|o['’‘`]?zbek|lekin|agar|juda|kerak|dedingmi|voybooo|hahaha|qovurilding|ustoz|tuzoq|dars|kitob|javob|bilasanmi|aytganingdek|shunday|mayli|rahmat|yaxshi|yo['’‘`]?q|qoyil|hayratdaman|bilarkansan|o['’‘`]?rgandingmi|shafqat|aqlingni|ishlat)\b/i;
  if (uzbekWords.test(clean)) return false;
  if (/[oOgG]['’‘`]/.test(clean)) return false;

  return isEnglishPhrase(clean);
}

// Parse mixed text into bilingual segments: [{ text, lang: 'uz' | 'en' }]
function parseBilingualSegments(rawText: string): { text: string; lang: 'uz' | 'en' }[] {
  const text = rawText.trim();
  if (!text) return [];

  // 1. If text is pure English
  if (isPureEnglishText(text)) {
    return [{ text, lang: 'en' }];
  }

  const segments: { text: string; lang: 'uz' | 'en' }[] = [];
  // Match quoted strings where quotes are bounded by whitespace/punctuation (avoiding internal apostrophes like o'zbek, fe'l)
  const quoteRegex = /(?:^|[\s([{\.,:;!?])(['"“‘`])([A-Za-z0-9\s,\.!\?\-\/]+?)(['"”’`])(?=$|[\s)\]}\.,:;!?])/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = quoteRegex.exec(text)) !== null) {
    const matchedFull = match[0];
    const leadingChar = matchedFull.charAt(0);
    const hasLead = /[\s([{\.,:;!?]/.test(leadingChar);
    const contentStartIndex = match.index + (hasLead ? 1 : 0);
    const quoteContent = match[2].trim();

    if (contentStartIndex > lastIndex) {
      const beforeText = text.slice(lastIndex, contentStartIndex).trim();
      if (beforeText) {
        segments.push({ text: beforeText, lang: 'uz' });
      }
    }

    if (isEnglishPhrase(quoteContent)) {
      segments.push({ text: quoteContent, lang: 'en' });
    } else {
      segments.push({ text: quoteContent, lang: 'uz' });
    }

    lastIndex = match.index + matchedFull.length;
  }

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex).trim();
    if (remaining) {
      segments.push({ text: remaining, lang: 'uz' });
    }
  }

  if (segments.length === 0) {
    segments.push({ text, lang: isPureEnglishText(text) ? 'en' : 'uz' });
  }

  // Merge consecutive segments of the same language
  const merged: { text: string; lang: 'uz' | 'en' }[] = [];
  for (const seg of segments) {
    if (!seg.text) continue;
    if (merged.length > 0 && merged[merged.length - 1].lang === seg.lang) {
      merged[merged.length - 1].text += ' ' + seg.text;
    } else {
      merged.push({ ...seg });
    }
  }

  // If there are still more than 3 segments, keep whole text in Sardor Neural to avoid excessive network overhead
  if (merged.length > 3) {
    return [{ text, lang: 'uz' }];
  }

  return merged;
}

// Synthesize a single chunk with specific voice and prosody
async function synthesizeChunk(
  tts: MsEdgeTTS,
  voice: string,
  chunkText: string
): Promise<Buffer> {
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const prosodyOptions = voice.startsWith('uz-')
    ? { rate: '-2%', pitch: '+0Hz' }
    : { rate: 'default', pitch: '+0Hz' };

  return new Promise<Buffer>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('TTS generation timed out'));
    }, 10000);

    try {
      const { audioStream } = tts.toStream(chunkText, prosodyOptions);
      const chunks: Buffer[] = [];

      audioStream.on('data', (c: Buffer) => chunks.push(c));
      audioStream.on('end', () => {
        clearTimeout(timeout);
        resolve(Buffer.concat(chunks));
      });
      audioStream.on('error', (err: any) => {
        clearTimeout(timeout);
        reject(err);
      });
    } catch (streamErr) {
      clearTimeout(timeout);
      reject(streamErr);
    }
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const text = searchParams.get('text');
    const rawLang = searchParams.get('lang') || '';
    const voiceParam = searchParams.get('voice');

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Matn kiritilmadi' }, { status: 400 });
    }

    const isBuster = voiceParam === 'buster' || voiceParam === 'uz-UZ-SardorNeural' || voiceParam === 'uz-sardor';
    const isUzbek = isBuster || rawLang.startsWith('uz') || isUzbekText(text);
    const cleanText = normalizeTtsText(text, isUzbek);

    if (!cleanText) {
      return NextResponse.json({ error: 'Tozalangan matn bo‘sh' }, { status: 400 });
    }

    // Determine segments for bilingual Buster or general speech
    let segments: { text: string; lang: 'uz' | 'en' }[] = [];
    if (isBuster || isUzbek) {
      segments = parseBilingualSegments(cleanText);
    } else {
      segments = [{ text: cleanText, lang: 'en' }];
    }

    const hasEnglishSegment = segments.some((s) => s.lang === 'en');
    const effectiveVoice = isBuster || isUzbek
      ? hasEnglishSegment
        ? 'buster-bilingual'
        : 'uz-UZ-SardorNeural'
      : resolveVoice(rawLang, voiceParam, false);

    // Cache key incorporates voice and text
    const cacheKey = `${effectiveVoice}::${cleanText}`;
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      return new NextResponse(new Uint8Array(cached.buffer), {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'X-TTS-Source': 'cache',
          'X-TTS-Voice': effectiveVoice,
        },
      });
    }

    // Attempt 1: High-Fidelity Microsoft Neural TTS with bilingual switching for English phrases
    const tts = new MsEdgeTTS();
    const buffers: Buffer[] = [];

    for (const seg of segments) {
      const segVoice = seg.lang === 'en'
        ? 'en-US-GuyNeural'
        : (isUzbek ? 'uz-UZ-SardorNeural' : effectiveVoice);

      let buf: Buffer | null = null;
      try {
        buf = await synthesizeChunk(tts, segVoice, seg.text);
      } catch (firstErr) {
        console.warn(`Attempt 1 failed for "${seg.text.slice(0, 30)}", retrying once...`, firstErr);
        try {
          buf = await synthesizeChunk(tts, segVoice, seg.text);
        } catch (retryErr) {
          console.warn(`Attempt 2 failed for "${seg.text.slice(0, 30)}":`, retryErr);
        }
      }

      if (buf && buf.length > 0) {
        buffers.push(buf);
      }
    }

    const audioBuffer = buffers.length > 0 ? Buffer.concat(buffers) : null;

    if (audioBuffer && audioBuffer.length > 0) {
      // Save to cache
      if (audioCache.size >= MAX_CACHE_SIZE) {
        const firstKey = audioCache.keys().next().value;
        if (firstKey) audioCache.delete(firstKey);
      }
      audioCache.set(cacheKey, { buffer: audioBuffer, timestamp: Date.now() });

      return new NextResponse(new Uint8Array(audioBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'X-TTS-Voice': effectiveVoice,
          'X-TTS-Source': 'edge-neural',
        },
      });
    }

    // For Professor Buster or Uzbek, do not return female Turkish fallback audio
    if (isBuster || isUzbek) {
      return NextResponse.json(
        { error: 'Professor Buster ovozini generatsiya qilishda xatolik yuz berdi' },
        { status: 502 }
      );
    }

    // Attempt 2: Fallback to Google TTS (for English only)
    const fallbackLang = rawLang || 'en-US';
    const shortChunk = cleanText.slice(0, 180);
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(
      fallbackLang
    )}&client=tw-ob&q=${encodeURIComponent(shortChunk)}`;

    const response = await fetch(googleTtsUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'X-TTS-Source': 'fallback',
        },
      });
    }

    return NextResponse.json({ error: 'TTS audio olish imkoni bo‘lmadi' }, { status: 502 });
  } catch (err: any) {
    console.error('TTS API internal error:', err);
    return NextResponse.json({ error: 'TTS server xatosi' }, { status: 500 });
  }
}
