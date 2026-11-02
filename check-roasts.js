const fs = require('fs');
const content = fs.readFileSync('src/components/SarcasticCoach.tsx', 'utf8');

// Helper to determine if a string segment is English
function isEnglishChunk(str) {
  const clean = str.trim().toLowerCase();
  if (!clean || clean.length < 2) return false;
  const uzbekPattern = /[oOgG]['’‘`]|(emas|bilan|haqida|uchun|dedingmi|topding|bo'ladi|ekan|qaychi|gap|so'z|ayt|ko'r|kerak|yaxshi|xato|to'g'ri|dars|maktab|abituriyent|tavba|voybooo|hahaha|emish|qo'shil|turmush)/i;
  if (uzbekPattern.test(clean)) return false;
  const englishWords = /\b(i|am|you|he|she|it|we|they|agree|married|with|to|call|this|in|english|feel|good|myself|turn|switch|on|off|light|congratulate|birthday|hair|cut|had|have|normal|bad|look|forward|meeting|meet|explained|explain|rule|me|for|at|the|a|an|is|are|was|were|do|does|did|not|can|could|would|should|how|what|why|when|where|open|close|make|start|stop|as|usually|norm|seen|been|nice|pretty|fine|so|very|that|which|who)\b/i;
  return englishWords.test(clean);
}

function isPureEnglishText(text) {
  const clean = text.trim();
  if (!clean) return false;
  const uzbekWords = /\b(salom|men|sen|siz|biz|u|ular|uchun|bilan|emas|haqida|savol|xato|to['’‘`]?g['’‘`]?ri|bo['’‘`]?ladi|qanday|nima|qani|ko['’‘`]?r|ayt|gapir|o['’‘`]?zbek|lekin|agar|juda|kerak|dedingmi|voybooo|hahaha|qovurilding|ustoz|tuzoq|dars|kitob|javob|bilasanmi|aytganingdek|shunday|mayli|rahmat|yaxshi|yo['’‘`]?q|qoyil|hayratdaman|bilarkansan|o['’‘`]?rgandingmi|shafqat|aqlingni|ishlat)\b/i;
  if (uzbekWords.test(clean)) return false;
  if (/[oOgG]['’‘`]/.test(clean)) return false;
  return isEnglishChunk(clean);
}

function normalizeTtsText(raw, isUzbek) {
  let text = raw
    .replace(/\[MOOD:\s*\w+\]/gi, '')
    .replace(/[*_#`~[\]]/g, ' ')
    .replace(/[\u2018\u2019\u02BB\u02BC\u0060\u00B4]/g, "'")
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g, '')
    .replace(/!{2,}/g, '!')
    .replace(/\?{2,}/g, '?')
    .replace(/\.{2,}/g, '.')
    .replace(/\s+/g, ' ')
    .trim();
  if (isUzbek) {
    text = text
      .replace(/\b(Voybooo|Hahaha|Aha|Qoyil|Iya|Tavba)\s*!/gi, '$1,')
      .replace(/\b(dedingmi|ayt-chi|qani)\s*!/gi, '$1?');
  }
  return text.slice(0, 950);
}

function parseBilingualSegments(rawText) {
  const text = rawText.trim();
  if (!text) return [];
  if (isPureEnglishText(text)) return [{ text, lang: 'en' }];
  const segments = [];
  const quoteRegex = /(?:^|[\s([{\.,:;!?])(['"“‘`])([A-Za-z0-9\s,\.!\?\-\/]+?)(['"”’`])(?=$|[\s)\]}\.,:;!?])/g;
  let lastIndex = 0;
  let match;
  while ((match = quoteRegex.exec(text)) !== null) {
    const matchedFull = match[0];
    const leadingChar = matchedFull.charAt(0);
    const hasLead = /[\s([{\.,:;!?]/.test(leadingChar);
    const contentStartIndex = match.index + (hasLead ? 1 : 0);
    const quoteContent = match[2].trim();
    if (contentStartIndex > lastIndex) {
      const beforeText = text.slice(lastIndex, contentStartIndex).trim();
      if (beforeText) segments.push({ text: beforeText, lang: 'uz' });
    }
    if (isEnglishChunk(quoteContent)) {
      segments.push({ text: quoteContent, lang: 'en' });
    } else {
      segments.push({ text: quoteContent, lang: 'uz' });
    }
    lastIndex = match.index + matchedFull.length;
  }
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex).trim();
    if (remaining) segments.push({ text: remaining, lang: 'uz' });
  }
  if (segments.length === 0) segments.push({ text, lang: isPureEnglishText(text) ? 'en' : 'uz' });
  const merged = [];
  for (const seg of segments) {
    if (!seg.text) continue;
    if (merged.length > 0 && merged[merged.length - 1].lang === seg.lang) {
      merged[merged.length - 1].text += ' ' + seg.text;
    } else {
      merged.push({ ...seg });
    }
  }
  return merged;
}

const roasts = [...content.matchAll(/roastWrong:\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Found roasts:', roasts.length);
roasts.forEach((r, i) => {
  const norm = normalizeTtsText(r, true);
  const segs = parseBilingualSegments(norm);
  const hasEn = segs.some(s => s.lang === 'en');
  console.log(`Roast #${i+1}: segs=${segs.length}, hasEn=${hasEn}`);
  segs.forEach(s => {
    if (s.lang === 'en') console.log(`   [EN] "${s.text}"`);
    else console.log(`   [UZ] "${s.text.slice(0, 40)}..."`);
  });
});
