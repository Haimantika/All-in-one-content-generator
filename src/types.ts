export interface Tutorial {
    topic: string;
    timestamp: string;
    content?: string;
    isLoading?: boolean;
    error?: string;
  }
  
  export interface OpenAIResponse {
    content: string;
    error?: string;
  }