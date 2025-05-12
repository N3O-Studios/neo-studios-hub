
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Music, Guitar, Image, Video } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const OptionButtons = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat - explicitly typing as ChatMessage
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    setMessage('');
    
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
      {/* Chat display area with improved styling */}
      <div className="bg-[#1A1F2C] rounded-lg border border-[#9b87f5]/30 mb-4">
        <ScrollArea id="chat-container" className="h-[350px] p-4">
          {chatHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-white/60">
              <p className="text-center max-w-xs">
                Hello! I'm N3O, your AI assistant. Ask me anything or try our creative tools.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.role === 'user' 
                        ? 'bg-[#7E69AB] text-white' 
                        : 'bg-[#2A2A30] text-white border border-[#9b87f5]/20'
                    }`}
                  >
                    {msg.content}
                    <div className="text-xs opacity-50 text-right mt-1">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#2A2A30] text-white p-3 rounded-lg border border-[#9b87f5]/20">
                    <div className="flex gap-1">
                      <span className="animate-pulse">•</span>
                      <span className="animate-pulse delay-100">•</span>
                      <span className="animate-pulse delay-200">•</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
      
      {/* Message input area */}
      <div className="bg-[#1A1F2C] p-4 rounded-lg border border-[#9b87f5]/30">
        <div className="flex items-center gap-2">
          <Textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything..."
            className="min-h-[60px] bg-[#2A2A30] border-none text-white resize-none focus-visible:ring-[#9b87f5]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
            className="bg-[#9b87f5] text-white h-12 w-12 rounded-full p-2 flex items-center justify-center hover:bg-[#7E69AB]"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Tool icons */}
        <div className="flex mt-3 gap-3 overflow-x-auto pb-1">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
            onClick={() => handleSpecialTool("Chord Generator")}
          >
            <Guitar className="h-4 w-4 mr-2" />
            Chord Generator
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
            onClick={() => handleSpecialTool("Music Generator")}
          >
            <Music className="h-4 w-4 mr-2" />
            Music
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
            onClick={() => handleSpecialTool("Image Generator")}
          >
            <Image className="h-4 w-4 mr-2" />
            Image
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-[#9b87f5]/40 text-[#9b87f5] hover:bg-[#9b87f5]/10"
            onClick={() => handleSpecialTool("Video Generator")}
          >
            <Video className="h-4 w-4 mr-2" />
            Video
          </Button>
        </div>
      </div>
      
      {/* Productions showcase */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1A1F2C] p-4 rounded-lg border border-[#9b87f5]/30">
          <h3 className="text-lg font-bold mb-2 text-white">Latest Music</h3>
          <div className="h-[100px] bg-[#2A2A30] rounded-md flex items-center justify-center">
            <Music className="h-8 w-8 text-[#9b87f5]" />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-3 bg-[#9b87f5] text-white border-[#9b87f5]/40 hover:bg-[#7E69AB] hover:text-white"
            onClick={() => window.open('https://open.spotify.com/artist/7g1t8aR8ksGZPVDLhemiRt', '_blank')}
          >
            Listen on Spotify
          </Button>
        </div>
        <div className="bg-[#1A1F2C] p-4 rounded-lg border border-[#9b87f5]/30">
          <h3 className="text-lg font-bold mb-2 text-white">Latest Videos</h3>
          <div className="h-[100px] bg-[#2A2A30] rounded-md flex items-center justify-center">
            <Video className="h-8 w-8 text-[#9b87f5]" />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-3 bg-[#9b87f5] text-white border-[#9b87f5]/40 hover:bg-[#7E69AB] hover:text-white"
            onClick={() => window.open('https://www.youtube.com/@N3O-STUD1O5', '_blank')}
          >
            Watch on YouTube
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OptionButtons;
