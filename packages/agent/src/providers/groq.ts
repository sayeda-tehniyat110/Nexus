import OpenAI from 'openai';
import type { LLMProvider, ChatOptions, Message } from './base';
import type { LLMModel } from '@nexus/shared';

export class GroqProvider implements LLMProvider {
  name = 'groq';
  models: LLMModel[] = [
    { id: 'llama3-70b', name: 'Llama 3 70B', provider: 'groq', maxTokens: 8192, supportsVision: false },
    { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', provider: 'groq', maxTokens: 32768, supportsVision: false },
  ];

  private client: OpenAI | null = null;

  constructor(private apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client!.chat.completions.create({
        model: 'llama3-70b',
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 10,
      });
      return true;
    } catch {
      return false;
    }
  }

  async *chat(messages: Message[], options?: ChatOptions): AsyncGenerator<string> {
    const model = options?.model || 'llama3-70b';
    const maxTokens = options?.maxTokens || 4096;

    const stream = await this.client!.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages: messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }

  async vision(_image: string, _prompt: string): Promise<string> {
    throw new Error('Groq does not support vision');
  }
}
