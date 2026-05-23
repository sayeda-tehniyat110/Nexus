import type { LLMProvider, ProviderConfig } from './types';
import type { Message, Tool } from 'nexus-shared';
export declare class LLMGateway {
    private providers;
    private activeProvider;
    constructor();
    registerProvider(provider: LLMProvider): void;
    setActiveProvider(providerName: string, config?: ProviderConfig): void;
    getActiveProvider(): LLMProvider | null;
    getProviders(): LLMProvider[];
    chat(messages: Message[], tools?: Tool[]): AsyncGenerator<string>;
    vision(image: string, prompt: string): Promise<string>;
}
//# sourceMappingURL=Gateway.d.ts.map