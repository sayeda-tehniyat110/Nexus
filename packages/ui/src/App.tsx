import './index.css';
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Settings, Plus, Send, StopCircle, Image as ImageIcon, Mic, ShieldCheck } from 'lucide-react';

// Components Imports
import Calendar from "./components/Calendar";
import VideoCallSection from './components/VideoCallSection';
import DocumentChamber from './components/DocumentChamber';
import PaymentChamber from './components/PaymentChamber';
import SecurityControl from './components/SecurityControl';
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
  
  // Milestone 6: Role Based Toggle State ('Investor' vs 'Entrepreneur')
  const [userRole, setUserRole] = useState<'Investor' | 'Entrepreneur'>('Investor');
  
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

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Acknowledged. Processing your request as Nexus ${userRole}. Let me analyze the data setup.`,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen text-white bg-slate-950 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navigation Header */}
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-md transition-colors">
              <MessageSquare className="w-5 h-5 text-slate-400" />
            </button>
            <h1 className="font-bold tracking-wider text-blue-400 flex items-center gap-1.5">
              NEXUS <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full uppercase tracking-normal font-medium">Workspace v3</span>
            </h1>
          </div>
          
          {/* Dynamic Active Role Badge */}
          <div className="text-xs bg-slate-800 border border-slate-700 rounded-full px-3 py-1 flex items-center gap-1.5 font-medium">
            <span className={`w-2 h-2 rounded-full ${userRole === 'Investor' ? 'bg-indigo-400' : 'bg-amber-400'}`} />
            View Mode: {userRole} Panel
          </div>

          <div className="flex items-center gap-2">
            <ModelSelector activeModel={activeModel} onModelChange={setActiveModel} />
            <button 
              onClick={() => setActionPanelOpen(!actionPanelOpen)} 
              className={`p-2 rounded-md transition-colors ${actionPanelOpen ? 'text-blue-400 bg-slate-800' : 'hover:bg-slate-800 text-slate-400'}`}
              title="Toggle Right Control Workspace"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Panel Split */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Chat Interface Layer */}
          <div className="flex-1 flex flex-col border-r border-slate-800 bg-slate-900/10">
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <ShieldCheck className="w-16 h-16 mb-4 opacity-40 text-blue-500" />
                  <p className="text-lg font-medium text-slate-300">Nexus Security Control Verified</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs text-center">Type your transaction commands or switch control panels on the right side queue workspace.</p>
                </div>
              )}
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-slate-500 my-2">
                  <span className="text-xs animate-pulse">Syncing environment keys...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar Layer */}
            <div className="border-t border-slate-800 p-4 bg-slate-900/30">
              <div className="flex gap-2">
                <button className="p-2 text-slate-500 hover:bg-slate-800 rounded-md transition-colors"><Plus className="w-5 h-5" /></button>
                <button className="p-2 text-slate-500 hover:bg-slate-800 rounded-md transition-colors"><ImageIcon className="w-5 h-5" /></button>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={`Command Nexus agent as ${userRole}...`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-white"
                />
                <button onClick={handleSend} disabled={!input.trim()} className="p-2 text-blue-400 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-30">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side Panel: Properly Ordered Modules (Week 1, 2, & 3) */}
          {actionPanelOpen && (
            <div className="w-[480px] border-l border-slate-800 p-4 overflow-y-auto bg-slate-900/40 space-y-6 scrollbar-thin">
              
              {/* 1. WEEK 1 COMPONENT: Calendar Core Module (Sabse Upar) */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
                <h3 className="font-bold text-sm text-slate-300 mb-3 tracking-wide flex items-center gap-1.5">
                  🗓️ Action Queue Calendar
                </h3>
                <Calendar />
              </div>

              {/* 2. WEEK 2 COMPONENT: Video Calling Workspace */}
              <VideoCallSection />

              {/* 3. MILESTONE 6: Access Gate & Role Control (Security) */}
              <SecurityControl currentRole={userRole} onRoleChange={setUserRole} />

              {/* 4. MILESTONE 5: Dynamic Stripe Flow Payments */}
              <PaymentChamber role={userRole} />

              {/* 5. WEEK 2 COMPONENT: Document Chamber */}
              <div className="text-slate-900">
                <DocumentChamber />
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}