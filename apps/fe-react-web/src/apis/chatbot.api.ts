import { apiRequest } from "@/lib/http";
import { API_SUFFIX } from "./util.api";

// Types for Chatbot API
export interface TChatbotMessage {
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;
}

export interface TChatbotRequest {
  message: string;
}

export interface TChatbotResponse {
  answer: string;
  attachments?: Record<string, unknown>;
}

// Send message to chatbot
const sendMessage = async (data: TChatbotRequest) => await apiRequest.post<TChatbotResponse>(API_SUFFIX.CHATBOT_API, data);

// Get chatbot history
const getHistory = async (limit = 10) => await apiRequest.get<TChatbotMessage[]>(`${API_SUFFIX.CHATBOT_API}/history`, { params: { limit } });

export const chatbotApi = {
  sendMessage,
  getHistory,
};
