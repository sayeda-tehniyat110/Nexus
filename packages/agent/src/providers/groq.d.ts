import type { LLMProvider, ChatOptions, Message } from './base';
import type { LLMModel } from '@nexus/shared';
export declare class GroqProvider implements LLMProvider {
    private apiKey;
    name: string;
    models: LLMModel[];
    private client;
    constructor(apiKey: string);
    isAvailable(): Promise<boolean>;
    chat(messages: Message[], options?: ChatOptions): AsyncGenerator<string>;
    vision(_image: string, _prompt: string): Promise<string>;
}
//# sourceMappingURL=groq.d.ts.map