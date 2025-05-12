
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Textarea 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything..."
        className="min-h-[60px] bg-[#2A2A30] border-none text-white resize-none focus-visible:ring-[#9b87f5]"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <Button 
        onClick={handleSend}
        disabled={isLoading || !message.trim()}
        className="bg-[#9b87f5] text-white h-12 w-12 rounded-full p-2 flex items-center justify-center hover:bg-[#7E69AB]"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};
