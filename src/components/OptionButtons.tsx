
import { useState, useCallback, memo } from 'react';
import { ChatDisplay } from './chat/ChatDisplay';
import { ChatInput } from './chat/ChatInput';
import { ToolButtons } from './chat/ToolButtons';
import { ProductionShowcase } from './chat/ProductionShowcase';
import { ChatMessage } from '@/types/chat';
import { chatService } from '@/services/chatService';
import ImageGenerator from './ImageGenerator';

const OptionButtons = memo(() => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);
  
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

  const handleSpecialTool = useCallback((tool: string, component?: string) => {
    if (component) {
      setActiveComponent(component);
      return;
    }
    
    setChatHistory(prev => [...prev, { 
      role: 'assistant', 
      content: `${tool}`
    }]);
  }, []);

  // Show specific component if active
  if (activeComponent === 'ImageGenerator') {
    return (
      <div className="w-full max-w-5xl">
        <div className="mb-4">
          <button 
            onClick={() => setActiveComponent(null)}
            className="text-[#9b87f5] hover:text-[#7E69AB] text-sm"
          >
            ← Back to Chat
          </button>
        </div>
        <ImageGenerator />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 overflow-hidden">
        <ChatDisplay 
          chatHistory={chatHistory} 
          isLoading={isLoading}
          disableAutoScroll={true}
        />
        
        <div className="p-6">
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
