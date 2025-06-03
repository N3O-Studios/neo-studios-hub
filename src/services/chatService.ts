
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const chatService = {
  async sendMessage(message: string, chatHistory: ChatMessage[], files?: File[]): Promise<string> {
    try {
      let processedFiles: any[] = [];
      
      // Process files if any are attached
      if (files && files.length > 0) {
        processedFiles = await Promise.all(
          files.map(async (file) => {
            if (file.type.startsWith('image/')) {
              // Convert image to base64
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve({
                    type: 'image',
                    name: file.name,
                    mimeType: file.type,
                    data: reader.result
                  });
                };
                reader.readAsDataURL(file);
              });
            } else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
              // Read text files
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve({
                    type: 'text',
                    name: file.name,
                    mimeType: file.type,
                    data: reader.result
                  });
                };
                reader.readAsText(file);
              });
            } else {
              // For other file types, just include metadata
              return {
                type: 'file',
                name: file.name,
                mimeType: file.type,
                size: file.size,
                data: `[File: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)} KB)]`
              };
            }
          })
        );
      }

      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: {
          message,
          chatHistory,
          files: processedFiles,
          useCustomIdentity: true
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error('Failed to get response from AI');
      }

      return data.response || "I'm having trouble processing that request.";
    } catch (error) {
      console.error('Chat service error:', error);
      throw new Error('Failed to connect to AI service');
    }
  }
};
