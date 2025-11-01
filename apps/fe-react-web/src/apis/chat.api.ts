import { apiRequest } from "@/lib/http";
import type { TCreateMessage, TMessage } from "@/schema/chat.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

// Lấy lịch sử tin nhắn của nhóm (có phân trang)
const getGroupMessages = async (groupId: number, page = 1, size = 50) =>
  await apiRequest.get<BaseResponse<TMessage[]>>(`${API_SUFFIX.CHAT_API}/groups/${groupId}/messages`, { params: { page, size } });

// Gửi tin nhắn
const sendMessage = async (data: TCreateMessage) => await apiRequest.post<BaseResponse<TMessage>>(`${API_SUFFIX.CHAT_API}/messages`, data);

// Sửa tin nhắn (request body là string trực tiếp, không phải object)
const updateMessage = async (messageId: number, content: string) =>
  await apiRequest.put<BaseResponse<TMessage>>(`${API_SUFFIX.CHAT_API}/messages/${messageId}`, content, {
    headers: { "Content-Type": "text/plain" },
  });

// Xóa tin nhắn
const deleteMessage = async (messageId: number) => await apiRequest.delete<BaseResponse<null>>(`${API_SUFFIX.CHAT_API}/messages/${messageId}`);

// Tìm kiếm tin nhắn trong nhóm
const searchMessages = async (groupId: number, keyword: string) =>
  await apiRequest.get<BaseResponse<TMessage[]>>(`${API_SUFFIX.CHAT_API}/groups/${groupId}/search`, { params: { keyword } });

// Lấy tin nhắn theo ID
const getMessageById = async (messageId: number) => await apiRequest.get<BaseResponse<TMessage>>(`${API_SUFFIX.CHAT_API}/messages/${messageId}`);

export const chatApi = {
  getGroupMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
  searchMessages,
  getMessageById,
};
