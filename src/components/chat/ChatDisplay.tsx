
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/types/chat';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatDisplayProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
  disableAutoScroll?: boolean;
}

export const ChatDisplay = ({
  chatHistory,
  isLoading,
  disableAutoScroll = false
}: ChatDisplayProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive (if not disabled)
  useEffect(() => {
    if (!disableAutoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, disableAutoScroll]);

  return (
    <div className="relative">
      {/* Disclaimer text in top right */}
      <div className="absolute top-2 right-4 text-xs text-gray-400 italic z-10">
        *NS can make mistakes, double check important information
      </div>
      
      <ScrollArea className="h-[420px] overflow-y-auto px-4 pt-4">
        <div className="flex flex-col">
          {chatHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              {/* Empty space for a cleaner look */}
            </div>
          ) : (
            <>
              {chatHistory.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block max-w-[80%] px-4 py-2 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-[#9b87f5] text-white' 
                        : 'bg-[#2A2A30] text-white'
                    }`}
                  >
                    {message.role === 'user' ? (
                      message.content
                    ) : (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        className="markdown-content"
                        components={{
                          code({node, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '');
                            // Check if it's an inline code block by examining the node position
                            const isInline = !node || !('position' in node);
                            
                            return !isInline ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match?.[1] || ''}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-left mb-4">
                  <div className="inline-block max-w-[80%] px-4 py-2 rounded-lg bg-[#2A2A30] text-white">
                    <div className="flex gap-2">
                      <div className="h-2 w-2 bg-[#9b87f5] rounded-full animate-pulse"></div>
                      <div className="h-2 w-2 bg-[#9b87f5] rounded-full animate-pulse delay-150"></div>
                      <div className="h-2 w-2 bg-[#9b87f5] rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};
