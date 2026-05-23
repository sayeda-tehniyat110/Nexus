import OpenAI from 'openai';
export class OpenAIProvider {
    apiKey;
    baseUrl;
    name = 'openai';
    models = [
        { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', maxTokens: 128000, supportsVision: true },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', maxTokens: 128000, supportsVision: true },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', maxTokens: 16384, supportsVision: false },
    ];
    client = null;
    constructor(apiKey, baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.client = new OpenAI({ apiKey, baseURL: baseUrl });
    }
    async isAvailable() {
        try {
            await this.client.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: 'ping' }],
                max_tokens: 10,
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async *chat(messages, options) {
        const model = options?.model || 'gpt-4o';
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
    async vision(image, prompt) {
        const response = await this.client.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        { type: 'image_url', image_url: { url: `data:image/png;base64,${image}` } },
                    ],
                },
            ],
            max_tokens: 4096,
        });
        return response.choices[0]?.message?.content || '';
    }
}
//# sourceMappingURL=openai.js.map