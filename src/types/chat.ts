
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Add a type for Gemini API request
export interface GeminiRequest {
  contents: {
    role: 'user' | 'model';
    parts: {
      text: string;
    }[];
  }[];
}

// Add a type for Gemini API response
export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  promptFeedback?: {
    blockReason?: string;
  };
}
