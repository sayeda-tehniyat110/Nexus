import type { Conversation, Message, Task, Action, AppSettings } from '@nexus/shared';
export declare class NexusDatabase {
    private db;
    constructor();
    private initSchema;
    createConversation(id: string, title: string): void;
    getConversation(id: string): Conversation | null;
    getAllConversations(): Conversation[];
    updateConversationTitle(id: string, title: string): void;
    deleteConversation(id: string): void;
    addMessage(message: Message, conversationId: string): void;
    getMessages(conversationId: string): Message[];
    createTask(task: Task, conversationId: string): void;
    getTasks(conversationId: string): Task[];
    updateTaskStatus(id: string, status: Task['status']): void;
    addAction(action: Action, taskId: string): void;
    getActions(taskId: string): Action[];
    updateActionStatus(id: string, status: Action['status'], result?: unknown, error?: string): void;
    setSetting(key: string, value: string): void;
    getSetting(key: string): string | null;
    getSettings(): Partial<AppSettings>;
    private updateConversationTimestamp;
    close(): void;
}
//# sourceMappingURL=index.d.ts.map