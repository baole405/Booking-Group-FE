import { apiRequest } from "@/lib/http";
import type { TGroup, TJoinGroup, TUpdateInformationGroup, TVoteByGroup, TVoteChoice, UseGroupParams } from "@/schema/group.schema";
import type { TUser } from "@/schema/user.schema";
import type { BaseResponse, PaginationResponse, StatusResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getGroupList = async (params?: UseGroupParams) =>
  await apiRequest.get<BaseResponse<PaginationResponse<TGroup>>>(API_SUFFIX.GROUP_API, { params });
const getGroup = async (id: number) => await apiRequest.get<BaseResponse<TGroup>>(API_SUFFIX.GROUP_API + `/${id}`);
const updateGroup = async (id: number, data: TGroup) => await apiRequest.put<BaseResponse<TGroup>>(API_SUFFIX.GROUP_API + `/${id}`, data);
const createGroup = async (data: TGroup) => await apiRequest.post<BaseResponse<TGroup>>(API_SUFFIX.GROUP_API, data);
const deleteGroup = async (id: number) => await apiRequest.delete<BaseResponse<null>>(API_SUFFIX.GROUP_API + `/${id}`);
const getMyGroup = async () => await apiRequest.get<BaseResponse<TGroup>>(API_SUFFIX.MY_GROUP_API);
const leaveMyGroup = async () => await apiRequest.delete<StatusResponse>(API_SUFFIX.LEAVE_GROUP_API);
const updateGroupInfo = async (data: TUpdateInformationGroup) => await apiRequest.put<BaseResponse<TGroup>>(API_SUFFIX.UPDATE_GROUP_API, data);
const joinGroup = async (groupId: number) => await apiRequest.post<StatusResponse>(API_SUFFIX.JOIN_GROUP_API + `/${groupId}`);
const getUserGroupId = async (id: number) => await apiRequest.get<BaseResponse<TUser[]>>(API_SUFFIX.GROUP_API + `/${id}/members`);
const removeUserFromGroup = async (userId: number) => await apiRequest.delete<StatusResponse>(API_SUFFIX.GROUP_MEMBER_API + `/${userId}`);
const getGroupLeader = async (groupId: number) => await apiRequest.get<BaseResponse<TUser>>(API_SUFFIX.GROUP_API + `/${groupId}/leader`);
const transferLeader = async (newLeaderId: number) => await apiRequest.patch<StatusResponse>(API_SUFFIX.TRANSFER_LEADER_API + `/${newLeaderId}`);
const getPendingJoinRequests = async (groupId: number) =>
  await apiRequest.get<BaseResponse<TJoinGroup[]>>(API_SUFFIX.JOIN_GROUP_API + `/${groupId}/pending`);
const finalizeGroup = async () => await apiRequest.patch<StatusResponse>(API_SUFFIX.DONE_GROUP_API);
const changeGroupType = async () => await apiRequest.patch<StatusResponse>(API_SUFFIX.CHANGE_TYPE_GROUP_API);
const getMyJoinRequests = async () => await apiRequest.get<BaseResponse<TJoinGroup[]>>(API_SUFFIX.MY_JOIN_GROUP_API);
const choiceVote = async (voteId: number, choiceValue: "YES" | "NO") =>
  await apiRequest.post<StatusResponse>(API_SUFFIX.VOTE_API + `/${voteId}/choice`, {
    choiceValue,
  });
const getVotesByVoteId = async (voteId: number) => await apiRequest.get<BaseResponse<TVoteChoice[]>>(API_SUFFIX.VOTE_API + `/${voteId}/choices`);
const getVoteByGroupId = async (groupId: number) => await apiRequest.get<BaseResponse<TVoteByGroup[]>>(API_SUFFIX.VOTE_BY_GROUP_API + `/${groupId}`);
const createGroupWithSemester = async (size: number, semesterId: number) =>
  await apiRequest.post<BaseResponse<TGroup>>(API_SUFFIX.GROUP_API + `?size=${size}&semesterId=${semesterId}`, {});

export const groupApi = {
  getGroupList,
  getGroup,
  updateGroup,
  createGroup,
  deleteGroup,
  getMyGroup,
  leaveMyGroup,
  updateGroupInfo,
  joinGroup,
  getUserGroupId,
  removeUserFromGroup,
  getGroupLeader,
  transferLeader,
  getPendingJoinRequests,
  finalizeGroup,
  changeGroupType,
  getMyJoinRequests,
  choiceVote,
  getVotesByVoteId,
  getVoteByGroupId,
  createGroupWithSemester,
};
