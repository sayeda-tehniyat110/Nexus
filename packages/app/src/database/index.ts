import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import type { Conversation, Message, Task, Action, AppSettings } from '@nexus/shared';

export class NexusDatabase {
  private db: Database.Database;

  constructor() {
    const dbPath = path.join(app.getPath('userData'), 'nexus.db');
    this.db = new Database(dbPath);
    this.initSchema();
  }

  private initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        images TEXT,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        completed_at INTEGER,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS actions (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        params TEXT NOT NULL,
        status TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        result TEXT,
        error TEXT,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_conversation ON tasks(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_actions_task ON actions(task_id);
    `);
  }

  createConversation(id: string, title: string): void {
    const now = Date.now();
    this.db.prepare(
      'INSERT INTO conversations (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)'
    ).run(id, title, now, now);
  }

  getConversation(id: string): Conversation | null {
    const row = this.db.prepare('SELECT * FROM conversations WHERE id = ?').get(id) as any;
    if (!row) return null;

    const messages = this.getMessages(id);
    const tasks = this.getTasks(id);

    return {
      id: row.id,
      title: row.title,
      messages,
      tasks,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  getAllConversations(): Conversation[] {
    const rows = this.db.prepare('SELECT * FROM conversations ORDER BY updated_at DESC').all() as any[];
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      messages: [],
      tasks: [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  updateConversationTitle(id: string, title: string): void {
    this.db.prepare(
      'UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?'
    ).run(title, Date.now(), id);
  }

  deleteConversation(id: string): void {
    this.db.prepare('DELETE FROM conversations WHERE id = ?').run(id);
  }

  addMessage(message: Message, conversationId: string): void {
    this.db.prepare(
      'INSERT INTO messages (id, conversation_id, role, content, timestamp, images) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(
      message.id,
      conversationId,
      message.role,
      message.content,
      message.timestamp,
      message.images ? JSON.stringify(message.images) : null
    );
    this.updateConversationTimestamp(conversationId);
  }

  getMessages(conversationId: string): Message[] {
    const rows = this.db.prepare(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC'
    ).all(conversationId) as any[];
    return rows.map(row => ({
      id: row.id,
      role: row.role,
      content: row.content,
      timestamp: row.timestamp,
      images: row.images ? JSON.parse(row.images) : undefined,
    }));
  }

  createTask(task: Task, conversationId: string): void {
    this.db.prepare(
      'INSERT INTO tasks (id, conversation_id, description, status, created_at, completed_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(
      task.id,
      conversationId,
      task.description,
      task.status,
      task.createdAt,
      task.completedAt || null
    );
  }

  getTasks(conversationId: string): Task[] {
    const rows = this.db.prepare(
      'SELECT * FROM tasks WHERE conversation_id = ? ORDER BY created_at DESC'
    ).all(conversationId) as any[];
    return rows.map(row => ({
      id: row.id,
      description: row.description,
      status: row.status,
      actions: this.getActions(row.id),
      createdAt: row.created_at,
      completedAt: row.completed_at,
    }));
  }

  updateTaskStatus(id: string, status: Task['status']): void {
    this.db.prepare(
      'UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?'
    ).run(status, status === 'completed' ? Date.now() : null, id);
  }

  addAction(action: Action, taskId: string): void {
    this.db.prepare(
      'INSERT INTO actions (id, task_id, type, description, params, status, timestamp, result, error) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(
      action.id,
      taskId,
      action.type,
      action.description,
      JSON.stringify(action.params),
      action.status,
      action.timestamp,
      action.result ? JSON.stringify(action.result) : null,
      action.error || null
    );
  }

  getActions(taskId: string): Action[] {
    const rows = this.db.prepare(
      'SELECT * FROM actions WHERE task_id = ? ORDER BY timestamp ASC'
    ).all(taskId) as any[];
    return rows.map(row => ({
      id: row.id,
      type: row.type,
      description: row.description,
      params: JSON.parse(row.params),
      status: row.status,
      timestamp: row.timestamp,
      result: row.result ? JSON.parse(row.result) : undefined,
      error: row.error,
    }));
  }

  updateActionStatus(id: string, status: Action['status'], result?: unknown, error?: string): void {
    this.db.prepare(
      'UPDATE actions SET status = ?, result = ?, error = ? WHERE id = ?'
    ).run(status, result ? JSON.stringify(result) : null, error || null, id);
  }

  setSetting(key: string, value: string): void {
    this.db.prepare(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
    ).run(key, value);
  }

  getSetting(key: string): string | null {
    const row = this.db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as any;
    return row?.value || null;
  }

  getSettings(): Partial<AppSettings> {
    const rows = this.db.prepare('SELECT * FROM settings').all() as any[];
    const settings: Partial<AppSettings> = {};
    for (const row of rows) {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch {
        settings[row.key] = row.value;
      }
    }
    return settings;
  }

  private updateConversationTimestamp(id: string): void {
    this.db.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?').run(Date.now(), id);
  }

  close(): void {
    this.db.close();
  }
}
