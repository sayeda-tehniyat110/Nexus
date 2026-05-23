import type { LLMProvider, ProviderConfig } from '../types';
import type { Message, Tool } from 'nexus-shared';
export declare class OpenAIProvider implements LLMProvider {
    name: string;
    models: string[];
    private client;
    private config;
    constructor(config?: ProviderConfig);
    chat(messages: Message[], tools?: Tool[]): AsyncGenerator<string>;
    vision(image: string, prompt: string): Promise<string>;
    isAvailable(): boolean;
}
//# sourceMappingURL=OpenAIProvider.d.ts.map