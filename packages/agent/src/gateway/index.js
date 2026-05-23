import { ClaudeProvider } from '../providers/claude';
import { OpenAIProvider } from '../providers/openai';
import { GeminiProvider } from '../providers/gemini';
import { GroqProvider } from '../providers/groq';
import { OllamaProvider } from '../providers/ollama';
export class LLMGateway {
    providers = new Map();
    activeProvider = 'claude';
    constructor(config) {
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
    setActiveProvider(provider) {
        if (!this.providers.has(provider)) {
            throw new Error(`Provider ${provider} not configured`);
        }
        this.activeProvider = provider;
    }
    getActiveProvider() {
        const provider = this.providers.get(this.activeProvider);
        if (!provider)
            throw new Error('No active provider');
        return provider;
    }
    getAvailableProviders() {
        return Array.from(this.providers.keys());
    }
    getModels(provider) {
        const p = provider ? this.providers.get(provider) : this.getActiveProvider();
        return p?.models || [];
    }
    async *chat(messages, options) {
        const provider = this.getActiveProvider();
        yield* provider.chat(messages, options);
    }
    async vision(image, prompt) {
        const provider = this.getActiveProvider();
        return provider.vision(image, prompt);
    }
    async checkAvailability() {
        const results = {};
        for (const [name, provider] of this.providers) {
            results[name] = await provider.isAvailable();
        }
        return results;
    }
}
//# sourceMappingURL=index.js.map