
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, X } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  showWelcome?: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading, showWelcome = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() || files.length > 0) {
      let finalMessage = message;
      
      // Add file info to message if files are attached
      if (files.length > 0) {
        const fileInfo = files.map(file => `[File: ${file.name}]`).join('\n');
        finalMessage = `${finalMessage}\n${fileInfo}`.trim();
      }
      
      onSendMessage(finalMessage);
      setMessage('');
      setFiles([]);
      setFilePreviewUrls([]);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles(prev => [...prev, ...newFiles]);
      
      // Generate preview URLs for the files
      const newPreviewUrls = newFiles.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return '';
      });
      
      setFilePreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      // Reset file input
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    // Revoke the Object URL to avoid memory leaks
    if (filePreviewUrls[index]) {
      URL.revokeObjectURL(filePreviewUrls[index]);
    }
    
    setFiles(files.filter((_, i) => i !== index));
    setFilePreviewUrls(filePreviewUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2 border-t border-[#9b87f5]/10 pt-4">
      {/* File previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {files.map((file, index) => (
            <div 
              key={index} 
              className="bg-[#2A2A30] rounded-md p-2 flex items-center gap-2 group relative"
            >
              {filePreviewUrls[index] ? (
                <img 
                  src={filePreviewUrls[index]} 
                  alt={file.name}
                  className="h-10 w-10 object-cover rounded"
                />
              ) : (
                <div className="h-10 w-10 flex items-center justify-center bg-[#1A1F2C] rounded">
                  <Paperclip className="h-4 w-4 text-[#9b87f5]" />
                </div>
              )}
              <span className="text-sm text-white truncate max-w-[100px]">{file.name}</span>
              <button 
                onClick={() => removeFile(index)}
                className="absolute -top-1 -right-1 bg-[#9b87f5] rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={showWelcome ? "Welcome! I'm NS, an AI assistant. Ask me anything..." : "Ask me anything..."}
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
            disabled={isLoading || (!message.trim() && files.length === 0)}
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
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
