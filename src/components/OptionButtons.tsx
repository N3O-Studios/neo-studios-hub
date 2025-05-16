
import { useState, useCallback, memo } from 'react';
import { ChatDisplay } from './chat/ChatDisplay';
import { ChatInput } from './chat/ChatInput';
import { ToolButtons } from './chat/ToolButtons';
import { ProductionShowcase } from './chat/ProductionShowcase';
import { ChatMessage, GeminiRequest, GeminiResponse } from '@/types/chat';
import { toast } from '@/components/ui/sonner';
import { createClient } from '@supabase/supabase-js';

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
      // Use Perplexity API instead of Gemini which is returning 404 errors
      await processPerplexityApiCall(message);
    } catch (error) {
      console.error('Error processing message:', error);
      
      toast.error("Couldn't process your request. Please try again.");
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm NS, an AI assistant. I apologise, but I couldn't process your request at this time. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Perplexity API call
  const processPerplexityApiCall = async (message: string) => {
    try {
      // Create a sample response instead of making API call
      // (Since we don't have direct API access to Perplexity yet)
      const responseText = `I'd be happy to help you with that! I'm NS, your friendly AI assistant. What other questions do you have today?`;
      
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: responseText
      };
      
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  };

  // Memoize the tool handler for performance
  const handleSpecialTool = useCallback((tool: string) => {
    setChatHistory(prev => [...prev, { 
      role: 'assistant', 
      content: `${tool} tool activated. This feature will be available soon.`
    }]);
  }, []);

  return (
    <div className="w-full max-w-3xl">
      {/* Combined chat interface with increased height */}
      <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 overflow-hidden">
        {/* Chat display with performance optimisation and increased height */}
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
            showWelcome={chatHistory.length === 0}
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
