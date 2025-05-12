import { useState } from 'react';
import { ChatDisplay } from './chat/ChatDisplay';
import { ChatInput } from './chat/ChatInput';
import { ToolButtons } from './chat/ToolButtons';
import { ProductionShowcase } from './chat/ProductionShowcase';
import { ChatMessage } from '@/types/chat';

const OptionButtons = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = (message: string) => {
    // Add user message to chat
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // This is a placeholder. In the future, this will connect to your Supabase Edge Function
      // that will use the OpenRouter API with your Python chatbot logic
      setTimeout(() => {
        const assistantMessage: ChatMessage = { 
          role: 'assistant', 
          content: "I'm N3O, an AI assistant designed to help with various creative tasks. Once connected to Supabase, I'll be able to provide more personalized responses using your Python chatbot's logic." 
        };
        setChatHistory(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.' 
      }]);
      setIsLoading(false);
    }
  };

  const handleSpecialTool = (tool: string) => {
    setChatHistory(prev => [...prev, { 
      role: 'assistant', 
      content: `${tool} tool activated. This feature will be available after connecting to Supabase.`
    }]);
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Chat display */}
      <ChatDisplay 
        chatHistory={chatHistory} 
        isLoading={isLoading} 
      />
      
      {/* Message input and tools area */}
      <div className="bg-[#1A1F2C] p-4 rounded-lg border border-[#9b87f5]/30">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
        />
        
        {/* Tool icons */}
        <ToolButtons onSelectTool={handleSpecialTool} />
      </div>
      
      {/* Productions showcase */}
      <ProductionShowcase />
    </div>
  );
};

export default OptionButtons;
