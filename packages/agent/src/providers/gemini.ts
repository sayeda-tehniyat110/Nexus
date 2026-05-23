import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LLMProvider, ChatOptions, Message } from './base';
import type { LLMModel } from '@nexus/shared';

export class GeminiProvider implements LLMProvider {
  name = 'gemini';
  models: LLMModel[] = [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'gemini', maxTokens: 1000000, supportsVision: true },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'gemini', maxTokens: 1000000, supportsVision: true },
  ];

  private client: GoogleGenerativeAI | null = null;

  constructor(private apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async isAvailable(): Promise<boolean> {
    try {
      const model = this.client!.getGenerativeModel({ model: 'gemini-1.5-flash' });
      await model.generateContent('ping');
      return true;
    } catch {
      return false;
    }
  }

  async *chat(messages: Message[], options?: ChatOptions): AsyncGenerator<string> {
    const model = this.client!.getGenerativeModel({ model: options?.model || 'gemini-1.5-pro' });

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    const result = await model.generateContent({
      contents: [...history, { role: 'user', parts: [{ text: lastMessage.content }] }],
      generationConfig: { maxOutputTokens: options?.maxTokens || 4096 },
    });

    yield result.response.text();
  }

  async vision(image: string, prompt: string): Promise<string> {
    const model = this.client!.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: 'image/png', data: image } },
    ]);

    return result.response.text();
  }
}
