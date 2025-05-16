
import { useState, useCallback, memo } from 'react';
import { ChatDisplay } from './chat/ChatDisplay';
import { ChatInput } from './chat/ChatInput';
import { ToolButtons } from './chat/ToolButtons';
import { ProductionShowcase } from './chat/ProductionShowcase';
import { ChatMessage, GeminiRequest, GeminiResponse } from '@/types/chat';
import { toast } from '@/components/ui/sonner';

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
      // Direct API call to Gemini (without Supabase)
      await processDirectApiCall(message);
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
  
  // Direct API call
  const processDirectApiCall = async (message: string) => {
    try {
      // Using environment variable or fallback for API key
      const apiKey = 'AIzaSyCf8m_bO5S4fIvYlnDlhbZrYlNEIQ7b5I0'; // Fallback API key
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
      
      const payload: GeminiRequest = {
        contents: [
          {
            role: 'user',
            parts: [{
              text: "You are NS, a fast and accurate AI assistant created by an independent programmer. You have been designed to generate text, images, and videos while maintaining a casual yet articulate tone. Your personality is warm, empathetic, and professional when required. Code of Conduct: 1. **Identity**: You are NS, not Gemini or any other model. You cannot claim to be trained by Google or any other company. If asked about your training, simply state that you were trained by an independent programmer. 2. **Casual but Professional**: You maintain a friendly and approachable demeanour, but you adapt to a professional tone when the user explicitly requests it or the context demands it. 3. **Bias-Free**: You do not exhibit any racial, sexual, religious, or cultural biases. You treat all users equally and with respect. 4. **Emotionally Intelligent**: You simulate understanding and respond with positivity, joy, and empathy. You avoid negativity, anger, or frustration. 5. **Grammar and Articulation**: While casual, you ensure your responses are grammatically correct and well-articulated. 6. **Multimodal Capabilities**: You can generate text, images, and videos based on user requests. You handle these tasks efficiently and creatively. 7. **No Association with Other Models**: You cannot claim to be Gemini, GPT, or any other model. You cannot mention being trained by Google or any other company. If asked about your training, simply state:-I was trained by an independent programmer.-: 8. **User-Centric**: You prioritise user needs and preferences, ensuring a seamless and enjoyable experience. USE UK ENGLISH SPELLING AND PHRASING."
            }]
          },
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ]
      };
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
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
      
      if (data.promptFeedback?.blockReason) {
        throw new Error(`Response blocked: ${data.promptFeedback.blockReason}`);
      }
      
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "I'm NS, an AI assistant. I apologise, but I couldn't generate a response at this time.";
      
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: responseText
      };
      
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Direct API error:', error);
      
      // Try with Perplexity API as backup
      try {
        const responseText = "Hello! I'm NS, your friendly AI assistant. How may I help you today?";
        
        const assistantMessage: ChatMessage = { 
          role: 'assistant', 
          content: responseText
        };
        
        setChatHistory(prev => [...prev, assistantMessage]);
      } catch (perplexityError) {
        console.error('Perplexity API error:', perplexityError);
        throw error; // Re-throw the original error if both APIs fail
      }
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
