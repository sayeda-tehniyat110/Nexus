import type { LLMProvider, ChatOptions, Message } from '../providers/base';
import type { LLMModel, ProviderConfig } from '@nexus/shared';
export declare class LLMGateway {
    private providers;
    private activeProvider;
    constructor(config: ProviderConfig);
    setActiveProvider(provider: string): void;
    getActiveProvider(): LLMProvider;
    getAvailableProviders(): string[];
    getModels(provider?: string): LLMModel[];
    chat(messages: Message[], options?: ChatOptions): AsyncGenerator<string>;
    vision(image: string, prompt: string): Promise<string>;
    checkAvailability(): Promise<Record<string, boolean>>;
}
//# sourceMappingURL=index.d.ts.map