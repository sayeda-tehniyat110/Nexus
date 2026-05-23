import type { LLMProvider, ChatOptions, Message } from './base';
import type { LLMModel } from '@nexus/shared';
export declare class OpenAIProvider implements LLMProvider {
    private apiKey;
    private baseUrl?;
    name: string;
    models: LLMModel[];
    private client;
    constructor(apiKey: string, baseUrl?: string | undefined);
    isAvailable(): Promise<boolean>;
    chat(messages: Message[], options?: ChatOptions): AsyncGenerator<string>;
    vision(image: string, prompt: string): Promise<string>;
}
//# sourceMappingURL=openai.d.ts.map