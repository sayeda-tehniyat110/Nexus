import type { Message, LLMModel } from '@nexus/shared';
export interface LLMProvider {
    name: string;
    models: LLMModel[];
    isAvailable(): Promise<boolean>;
    chat(messages: Message[], options?: ChatOptions): AsyncGenerator<string>;
    vision(image: string, prompt: string): Promise<string>;
}
export interface ChatOptions {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    tools?: Tool[];
}
export interface Tool {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
}
//# sourceMappingURL=base.d.ts.map