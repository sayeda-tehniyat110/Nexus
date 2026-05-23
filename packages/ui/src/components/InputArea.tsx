import React, { useState, KeyboardEvent } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';

interface InputAreaProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, disabled, isStreaming }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-800 p-4">
      <div className="flex items-end gap-3 bg-gray-800 rounded-2xl p-3">
        <button
          className="p-2 text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
          disabled={disabled}
          title="Attach file"
        >
          <Paperclip size={20} />
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-gray-100 placeholder-gray-500 min-h-[24px] max-h-32"
        />
        <button
          className="p-2 text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
          disabled={disabled}
          title="Voice input"
        >
          <Mic size={20} />
        </button>
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim() || isStreaming}
          className="p-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          {isStreaming ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </div>
  );
};
