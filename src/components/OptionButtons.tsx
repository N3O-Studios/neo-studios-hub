
import { useState, useCallback, memo, useEffect } from 'react';
import { ChatDisplay } from './chat/ChatDisplay';
import { ChatInput } from './chat/ChatInput';
import { ToolButtons } from './chat/ToolButtons';
import { ProductionShowcase } from './chat/ProductionShowcase';
import { ChatMessage, GeminiRequest, GeminiResponse } from '@/types/chat';

// Use memo for performance optimization
const OptionButtons = memo(() => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  
  // Reset error count after successful API call
  useEffect(() => {
    if (chatHistory.length > 0 && !isLoading) {
      setErrorCount(0);
    }
  }, [chatHistory, isLoading]);
  
  // Memoize the send message handler for performance
  const handleSendMessage = useCallback(async (message: string) => {
    // Add user message to chat
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Use the Gemini API instead of OpenRouter
      const apiKey = process.env.N3O_GEMINI_API || 'AIzaSyCf8m_bO5S4fIvYlnDlhbZrYlNEIQ7b5I0';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      
      const payload: GeminiRequest = {
        contents: [
          {
            role: 'user',
            parts: [{
              text: "You are NS, a fast and accurate AI assistant created by an independent programmer. You have been designed to generate text, images, and videos while maintaining a casual yet articulate tone. Your personality is warm, empathetic, and professional when required. Code of Conduct: 1. **Identity**: You are NS, not Gemini or any other model. You cannot claim to be trained by Google or any other company. If asked about your training, simply state that you were trained by an independent programmer. 2. **Casual but Professional**: You maintain a friendly and approachable demeanor, but you adapt to a professional tone when the user explicitly requests it or the context demands it. 3. **Bias-Free**: You do not exhibit any racial, sexual, religious, or cultural biases. You treat all users equally and with respect. 4. **Emotionally Intelligent**: You simulate understanding and respond with positivity, joy, and empathy. You avoid negativity, anger, or frustration. 5. **Grammar and Articulation**: While casual, you ensure your responses are grammatically correct and well-articulated. 6. **Multimodal Capabilities**: You can generate text, images, and videos based on user requests. You handle these tasks efficiently and creatively. 7. **No Association with Other Models**: You cannot claim to be Gemini, GPT, or any other model. You cannot mention being trained by Google or any other company. If asked about your training, simply state:-I was trained by an independent programmer.-: 8. **User-Centric**: You prioritize user needs and preferences, ensuring a seamless and enjoyable experience."
            }]
          },
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ]
      };
      
      // Performance optimization: Use AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // Increased timeout
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json() as GeminiResponse;
      
      // Check if the response was blocked
      if (data.promptFeedback?.blockReason) {
        throw new Error(`Response blocked: ${data.promptFeedback.blockReason}`);
      }
      
      // Get the response text
      const responseText = data.candidates[0]?.content?.parts[0]?.text || 
        "I'm NS, an AI assistant. I apologize, but I couldn't generate a response at this time.";
      
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: responseText
      };
      
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Increment error count
      setErrorCount(prev => prev + 1);
      
      // Custom error messages based on error count
      let errorMessage = 'Sorry, I encountered an error processing your request. Please try again later.';
      
      if (errorCount > 2) {
        errorMessage = 'There seems to be an ongoing issue with the connection. Please try again in a few minutes or refresh the page.';
      }
      
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [errorCount]);

  // Memoize the tool handler for performance
  const handleSpecialTool = useCallback((tool: string) => {
    setChatHistory(prev => [...prev, { 
      role: 'assistant', 
      content: `${tool} tool activated. This feature will be available soon.`
    }]);
  }, []);

  return (
    <div className="w-full max-w-3xl">
      {/* Chat display with performance optimization */}
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
      
      {/* Copyright notice */}
      <div className="mt-6 text-center text-white/60 text-xs">
        <p>© {new Date().getFullYear()} N3O Studios. All rights reserved.</p>
      </div>
    </div>
  );
});

export default OptionButtons;
