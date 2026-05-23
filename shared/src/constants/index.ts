export const DEFAULT_MODELS = {
  claude: [
    { id: 'claude-opus-4', name: 'Claude Opus 4', provider: 'claude', maxTokens: 200000, supportsVision: true },
    { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'claude', maxTokens: 200000, supportsVision: true },
    { id: 'claude-haiku-4', name: 'Claude Haiku 4', provider: 'claude', maxTokens: 200000, supportsVision: true },
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', maxTokens: 128000, supportsVision: true },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', maxTokens: 128000, supportsVision: true },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', maxTokens: 16384, supportsVision: false },
  ],
  gemini: [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'gemini', maxTokens: 1000000, supportsVision: true },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'gemini', maxTokens: 1000000, supportsVision: true },
  ],
  groq: [
    { id: 'llama3-70b', name: 'Llama 3 70B', provider: 'groq', maxTokens: 8192, supportsVision: false },
    { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', provider: 'groq', maxTokens: 32768, supportsVision: false },
  ],
  ollama: [
    { id: 'llama3', name: 'Llama 3', provider: 'ollama', maxTokens: 8192, supportsVision: false },
    { id: 'mistral', name: 'Mistral', provider: 'ollama', maxTokens: 8192, supportsVision: false },
  ],
  custom: [],
} as const;

export const DEFAULT_SETTINGS = {
  activeProvider: 'claude' as const,
  activeModel: 'claude-sonnet-4',
  safetyMode: 'safe' as const,
  providers: {},
  theme: 'system' as const,
  autoApproveActions: false,
  humanLikeDelay: true,
  blocklist: [],
} as const;

export const EMERGENCY_STOP_KEY = 'Ctrl+Shift+Esc';

export const HUMAN_LIKE_DELAY = { min: 30, max: 80 };
