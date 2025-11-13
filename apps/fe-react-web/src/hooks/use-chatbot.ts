import type { TChatbotRequest } from "@/apis/chatbot.api";
import { chatbotApi } from "@/apis/chatbot.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const chatbotKeys = {
  all: ["chatbot"] as const,
  history: (limit: number) => [...chatbotKeys.all, "history", limit] as const,
};

// Hook to get chatbot history
export const useChatbotHistory = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: chatbotKeys.history(limit),
    queryFn: async () => {
      try {
        const response = await chatbotApi.getHistory(limit);
        return response.data;
      } catch (error: unknown) {
        console.error("Failed to fetch chatbot history:", error);
        return [];
      }
    },
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
    enabled: enabled, // Only fetch when enabled
  });
};

// Hook to send message to chatbot
export const useSendChatbotMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TChatbotRequest) => {
      const response = await chatbotApi.sendMessage(data);
      return response.data;
    },
    onSuccess: () => {
      // Refetch history after sending message
      queryClient.invalidateQueries({
        queryKey: chatbotKeys.all,
      });
    },
  });
};
