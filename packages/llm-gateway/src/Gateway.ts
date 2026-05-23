import { ClaudeProvider } from './providers/ClaudeProvider';
import { OpenAIProvider } from './providers/OpenAIProvider';
import type { LLMProvider, ProviderConfig } from './types';
import type { Message, Tool } from 'nexus-shared';

export class LLMGateway {
  private providers: Map<string, LLMProvider> = new Map();
  private activeProvider: LLMProvider | null = null;

  constructor() {
    this.registerProvider(new ClaudeProvider());
    this.registerProvider(new OpenAIProvider());
  }

  registerProvider(provider: LLMProvider): void {
    this.providers.set(provider.name, provider);
  }

  setActiveProvider(providerName: string, config?: ProviderConfig): void {
    const provider = this.providers.get(providerName);
    if (provider) {
      if (config) {
        if (providerName === 'Claude') {
          this.providers.set(providerName, new ClaudeProvider(config));
        } else if (providerName === 'OpenAI') {
          this.providers.set(providerName, new OpenAIProvider(config));
        }
      }
      this.activeProvider = this.providers.get(providerName) || null;
    }
  }

  getActiveProvider(): LLMProvider | null {
    return this.activeProvider;
  }

  getProviders(): LLMProvider[] {
    return Array.from(this.providers.values());
  }

  async *chat(messages: Message[], tools?: Tool[]): AsyncGenerator<string> {
    if (!this.activeProvider) {
      throw new Error('No active provider set');
    }

    yield* this.activeProvider.chat(messages, tools);
  }

  async vision(image: string, prompt: string): Promise<string> {
    if (!this.activeProvider) {
      throw new Error('No active provider set');
    }

    return this.activeProvider.vision(image, prompt);
  }
}
