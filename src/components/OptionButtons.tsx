
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Music, Guitar, Image, Video } from 'lucide-react';

const OptionButtons = () => {
  const [message, setMessage] = useState('');
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setAiResponses([...aiResponses, `You: ${message}`]);
    
    // Simulate AI response
    setTimeout(() => {
      setAiResponses(prev => [...prev, `AI: I'm a placeholder response. This feature will be connected to your Python chatbot in the future.`]);
    }, 1000);
    
    setMessage('');
  };

  const handleSpecialTool = (tool: string) => {
    setAiResponses([...aiResponses, `System: ${tool} tool selected. This feature is coming soon.`]);
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Chat display area */}
      <div className="bg-[#222222] p-4 rounded-lg border border-[#1EAEDB]/40 mb-4 h-60 overflow-y-auto">
        {aiResponses.length === 0 ? (
          <div className="h-full flex items-center justify-center text-white/60">
            <p>Ask me anything or try our creative tools.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {aiResponses.map((response, index) => (
              <div key={index} className="p-2 rounded bg-[#2a2a30]">
                {response}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Message input area */}
      <div className="bg-[#222222] p-4 rounded-lg border border-[#1EAEDB]/40">
        <div className="flex items-center gap-2">
          <Textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything..."
            className="min-h-[60px] bg-[#333] border-none text-white resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-[#1EAEDB] text-white h-12 w-12 rounded-full p-2 flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Tool icons */}
        <div className="flex mt-3 gap-3">
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-[#1EAEDB]/40 text-[#1EAEDB] hover:bg-[#1EAEDB]/10"
            onClick={() => handleSpecialTool("Chord Generator")}
          >
            <Guitar className="h-4 w-4 mr-2" />
            Chord Generator
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-[#1EAEDB]/40 text-[#1EAEDB] hover:bg-[#1EAEDB]/10"
            onClick={() => handleSpecialTool("Music Generator")}
          >
            <Music className="h-4 w-4 mr-2" />
            Music
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-[#1EAEDB]/40 text-[#1EAEDB] hover:bg-[#1EAEDB]/10"
            onClick={() => handleSpecialTool("Image Generator")}
          >
            <Image className="h-4 w-4 mr-2" />
            Image
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent border-[#1EAEDB]/40 text-[#1EAEDB] hover:bg-[#1EAEDB]/10"
            onClick={() => handleSpecialTool("Video Generator")}
          >
            <Video className="h-4 w-4 mr-2" />
            Video
          </Button>
        </div>
      </div>
      
      {/* Productions showcase */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#222222] p-4 rounded-lg border border-[#1EAEDB]/40">
          <h3 className="text-lg font-bold mb-2 text-white">Latest Music</h3>
          <div className="h-[100px] bg-[#333] rounded-md flex items-center justify-center">
            <Music className="h-8 w-8 text-[#1EAEDB]" />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-3 bg-[#1EAEDB] text-white border-white/40 hover:bg-[#1EAEDB]/80 hover:text-white"
            onClick={() => window.open('https://open.spotify.com/artist/7g1t8aR8ksGZPVDLhemiRt', '_blank')}
          >
            Listen on Spotify
          </Button>
        </div>
        <div className="bg-[#222222] p-4 rounded-lg border border-[#1EAEDB]/40">
          <h3 className="text-lg font-bold mb-2 text-white">Latest Videos</h3>
          <div className="h-[100px] bg-[#333] rounded-md flex items-center justify-center">
            <Video className="h-8 w-8 text-[#1EAEDB]" />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-3 bg-[#1EAEDB] text-white border-white/40 hover:bg-[#1EAEDB]/80 hover:text-white"
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
