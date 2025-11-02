import { apiRequest } from "@/lib/http";
import type { TCreateInvite, TInvite, TInviteList, TRespondInvite, UseInviteParams } from "@/schema/invite.schema";
import type { BaseResponse, StatusResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

// Build query params cho lấy danh sách lời mời
const buildInviteParams = (params?: UseInviteParams) => {
  if (!params) return undefined;
  const cleaned: Record<string, unknown> = {};

  if (params.status) cleaned.status = params.status;
  if (params.receivedPage !== undefined) cleaned.receivedPage = params.receivedPage;
  if (params.receivedSize !== undefined) cleaned.receivedSize = params.receivedSize;
  if (params.sentPage !== undefined) cleaned.sentPage = params.sentPage;
  if (params.sentSize !== undefined) cleaned.sentSize = params.sentSize;

  return cleaned;
};

// 🔹 Tạo lời mời (Leader only)
const createInvite = async (data: TCreateInvite) => await apiRequest.post<BaseResponse<TInvite>>(API_SUFFIX.INVITE_API, data);

// 🔹 Lấy lời mời của tôi (đã gửi và đã nhận)
const getMyInvites = async (params?: UseInviteParams) =>
  await apiRequest.get<BaseResponse<TInviteList>>(API_SUFFIX.MY_INVITES_API, { params: buildInviteParams(params) });

// 🔹 Phản hồi lời mời (Accept/Decline)
const respondToInvite = async (inviteId: number, data: TRespondInvite) =>
  await apiRequest.patch<StatusResponse>(`${API_SUFFIX.INVITE_API}/${inviteId}`, data);

// 🔹 Hủy lời mời đã gửi (optional - nếu backend support)
const cancelInvite = async (inviteId: number) => await apiRequest.delete<StatusResponse>(`${API_SUFFIX.INVITE_API}/${inviteId}`);

export const inviteApi = {
  createInvite,
  getMyInvites,
  respondToInvite,
  cancelInvite,
};
