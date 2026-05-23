import { ClaudeProvider } from './providers/ClaudeProvider';
import { OpenAIProvider } from './providers/OpenAIProvider';
export class LLMGateway {
    providers = new Map();
    activeProvider = null;
    constructor() {
        this.registerProvider(new ClaudeProvider());
        this.registerProvider(new OpenAIProvider());
    }
    registerProvider(provider) {
        this.providers.set(provider.name, provider);
    }
    setActiveProvider(providerName, config) {
        const provider = this.providers.get(providerName);
        if (provider) {
            if (config) {
                if (providerName === 'Claude') {
                    this.providers.set(providerName, new ClaudeProvider(config));
                }
                else if (providerName === 'OpenAI') {
                    this.providers.set(providerName, new OpenAIProvider(config));
                }
            }
            this.activeProvider = this.providers.get(providerName) || null;
        }
    }
    getActiveProvider() {
        return this.activeProvider;
    }
    getProviders() {
        return Array.from(this.providers.values());
    }
    async *chat(messages, tools) {
        if (!this.activeProvider) {
            throw new Error('No active provider set');
        }
        yield* this.activeProvider.chat(messages, tools);
    }
    async vision(image, prompt) {
        if (!this.activeProvider) {
            throw new Error('No active provider set');
        }
        return this.activeProvider.vision(image, prompt);
    }
}
//# sourceMappingURL=Gateway.js.map