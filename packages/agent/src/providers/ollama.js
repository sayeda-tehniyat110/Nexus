import OpenAI from 'openai';
export class OllamaProvider {
    baseUrl;
    name = 'ollama';
    models = [];
    client = null;
    constructor(baseUrl = 'http://localhost:11434') {
        this.baseUrl = baseUrl;
        this.client = new OpenAI({
            baseURL: `${baseUrl}/v1`,
            apiKey: 'ollama',
        });
    }
    async isAvailable() {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`);
            if (!response.ok)
                return false;
            const data = await response.json();
            this.models = data.models.map((m) => ({
                id: m.name,
                name: m.name,
                provider: 'ollama',
                maxTokens: 8192,
                supportsVision: false,
            }));
            return true;
        }
        catch {
            return false;
        }
    }
    async *chat(messages, options) {
        const model = options?.model || this.models[0]?.id || 'llama3';
        const maxTokens = options?.maxTokens || 4096;
        const stream = await this.client.chat.completions.create({
            model,
            max_tokens: maxTokens,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            stream: true,
        });
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content)
                yield content;
        }
    }
    async vision(_image, _prompt) {
        throw new Error('Ollama vision not yet implemented');
    }
}
//# sourceMappingURL=ollama.js.map