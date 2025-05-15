
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  // Adjust textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      
      // Reset textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="flex items-start gap-2">
      <Textarea 
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything..."
        className="min-h-[60px] max-h-[120px] bg-[#2A2A30] border-none text-white resize-none focus-visible:ring-[#9b87f5] transition-all duration-300 hover:bg-[#2A2A30]/80 focus:animate-pulse-glow"
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
        className="bg-[#9b87f5] text-white h-12 w-12 rounded-full p-2 flex items-center justify-center hover:bg-[#7E69AB] transition-colors duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
        aria-label="Send message"
      >
        <Send className="h-5 w-5 animate-fade-in" />
      </Button>
    </div>
  );
};
