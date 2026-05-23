import OpenAI from 'openai';
import type { LLMProvider, ProviderConfig } from '../types';
import type { Message, Tool } from 'nexus-shared';

export class OpenAIProvider implements LLMProvider {
  name = 'OpenAI';
  models = ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'];

  private client: OpenAI;
  private config: ProviderConfig;

  constructor(config: ProviderConfig = {}) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey || process.env.OPENAI_API_KEY || '',
      baseURL: config.baseUrl,
    });
  }

  async *chat(messages: Message[], tools?: Tool[]): AsyncGenerator<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.config.model || 'gpt-4o',
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  async vision(image: string, prompt: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.config.model || 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${image}`,
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI vision error:', error);
      throw error;
    }
  }

  isAvailable(): boolean {
    return !!this.config.apiKey || !!process.env.OPENAI_API_KEY;
  }
}
