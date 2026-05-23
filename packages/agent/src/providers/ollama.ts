import OpenAI from 'openai';
import type { LLMProvider, ChatOptions, Message } from './base';
import type { LLMModel } from '@nexus/shared';

export class OllamaProvider implements LLMProvider {
  name = 'ollama';
  models: LLMModel[] = [];

  private client: OpenAI | null = null;

  constructor(private baseUrl: string = 'http://localhost:11434') {
    this.client = new OpenAI({
      baseURL: `${baseUrl}/v1`,
      apiKey: 'ollama',
    });
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return false;
      const data = await response.json();
      this.models = data.models.map((m: any) => ({
        id: m.name,
        name: m.name,
        provider: 'ollama' as const,
        maxTokens: 8192,
        supportsVision: false,
      }));
      return true;
    } catch {
      return false;
    }
  }

  async *chat(messages: Message[], options?: ChatOptions): AsyncGenerator<string> {
    const model = options?.model || this.models[0]?.id || 'llama3';
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
    throw new Error('Ollama vision not yet implemented');
  }
}
