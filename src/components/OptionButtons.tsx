
import { useState, useCallback, memo } from 'react';
import { ChatDisplay } from './chat/ChatDisplay';
import { ChatInput } from './chat/ChatInput';
import { ToolButtons } from './chat/ToolButtons';
import { ProductionShowcase } from './chat/ProductionShowcase';
import { ChatMessage } from '@/types/chat';
import { toast } from '@/components/ui/sonner';
import { sendMessage } from '@/services/staticChatService';

// Use memo for performance optimisation
const OptionButtons = memo(() => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Memoize the send message handler for performance
  const handleSendMessage = useCallback(async (message: string) => {
    // Add user message to chat
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Use static chat service
      const response = await sendMessage(message, chatHistory.slice(-10));
      
      // Add the assistant's response to chat history
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: response
      }]);
      
    } catch (error) {
      console.error('Error processing message:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm experiencing a technical difficulty. Please try again in a moment."
      }]);
      toast.error('Message failed to send');
    } finally {
      setIsLoading(false);
    }
  }, [chatHistory]);

  // Memoize the tool handler for performance
  const handleSpecialTool = useCallback((tool: string) => {
    setChatHistory(prev => [...prev, { 
      role: 'assistant', 
      content: `Hello! I'm NS, and I see you're interested in the ${tool} feature. While this specific tool is currently in development, I'm here to help with creative projects, music production guidance, and general assistance. What can I help you with today?`
    }]);
  }, []);

  return (
    <div className="w-full max-w-3xl">
      {/* Combined chat interface with increased height */}
      <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 overflow-hidden backdrop-blur-sm bg-opacity-90">
        {/* Chat display with auto-scroll disabled */}
        <ChatDisplay 
          chatHistory={chatHistory} 
          isLoading={isLoading}
          disableAutoScroll={true}
        />
        
        {/* Message input and tools area */}
        <div className="p-4">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            showWelcome={true}
          />
          
          {/* Tool icons */}
          <ToolButtons onSelectTool={handleSpecialTool} />
        </div>
      </div>
      
      {/* Productions showcase */}
      <ProductionShowcase />
    </div>
  );
});

export default OptionButtons;
