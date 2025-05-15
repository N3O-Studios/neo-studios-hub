
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Here you would handle the file upload, for now just append the filename to the message
      setMessage(prev => prev + `\n[File: ${files[0].name}]`);
      // Reset file input
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything..."
          className="min-h-[60px] bg-[#2A2A30] border-none text-white resize-none focus-visible:ring-[#9b87f5] transition-all duration-300 hover:bg-[#2A2A30]/90"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        
        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            className="bg-[#9b87f5] text-white h-12 w-12 rounded-full p-2 flex items-center justify-center hover:bg-[#7E69AB] transition-all duration-300"
          >
            <Send className="h-5 w-5" />
          </Button>
          
          <Button
            type="button"
            onClick={handleFileUpload}
            className="bg-[#2A2A30] text-[#9b87f5] h-12 w-12 rounded-full p-2 flex items-center justify-center hover:bg-[#2A2A30]/80 transition-all duration-300"
          >
            <Paperclip className="h-5 w-5" />
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
