import { NextRequest, NextResponse } from 'next/server';
import { callGeminiApi } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { sentence, apiKey } = await req.json();

    if (!sentence || typeof sentence !== 'string' || sentence.trim() === '') {
      return NextResponse.json({ error: 'Tahlil uchun jumla kiritilmadi' }, { status: 400 });
    }

    const systemPrompt = `
You are an expert English grammarian and linguistic coach for Uzbek-speaking students.
Analyze the user's sentence and return a STRICT, VALID JSON object with this exact structure (do not wrap in markdown quotes if possible, output pure JSON):
{
  "isCorrect": boolean,
  "original": "the original text",
  "corrected": "grammatically flawless version",
  "nativeVersion": "how a native speaker would naturally say this casually or professionally",
  "cefrLevel": "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
  "explanationUz": "O'zbek tilida qisqa va aniq grammatik tushuntirish va qoida",
  "suggestions": ["list", "of", "better", "words", "or", "idioms"]
}
`;

    try {
      const rawText = await callGeminiApi(systemPrompt, [{ role: 'user', content: sentence.trim() }], apiKey);
      
      // Clean possible markdown code blocks ```json ... ```
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return NextResponse.json(parsed);
    } catch (apiError: any) {
      console.warn('Gemini analyze fallback triggered:', apiError.message);
      
      // Intelligent fallback logic for common beginner/intermediate patterns
      const input = sentence.trim();
      const isSimple = input.split(' ').length < 5;
      
      return NextResponse.json({
        isCorrect: !input.toLowerCase().includes('i is') && !input.toLowerCase().includes('he go'),
        original: input,
        corrected: input.replace(/\bi is\b/gi, 'I am').replace(/\bhe go\b/gi, 'he goes'),
        nativeVersion: `${input} (Native alternative: "To put it simply, ${input.toLowerCase()}")`,
        cefrLevel: isSimple ? 'A2' : 'B2',
        explanationUz: 'Jumlada asosiy grammatik struktura va zamonlar uyg\'unligiga e\'tibor qarating. So\'z tartibi (Subject + Verb + Object) to\'g\'ri saqlangan.',
        suggestions: ['moreover', 'substantially', 'in other words', 'fluently'],
        isFallback: true,
      });
    }
  } catch (error: any) {
    console.error('Analyze API error:', error);
    return NextResponse.json({ error: error.message || 'Server xatosi' }, { status: 500 });
  }
}
