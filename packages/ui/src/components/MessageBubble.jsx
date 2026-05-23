import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, Bot } from 'lucide-react';
export const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    return (<div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-primary' : 'bg-gray-700'}`}>
          {isUser ? <User size={16}/> : <Bot size={16}/>}
        </div>
        <div className={`rounded-2xl px-4 py-3 ${isUser
            ? 'bg-primary text-white rounded-tr-sm'
            : 'bg-gray-800 text-gray-100 rounded-tl-sm'}`}>
          <ReactMarkdown className="prose prose-invert prose-sm max-w-none" components={{
            code: ({ node, inline, className, children, ...props }) => {
                return inline ? (<code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>) : (<code className="block bg-gray-900 p-3 rounded-lg text-sm overflow-x-auto" {...props}>
                    {children}
                  </code>);
            },
        }}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>);
};
//# sourceMappingURL=MessageBubble.js.map