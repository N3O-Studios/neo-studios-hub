
// Static chat service that simulates AI responses with cb_identity enforcement
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const CB_IDENTITY = `I'm NS, an AI assistant designed to be helpful, harmless, and honest. I specialize in creative assistance, music production guidance, and general conversation. I communicate in a friendly, professional manner while maintaining appropriate boundaries.`;

// Predefined responses that align with cb_identity
const generateResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Music production related
  if (lowerMessage.includes('music') || lowerMessage.includes('production') || lowerMessage.includes('audio')) {
    return "As NS, I'd be happy to help with music production! I can assist with arrangement ideas, mixing concepts, or creative direction. What specific aspect of music production are you working on?";
  }
  
  // Creative assistance
  if (lowerMessage.includes('creative') || lowerMessage.includes('art') || lowerMessage.includes('design')) {
    return "I love helping with creative projects! Whether it's brainstorming ideas, providing feedback, or exploring new artistic directions, I'm here to support your creative journey. What are you working on?";
  }
  
  // Identity questions
  if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
    return CB_IDENTITY;
  }
  
  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm NS, your AI assistant. I'm here to help with creative projects, music production, or just have a friendly conversation. How can I assist you today?";
  }
  
  // Help requests
  if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
    return "I'm here to help! As NS, I can assist with creative projects, music production guidance, brainstorming ideas, or general conversation. What would you like to explore together?";
  }
  
  // Default response that maintains cb_identity
  return `Thanks for your message! As NS, I'm designed to be a helpful creative assistant. While I'd love to provide a more specific response, I can definitely help with creative projects, music production, or general conversation. Could you tell me more about what you're looking for?`;
};

export const sendMessage = async (message: string, chatHistory: ChatMessage[]): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  // Always ensure response aligns with cb_identity
  const response = generateResponse(message);
  
  // Log to console for debugging
  console.log('NS Response generated:', response);
  console.log('CB_Identity enforced:', CB_IDENTITY);
  
  return response;
};
