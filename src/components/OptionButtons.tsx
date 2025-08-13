
import { useState, useCallback, memo } from 'react';
import { ChatDisplay } from './chat/ChatDisplay';
import { ChatInput } from './chat/ChatInput';
import { ToolButtons } from './chat/ToolButtons';
import { ProductionShowcase } from './chat/ProductionShowcase';
import { ChatMessage } from '@/types/chat';
import { chatService } from '@/services/chatService';

const OptionButtons = memo(() => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = useCallback(async (message: string, files?: File[]) => {
    // Create display message with file info
    let displayMessage = message;
    if (files && files.length > 0) {
      const fileInfo = files.map(file => `📎 ${file.name}`).join('\n');
      displayMessage = message ? `${message}\n\n${fileInfo}` : fileInfo;
    }
    
    const userMessage: ChatMessage = { role: 'user', content: displayMessage };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await chatService.sendMessage(message, chatHistory, files);
      
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

  const handleSpecialTool = useCallback((tool: string) => {
    setChatHistory(prev => [...prev, { 
      role: 'assistant', 
      content: `The ${tool} tool is being developed and will be available soon. Is there anything else I can help you with?`
    }]);
  }, []);

  return (
    <div className="w-full max-w-3xl">
      <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 overflow-hidden">
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
          
          <ToolButtons onSelectTool={handleSpecialTool} />
        </div>
      </div>
      
      <ProductionShowcase />
    </div>
  );
});

export default OptionButtons;
