import { NextRequest, NextResponse } from 'next/server';
import { callGeminiApi } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { question, transcript, apiKey } = await req.json();

    if (typeof transcript !== 'string' || transcript.trim() === '') {
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
      
      return NextResponse.json({ error: 'AI xizmati hozir ishlamayapti. Natija baholanmadi. Qayta urinib ko‘ring.' }, { status: 503 });
    }
  } catch (error: any) {
    console.error('IELTS API error:', error);
    return NextResponse.json({ error: error.message || 'Server xatosi' }, { status: 500 });
  }
}
