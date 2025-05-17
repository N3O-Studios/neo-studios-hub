
import { useState, useCallback, memo } from 'react';
import { ChatDisplay } from './chat/ChatDisplay';
import { ChatInput } from './chat/ChatInput';
import { ToolButtons } from './chat/ToolButtons';
import { ProductionShowcase } from './chat/ProductionShowcase';
import { ChatMessage } from '@/types/chat';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

// Use memo for performance optimisation
const OptionButtons = memo(() => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  
  // Memoize the send message handler for performance
  const handleSendMessage = useCallback(async (message: string) => {
    // Add user message to chat
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Call the Supabase Edge Function that handles the Gemini API
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { 
          message,
          chatHistory: chatHistory.slice(-10) // Only send the last 10 messages to avoid token limits
        }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: "Error" 
        }]);
        return;
      }
      
      // Add the assistant's response to chat history
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: data?.response || "Error" 
      }]);
      
    } catch (error) {
      console.error('Error processing message:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "Error" 
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [chatHistory]);

  // Memoize the tool handler for performance
  const handleSpecialTool = useCallback((tool: string) => {
    setChatHistory(prev => [...prev, { 
      role: 'assistant', 
      content: `${tool} tool activated. This feature will be available soon.`
    }]);
  }, []);

  // Toggle auto-scroll feature
  const toggleAutoScroll = useCallback(() => {
    setAutoScroll(prev => !prev);
  }, []);

  return (
    <div className="w-full max-w-3xl">
      {/* Combined chat interface with increased height */}
      <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 overflow-hidden">
        {/* Chat display with performance optimisation and increased height */}
        <div className="flex justify-end p-2 bg-[#232836] border-b border-[#9b87f5]/20">
          <button 
            onClick={toggleAutoScroll} 
            className={`text-xs px-2 py-1 rounded ${
              autoScroll ? 'bg-[#9b87f5]/70 text-white' : 'bg-[#2A2A30] text-gray-300'
            }`}
          >
            {autoScroll ? 'Auto-scroll: ON' : 'Auto-scroll: OFF'}
          </button>
        </div>
        
        <ChatDisplay 
          chatHistory={chatHistory} 
          isLoading={isLoading}
          disableAutoScroll={!autoScroll}
        />
        
        {/* Message input and tools area */}
        <div className="p-4">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            showWelcome={false}
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
