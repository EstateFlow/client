export interface Message {
  id: string;
  createdAt: Date;
  content: string;
  index: number;
  sender: "user" | "ai";
}

export interface MessageResponse {
  message: string;
  userMessage: {
    id: string;
    conversationId: string;
    sender: "user";
    content: string;
    createdAt: string;
    index: number;
    isVisible: boolean;
  };
  aiResponse: {
    id: string;
    conversationId: string;
    sender: "ai";
    content: string | null;
    createdAt: string;
    index: number;
    isVisible: boolean;
  };
}
