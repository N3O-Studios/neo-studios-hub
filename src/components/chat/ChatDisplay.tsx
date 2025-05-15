import { useEffect } from 'react';
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
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);
  return <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 mb-4">
      
    </div>;
};