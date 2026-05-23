import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
export default function ChatMessage({ message }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const isUser = message.role === 'user';
    return (<div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-3xl rounded-lg px-4 py-3 ${isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-card border border-border'}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
            code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                const code = String(children).replace(/\n$/, '');
                if (!inline && language) {
                    return (<div className="relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleCopy(code)} className="p-1 hover:bg-accent rounded">
                        {copied ? (<Check className="w-4 h-4"/>) : (<Copy className="w-4 h-4"/>)}
                      </button>
                    </div>
                    <SyntaxHighlighter style={vscDarkPlus} language={language} PreTag="div" className="rounded-md" {...props}>
                      {code}
                    </SyntaxHighlighter>
                  </div>);
                }
                return (<code className={`${className} bg-accent px-1.5 py-0.5 rounded text-sm`} {...props}>
                  {children}
                </code>);
            },
        }}>
          {message.content}
        </ReactMarkdown>
        {message.images && message.images.length > 0 && (<div className="mt-2 flex gap-2">
            {message.images.map((img, i) => (<img key={i} src={`data:image/png;base64,${img}`} alt="Screenshot" className="max-w-xs rounded-md cursor-pointer hover:opacity-80"/>))}
          </div>)}
      </div>
    </div>);
}
//# sourceMappingURL=ChatMessage.js.map