
import { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/types/chat';

interface ChatDisplayProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
}

export const ChatDisplay = ({ chatHistory, isLoading }: ChatDisplayProps) => {
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 mb-4">
      <ScrollArea id="chat-container" className="h-[350px] p-4">
        {chatHistory.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/60">
            <p className="text-center max-w-xs">
              Hello! I'm N3O, your AI assistant. Ask me anything or try our creative tools.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.role === 'user' 
                      ? 'bg-[#7E69AB] text-white' 
                      : 'bg-[#2A2A30] text-white border border-[#9b87f5]/20'
                  }`}
                >
                  {msg.content}
                  <div className="text-xs opacity-50 text-right mt-1">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2A2A30] text-white p-3 rounded-lg border border-[#9b87f5]/20">
                  <div className="flex gap-1">
                    <span className="animate-pulse">•</span>
                    <span className="animate-pulse delay-100">•</span>
                    <span className="animate-pulse delay-200">•</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
