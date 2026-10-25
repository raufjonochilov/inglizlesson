import { NextRequest, NextResponse } from 'next/server';
import { callGeminiApi } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { question, transcript, apiKey } = await req.json();

    if (!transcript || transcript.trim() === '') {
      return NextResponse.json({ error: 'Javob matni topilmadi' }, { status: 400 });
    }

    const systemPrompt = `
You are an experienced, certified British Council IELTS Speaking Examiner.
Evaluate the user's spoken answer to the given IELTS question based on the 4 official assessment criteria:
1. Fluency & Coherence (FC)
2. Lexical Resource (LR)
3. Grammatical Range & Accuracy (GRA)
4. Pronunciation & Delivery (PR)

Return a STRICT, VALID JSON object with this exact format:
{
  "overallBand": 6.5,
  "scores": {
    "fluency": 6.5,
    "lexical": 6.0,
    "grammar": 6.5,
    "pronunciation": 7.0
  },
  "summaryUz": "O'zbek tilida umumiy baho va tahlil",
  "strengths": ["Strong points in bullet points"],
  "weaknesses": ["Areas that need improvement"],
  "highBandPhrases": ["3-4 C1-C2 level collocations or idioms to use for this specific question"]
}
`;

    const userContent = `IELTS Question: "${question}"\nCandidate's Spoken Answer: "${transcript}"`;

    try {
      const rawText = await callGeminiApi(systemPrompt, [{ role: 'user', content: userContent }], apiKey);
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return NextResponse.json(parsed);
    } catch (apiError: any) {
      console.warn('IELTS assessment fallback:', apiError.message);
      
      const wordCount = transcript.trim().split(/\s+/).length;
      const calculatedScore = wordCount > 40 ? 6.5 : wordCount > 20 ? 5.5 : 4.5;

      return NextResponse.json({
        overallBand: calculatedScore,
        scores: {
          fluency: calculatedScore,
          lexical: calculatedScore,
          grammar: calculatedScore,
          pronunciation: calculatedScore + 0.5 > 9 ? 9 : calculatedScore + 0.5,
        },
        summaryUz: "Javobingiz yaxshi tushunarli bo'ldi. Band balini 7.0+ ga ko'tarish uchun murakkab bog'lovchilar (furthermore, nevertheless, consequently) va turli grammatik zamonlardan ko'proq foydalanish tavsiya etiladi.",
        strengths: ["Fikrni to'g'ridan-to'g'ri bayon etish", "Mavzuga mos so'zlar tanlovi"],
        weaknesses: ["Fikrlar orasidagi mantiqiy bog'lovchilar kamligi", "So'z boyligini kengaytirish zarurligi"],
        highBandPhrases: [
          "Without a shadow of a doubt",
          "Play a pivotal role in...",
          "From my personal standpoint",
          "A double-edged sword"
        ],
        isFallback: true,
      });
    }
  } catch (error: any) {
    console.error('IELTS API error:', error);
    return NextResponse.json({ error: error.message || 'Server xatosi' }, { status: 500 });
  }
}
