
import { useState, useCallback, memo } from 'react';
import { ChatDisplay } from './chat/ChatDisplay';
import { ChatInput } from './chat/ChatInput';
import { ChatMessage } from '@/types/chat';
import { developerChatService } from '@/services/developerChatService';

const DeveloperChat = memo(() => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = useCallback(async (message: string, files?: File[]) => {
    let displayMessage = message;
    if (files && files.length > 0) {
      const fileInfo = files.map(file => `📎 ${file.name}`).join('\n');
      displayMessage = message ? `${message}\n\n${fileInfo}` : fileInfo;
    }
    
    const userMessage: ChatMessage = { role: 'user', content: displayMessage };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await developerChatService.sendMessage(message, chatHistory, files);
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: response
      }]);
      
    } catch (error) {
      console.error('Error processing message:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm experiencing technical difficulties. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [chatHistory]);

  return (
    <div className="w-full">
      <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 overflow-hidden">
        <div className="p-4 border-b border-[#9b87f5]/10">
          <h3 className="text-lg font-semibold text-[#9b87f5] mb-1">TN - Tech Assistant</h3>
          <p className="text-sm text-white/70">Your professional development assistant</p>
        </div>
        
        <ChatDisplay 
          chatHistory={chatHistory} 
          isLoading={isLoading}
          disableAutoScroll={true}
        />
        
        <div className="p-4">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            showWelcome={false}
          />
        </div>
      </div>
    </div>
  );
});

export default DeveloperChat;
