// Gemini API Client Helper

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface FeedbackData {
  correctedSentence?: string;
  explanationUz?: string;
  nativeAlternative?: string;
  vocabularyTips?: string[];
  grammarNotes?: string[];
  cefrLevel?: string;
  bandScore?: number;
}

export async function callGeminiApi(
  systemPrompt: string,
  messages: { role: string; content: string }[],
  apiKey?: string
): Promise<string> {
  const key = apiKey || process.env.GEMINI_API_KEY || '';

  if (!key) {
    throw new Error('GEMINI_API_KEY mavjud emas');
  }

  // Format messages for Google Gemini API
  // System instruction is supported in v1beta
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const modelName = 'gemini-3.8-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;

  const payload: any = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    }
  };

  if (systemPrompt) {
    payload.systemInstruction = {
      parts: [{ text: systemPrompt }]
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Javob matni olinmadi');
    }

    return text;
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}
