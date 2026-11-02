export type SpeechLanguage = 'uz' | 'en';
export type SpeechMode = SpeechLanguage | 'auto' | 'uz-mixed';
export type SpeechSegment = { text: string; lang: SpeechLanguage };

export const NEURAL_VOICES = {
  'uz-UZ': { male: 'uz-UZ-SardorNeural', female: 'uz-UZ-MadinaNeural' },
  'en-US': { male: 'en-US-GuyNeural', female: 'en-US-JennyNeural' },
  'en-GB': { male: 'en-GB-RyanNeural', female: 'en-GB-SoniaNeural' },
  'en-AU': { male: 'en-AU-WilliamNeural', female: 'en-AU-NatashaNeural' },
} as const;

export function normalizeSpeechText(text: string): string {
  return text.normalize('NFC')
    .replace(/\[MOOD:\s*\w+\]/gi, '')
    .split('---FEEDBACK---')[0]
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/(?<=\p{L})[‘’ʻʼ`´](?=\p{L})/gu, "'")
    .replace(/[*_#~`]/g, '')
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '')
    .replace(/!{2,}/g, '!').replace(/\?{2,}/g, '?')
    .replace(/\s+/g, ' ').trim();
}

export function isUzbekText(text: string): boolean {
  return /\b(?:o['ʻ‘’ʼ`](?:z|q|r|l|t|n|y|s)|g['ʻ‘’ʼ`](?:a|i|o|u)|to['ʻ‘’ʼ`]g|bo['ʻ‘’ʼ`]l|ko['ʻ‘’ʼ`]r|so['ʻ‘’ʼ`]z)|\b(salom|men|sen|siz|biz|ular|uchun|bilan|emas|haqida|savol|xato|qanday|nima|qani|ayt|ingliz|lekin|agar|juda|kerak|ustoz|dars|kitob|javob|shunday|mayli|rahmat|yaxshi|qoyil|bugun|birga|talaffuz|tinglang|demak|endi|mumkin|qiladi|qiling|bilaman|tushunarli|mashq|gap|bu|bor|ham|shu)\b/i.test(text);
}

// Quotations mark English examples inside Uzbek explanations. Apostrophes
// inside o‘zbek, I'm, don't and learner's are never treated as delimiters.
export function splitSpeechSegments(raw: string, language: SpeechMode = 'auto'): SpeechSegment[] {
  const text = normalizeSpeechText(raw);
  const pieces: SpeechSegment[] = [];
  const push = (text: string, lang: SpeechLanguage) => {
    const previous = pieces[pieces.length - 1];
    if (previous?.lang === lang && previous.text.length + text.length < 420) previous.text += ' ' + text;
    else pieces.push({ text, lang });
  };
  const baseLanguage: SpeechLanguage = language === 'uz' || language === 'uz-mixed'
    ? 'uz' : language === 'en' ? 'en' : (isUzbekText(text) ? 'uz' : 'en');
  const append = (value: string, forced?: SpeechLanguage) => {
    const sentences = value.match(/[^.!?]+[.!?]*\s*|[.!?]+/g) || [];
    for (const sentence of sentences) {
      const clean = sentence.trim();
      if (!clean) continue;
      const english = /\b(i|you|he|she|it|we|they|the|a|an|am|is|are|was|were|have|has|will|would|could|should|hello|every|your|this|that|what|how|take|don't|can't)\b/i.test(clean);
      const lang = forced || (isUzbekText(clean) ? 'uz' : english ? 'en' : baseLanguage);
      const words = clean.split(/\s+/);
      let chunk = '';
      for (const word of words) {
        if (chunk.length + word.length > 420 && chunk) {
          push(chunk, lang); chunk = '';
        }
        chunk += (chunk ? ' ' : '') + word;
      }
      if (chunk) push(chunk, lang);
    }
  };
  // A user-selected Uzbek mode must never depend on a small word dictionary.
  // Keep complete sentences, including quotations and proper names, in Uzbek.
  if (language === 'uz' || language === 'en') { append(text, language); return pieces; }
  const explanationLanguage = language === 'uz-mixed' ? 'uz' : undefined;
  const quoted = /["“]([^"”]+)["”]|(?:^|(?<=\s|[:(]))'([^']+(?:'[a-z]+[^']*)*)'(?=$|[\s.,!?;)])/g;
  let offset = 0;
  for (const match of text.matchAll(quoted)) {
    append(text.slice(offset, match.index), explanationLanguage);
    const example = match[1] || match[2];
    append(example, isUzbekText(example) ? 'uz' : 'en');
    offset = match.index! + match[0].length;
  }
  append(text.slice(offset), explanationLanguage);
  return pieces;
}

export function escapeSpeechXml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
