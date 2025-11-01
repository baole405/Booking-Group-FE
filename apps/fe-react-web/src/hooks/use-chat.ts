import { chatApi } from "@/apis/chat.api";
import type { TCreateMessage } from "@/schema/chat.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const chatKeys = {
  all: ["chat"] as const,
  groupMessages: (groupId: number) => [...chatKeys.all, "group", groupId] as const,
  messageById: (messageId: number) => [...chatKeys.all, "message", messageId] as const,
  search: (groupId: number, keyword: string) => [...chatKeys.all, "search", groupId, keyword] as const,
};

// Hook để lấy tin nhắn của nhóm
export const useGroupMessages = (groupId: number | null, page = 1, size = 50) => {
  return useQuery({
    queryKey: [...chatKeys.groupMessages(groupId || 0), page, size],
    queryFn: async () => {
      if (!groupId) throw new Error("Group ID is required");
      console.log("Fetching messages for group:", groupId, "page:", page, "size:", size);
      try {
        const response = await chatApi.getGroupMessages(groupId, page, size);
        console.log("Messages response:", response);
        return response.data.data;
      } catch (error: unknown) {
        console.error("Failed to fetch messages:", error);
        console.error("Error response:", (error as { response?: { data?: unknown } }).response?.data);
        throw error;
      }
    },
    enabled: !!groupId,
    refetchInterval: false, // Tắt auto-refresh vì backend đang lỗi 500
    staleTime: 3000,
    retry: 1, // Chỉ retry 1 lần
  });
};

// Hook để gửi tin nhắn
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TCreateMessage) => {
      console.log("Sending message:", data);
      try {
        const response = await chatApi.sendMessage(data);
        console.log("Send message response:", response);
        return response.data.data;
      } catch (error: unknown) {
        console.error("Failed to send message:", error);
        console.error("Error response:", (error as { response?: { data?: unknown } }).response?.data);
        throw error;
      }
    },
    onSuccess: (newMessage) => {
      // Invalidate để refetch messages của nhóm
      queryClient.invalidateQueries({
        queryKey: chatKeys.groupMessages(newMessage.groupId),
      });
    },
  });
};

// Hook để sửa tin nhắn
export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, content }: { messageId: number; content: string }) => {
      const response = await chatApi.updateMessage(messageId, content);
      return response.data.data;
    },
    onSuccess: (updatedMessage) => {
      // Invalidate messages của nhóm
      queryClient.invalidateQueries({
        queryKey: chatKeys.groupMessages(updatedMessage.groupId),
      });
    },
  });
};

// Hook để xóa tin nhắn
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, groupId }: { messageId: number; groupId: number }) => {
      await chatApi.deleteMessage(messageId);
      return { messageId, groupId };
    },
    onSuccess: ({ groupId }) => {
      // Invalidate messages của nhóm
      queryClient.invalidateQueries({
        queryKey: chatKeys.groupMessages(groupId),
      });
    },
  });
};

// Hook để search tin nhắn
export const useSearchMessages = (groupId: number, keyword: string, enabled = false) => {
  return useQuery({
    queryKey: chatKeys.search(groupId, keyword),
    queryFn: async () => {
      const response = await chatApi.searchMessages(groupId, keyword);
      return response.data.data;
    },
    enabled: enabled && !!groupId && !!keyword,
  });
};

// Hook để lấy message theo ID
export const useMessageById = (messageId: number, enabled = false) => {
  return useQuery({
    queryKey: chatKeys.messageById(messageId),
    queryFn: async () => {
      const response = await chatApi.getMessageById(messageId);
      return response.data.data;
    },
    enabled: enabled && !!messageId,
  });
};
