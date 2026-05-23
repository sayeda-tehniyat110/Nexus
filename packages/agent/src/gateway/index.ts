import type { LLMProvider, ChatOptions, Message } from '../providers/base';
import { ClaudeProvider } from '../providers/claude';
import { OpenAIProvider } from '../providers/openai';
import { GeminiProvider } from '../providers/gemini';
import { GroqProvider } from '../providers/groq';
import { OllamaProvider } from '../providers/ollama';
import type { LLMModel, ProviderConfig } from '@nexus/shared';

export class LLMGateway {
  private providers: Map<string, LLMProvider> = new Map();
  private activeProvider: string = 'claude';

  constructor(config: ProviderConfig) {
    if (config.claude?.apiKey) {
      this.providers.set('claude', new ClaudeProvider(config.claude.apiKey));
    }
    if (config.openai?.apiKey) {
      this.providers.set('openai', new OpenAIProvider(config.openai.apiKey, config.openai.baseUrl));
    }
    if (config.gemini?.apiKey) {
      this.providers.set('gemini', new GeminiProvider(config.gemini.apiKey));
    }
    if (config.groq?.apiKey) {
      this.providers.set('groq', new GroqProvider(config.groq.apiKey));
    }
    if (config.ollama?.baseUrl) {
      this.providers.set('ollama', new OllamaProvider(config.ollama.baseUrl));
    }
  }

  setActiveProvider(provider: string): void {
    if (!this.providers.has(provider)) {
      throw new Error(`Provider ${provider} not configured`);
    }
    this.activeProvider = provider;
  }

  getActiveProvider(): LLMProvider {
    const provider = this.providers.get(this.activeProvider);
    if (!provider) throw new Error('No active provider');
    return provider;
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  getModels(provider?: string): LLMModel[] {
    const p = provider ? this.providers.get(provider) : this.getActiveProvider();
    return p?.models || [];
  }

  async *chat(messages: Message[], options?: ChatOptions): AsyncGenerator<string> {
    const provider = this.getActiveProvider();
    yield* provider.chat(messages, options);
  }

  async vision(image: string, prompt: string): Promise<string> {
    const provider = this.getActiveProvider();
    return provider.vision(image, prompt);
  }

  async checkAvailability(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    for (const [name, provider] of this.providers) {
      results[name] = await provider.isAvailable();
    }
    return results;
  }
}
