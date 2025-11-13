import { chatbotApi } from "@/apis/chatbot.api";
import type { AiChatbotAnswerResponse, AiChatMessageResponse } from "@/schema/ai-chatbot.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const aiChatbotKeys = {
  all: ["ai-chatbot"] as const,
  history: (limit: number) => [...aiChatbotKeys.all, "history", limit] as const,
};

export const useAiChatbotHistory = (limit = 20) =>
  useQuery<AiChatMessageResponse[]>({
    queryKey: aiChatbotKeys.history(limit),
    queryFn: () => chatbotApi.getHistory(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export const useSendAiChatbotMessage = () =>
  useMutation<AiChatbotAnswerResponse, unknown, string>({
    mutationFn: (message: string) => chatbotApi.sendMessage(message),
  });
