import './index.css';
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Settings, Plus, Send, StopCircle, Image as ImageIcon, Mic } from 'lucide-react';

// Components Imports
import Calendar from "./components/Calendar";
import VideoCallSection from './components/VideoCallSection';
import DocumentChamber from './components/DocumentChamber';
import ChatMessage from './components/ChatMessage';
import { ActionCard } from './components/ActionCard';
import Sidebar from './components/Sidebar';
import ModelSelector from './components/ModelSelector';

// Types Definition
type Message = { id: string; role: 'user' | 'assistant'; content: string; timestamp: number; };
type Action = { id: string; type: string; description: string; params: any; status: string; timestamp: number; };
type LLMModel = { id: string; name: string; provider: string; maxTokens: number; supportsVision: boolean; };

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAction, setPendingAction] = useState<Action | null>(null);
  const [activeModel, setActiveModel] = useState<LLMModel>({
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    provider: 'claude',
    maxTokens: 200000,
    supportsVision: true,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [actionPanelOpen, setActionPanelOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, pendingAction]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I understand your request. Let me help you with that.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Simulate pending action
      setPendingAction({
        id: (Date.now() + 2).toString(),
        type: 'mouse_click',
        description: 'Click on the "Open" button in the file dialog',
        params: { x: 500, y: 300 },
        status: 'pending',
        timestamp: Date.now(),
      });
    }, 1000);
  };

  const handleApproveAction = () => {
    if (pendingAction) {
      setPendingAction({ ...pendingAction, status: 'completed' });
      setTimeout(() => setPendingAction(null), 2000);
    }
  };

  const handleCancelAction = () => {
    setPendingAction(null);
  };

  return (
    <div className="flex h-screen text-foreground bg-slate-950 overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-slate-900/50 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <h1 className="font-semibold tracking-wider text-blue-400">NEXUS</h1>
          </div>
          <ModelSelector activeModel={activeModel} onModelChange={setActiveModel} />
          <button 
            onClick={() => setActionPanelOpen(!actionPanelOpen)} 
            className={`p-2 rounded-md transition-colors ${actionPanelOpen ? 'text-blue-400 bg-accent' : 'hover:bg-accent'}`}
            title="Toggle Week 2 Panel"
          >
            <Settings className="w-5 h-5" />
          </button>
        </header>

        {/* Dynamic Inner Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Chat System Area */}
          <div className="flex-1 flex flex-col border-r border-border bg-slate-900/20">
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MessageSquare className="w-16 h-16 mb-4 opacity-50 text-blue-500" />
                  <p className="text-lg mb-2 text-white">Start a conversation</p>
                  <p className="text-sm">Ask me to help you with any task on your computer</p>
                </div>
              )}
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-muted-foreground my-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm">Thinking...</span>
                </div>
              )}
              {pendingAction && (
                <ActionCard
                  action={pendingAction}
                  onApprove={handleApproveAction}
                  onReject={handleCancelAction}
                />
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar Section */}
            <div className="border-t border-border p-4 bg-slate-900/40">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-accent rounded-md transition-colors"><Plus className="w-5 h-5" /></button>
                <button className="p-2 hover:bg-accent rounded-md transition-colors"><ImageIcon className="w-5 h-5" /></button>
                <button className="p-2 hover:bg-accent rounded-md transition-colors"><Mic className="w-5 h-5" /></button>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-slate-950 border border-border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                {isTyping ? (
                  <button className="p-2 hover:bg-accent rounded-md transition-colors text-destructive">
                    <StopCircle className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="p-2 hover:bg-accent rounded-md transition-colors disabled:opacity-50 text-blue-400"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side Panel: Week 2 Features Integration */}
          {actionPanelOpen && (
            <div className="w-[450px] border-l border-border p-4 overflow-y-auto bg-slate-900/60 space-y-6 chunk-panel">
              <div>
                <h3 className="font-bold text-lg text-white mb-2 tracking-wide border-b border-border pb-2">
                  🗓️ Action Queue & Calendar
                </h3>
                <Calendar />
              </div>
              
              {/* Milestone 3: Video Calling Workspace */}
              <div className="pt-2">
                <VideoCallSection />
              </div>
              
              {/* Milestone 4: Document Control Workspace */}
              <div className="pt-2 text-slate-900">
                <DocumentChamber />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}