import { MessageSquare, Plus, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
  const [conversations] = useState([
    { id: '1', title: 'File organization', updatedAt: Date.now() },
    { id: '2', title: 'Code review', updatedAt: Date.now() - 3600000 },
    { id: '3', title: 'Email automation', updatedAt: Date.now() - 7200000 },
  ]);

  if (!open) return null;

  return (
    <div className="w-64 border-r border-border flex flex-col bg-card">
      <div className="p-3">
        <button className="w-full flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-1">
          {conversations.map(conv => (
            <button
              key={conv.id}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
            >
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm truncate flex-1">{conv.title}</span>
              <button className="opacity-0 hover:opacity-100 p-1 hover:bg-destructive rounded transition-all">
                <Trash2 className="w-3 h-3" />
              </button>
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 border-t border-border">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent transition-colors">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
}
