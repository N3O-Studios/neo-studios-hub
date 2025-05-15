
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/types/chat';

interface ChatDisplayProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
}

export const ChatDisplay = ({
  chatHistory,
  isLoading
}: ChatDisplayProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  return (
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
                  {message.content}
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
  );
};
