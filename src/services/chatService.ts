
import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const chatService = {
  async sendMessage(message: string, chatHistory: ChatMessage[]): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: {
          message,
          chatHistory,
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
