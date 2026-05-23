export type LLMProvider = 'claude' | 'openai' | 'gemini' | 'groq' | 'ollama' | 'custom';

export type LLMModel = {
  id: string;
  name: string;
  provider: LLMProvider;
  maxTokens?: number;
  supportsVision?: boolean;
};

export type MessageRole = 'user' | 'assistant' | 'system';

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  images?: string[];
};

export type ActionType =
  | 'mouse_move'
  | 'mouse_click'
  | 'mouse_scroll'
  | 'keyboard_type'
  | 'keyboard_press'
  | 'file_read'
  | 'file_write'
  | 'file_delete'
  | 'file_move'
  | 'app_launch'
  | 'app_close'
  | 'screenshot'
  | 'browser_navigate'
  | 'browser_click'
  | 'browser_fill'
  | 'terminal_command';

export type Action = {
  id: string;
  type: ActionType;
  description: string;
  params: Record<string, unknown>;
  status: 'pending' | 'approved' | 'executing' | 'completed' | 'failed' | 'cancelled';
  timestamp: number;
  result?: unknown;
  error?: string;
};

export type Task = {
  id: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'failed';
  actions: Action[];
  createdAt: number;
  completedAt?: number;
};

export type SafetyMode = 'safe' | 'auto' | 'restricted';

export type ProviderConfig = {
  claude?: { apiKey: string; baseUrl?: string };
  openai?: { apiKey: string; baseUrl?: string };
  gemini?: { apiKey: string };
  groq?: { apiKey: string };
  ollama?: { baseUrl: string };
  custom?: { apiKey: string; baseUrl: string; models: string[] };
};

export type AppSettings = {
  activeProvider: LLMProvider;
  activeModel: string;
  safetyMode: SafetyMode;
  providers: ProviderConfig;
  theme: 'dark' | 'light' | 'system';
  autoApproveActions: boolean;
  humanLikeDelay: boolean;
  blocklist: string[];
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  tasks: Task[];
  createdAt: number;
  updatedAt: number;
};
