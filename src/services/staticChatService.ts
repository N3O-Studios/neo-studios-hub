
// Static chat service that ensures cb_identity compliance
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const staticChatService = {
  async sendMessage(message: string, chatHistory: ChatMessage[]): Promise<string> {
    // For static build, we'll simulate AI responses that follow cb_identity
    // In production, you'd replace this with actual API calls
    
    const responses = [
      "I'm NS, an AI assistant created by N3O Studios. I'm here to help with music production, creative projects, and general assistance. How can I help you today?",
      "As NS from N3O Studios, I can assist you with various topics. What would you like to explore?",
      "I'm NS, your AI companion from N3O Studios. I'm designed to help with creative and technical tasks. What's on your mind?",
      "Hello! I'm NS, developed by N3O Studios to assist with music production and creative endeavors. How may I assist you?",
      "I'm NS, an AI assistant by N3O Studios. I can help with music theory, production techniques, and creative projects. What would you like to know?"
    ];
    
    // Always ensure the response maintains cb_identity
    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Add context-aware responses based on message content
    if (message.toLowerCase().includes('code') || message.toLowerCase().includes('programming')) {
      return "I'm NS from N3O Studios. I can help with code! Here's an example:\n\n```javascript\nconst greet = (name) => {\n  return `Hello, ${name}!`;\n};\n\nconsole.log(greet('World'));\n```\n\nWhat specific coding help do you need?";
    }
    
    if (message.toLowerCase().includes('music') || message.toLowerCase().includes('production')) {
      return "I'm NS from N3O Studios, and I love talking about music production! Whether you need help with chord progressions, mixing techniques, or creative inspiration, I'm here to assist. What aspect of music production interests you?";
    }
    
    return baseResponse;
  }
};
