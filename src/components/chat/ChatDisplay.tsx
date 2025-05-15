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

  // Auto-scroll to the bottom when new messages arrive - optimized with useRef
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [chatHistory]);
  return <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 mb-4 h-[400px] overflow-hidden">
      <ScrollArea className="h-full">
        {chatHistory.length === 0 ? <div className="flex items-center justify-center h-full p-4 px-0 py-0">
            <p className="text-white/70 text-center animate-pulse">
              Ask NS anything to get started...
            </p>
          </div> : <div className="space-y-4 p-4">
            {chatHistory.map((message, index) => <div key={index} className={`p-3 rounded-lg animate-fade-in ${message.role === 'user' ? 'bg-[#2A2A30] ml-8' : 'bg-[#9b87f5]/10 border border-[#9b87f5]/30 mr-8'}`}>
                <p className="text-white text-sm mb-1 font-semibold">
                  {message.role === 'user' ? 'You' : 'NS'}
                </p>
                <p className="text-white/90 whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>)}
            {isLoading && <div className="bg-[#2A2A30] p-3 rounded-lg mr-8 animate-pulse">
                <p className="text-white text-sm mb-1 font-semibold">NS</p>
                <p className="text-white/70">Thinking...</p>
              </div>}
            <div ref={bottomRef} />
          </div>}
      </ScrollArea>
    </div>;
};