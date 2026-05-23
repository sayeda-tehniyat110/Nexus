import type { LLMProvider, ChatOptions, Message } from './base';
import type { LLMModel } from '@nexus/shared';
export declare class OllamaProvider implements LLMProvider {
    private baseUrl;
    name: string;
    models: LLMModel[];
    private client;
    constructor(baseUrl?: string);
    isAvailable(): Promise<boolean>;
    chat(messages: Message[], options?: ChatOptions): AsyncGenerator<string>;
    vision(_image: string, _prompt: string): Promise<string>;
}
//# sourceMappingURL=ollama.d.ts.map