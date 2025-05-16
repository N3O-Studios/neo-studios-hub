
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// API request types
export interface GeminiRequest {
  contents: {
    role: 'user' | 'model';
    parts: {
      text: string;
    }[];
  }[];
}

// API response types
export interface GeminiResponse {
  candidates?: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason?: string;
  }[];
  promptFeedback?: {
    blockReason?: string;
  };
}

// Perplexity API types for future integration
export interface PerplexityRequest {
  model: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
}

export interface PerplexityResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}
