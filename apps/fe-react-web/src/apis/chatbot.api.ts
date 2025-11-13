import { apiRequest } from "@/lib/http";
import type { AiChatbotAnswerResponse, AiChatMessageResponse } from "@/schema/ai-chatbot.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const unwrapPayload = <T>(payload: BaseResponse<T> | T): T => {
  if (payload && typeof payload === "object" && "status" in payload && "message" in payload && "data" in payload) {
    return (payload as BaseResponse<T>).data;
  }
  return payload as T;
};

const getHistory = async (limit = 20) => {
  const response = await apiRequest.get<BaseResponse<AiChatMessageResponse[]>>(`${API_SUFFIX.CHATBOT_API}/history`, {
    params: { limit },
  });
  return unwrapPayload(response.data);
};

const sendMessage = async (message: string) => {
  const response = await apiRequest.post<BaseResponse<AiChatbotAnswerResponse>>(API_SUFFIX.CHATBOT_API, { message });
  return unwrapPayload(response.data);
};

export const chatbotApi = {
  getHistory,
  sendMessage,
};
