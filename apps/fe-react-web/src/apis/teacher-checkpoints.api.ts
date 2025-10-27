import { apiRequest } from "@/lib/http";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";
import type { TUser } from "@/schema/user.schema";
import type { TCheckPointsRequest, TCheckPointsRequestCreate } from "@/schema/teacher-checkpoints.schema";
import type { TGroup } from "@/schema/group.schema";

const getTeacherList = async () =>
  await apiRequest.get<BaseResponse<TUser[]>>(API_SUFFIX.TEACHER_CHECKPOINT_API + `/teachers`);
const getPendingRequests = async () =>
  await apiRequest.get<BaseResponse<TCheckPointsRequest[]>>(API_SUFFIX.TEACHER_CHECKPOINT_API + `/requests/pending`);
const getUnregisteredGroups = async () =>
  await apiRequest.get<BaseResponse<TGroup[]>>(API_SUFFIX.TEACHER_CHECKPOINT_API + `/groups/unregistered`);
const getRejectedGroups = async () =>
  await apiRequest.get<BaseResponse<TGroup[]>>(API_SUFFIX.TEACHER_CHECKPOINT_API + `/groups/rejected`);
const getApprovedGroups = async () =>
  await apiRequest.get<BaseResponse<TGroup[]>>(API_SUFFIX.TEACHER_CHECKPOINT_API + `/groups/approved`);
const requestTeacherCheckpoint = async (teacherId: number) =>
  await apiRequest.post<BaseResponse<null>>(API_SUFFIX.TEACHER_CHECKPOINT_API + `/teachers/${teacherId}`);
const updateTeacherCheckpointStatus = async (id: number, isAccepted: boolean) =>
  await apiRequest.patch<BaseResponse<null>>(API_SUFFIX.TEACHER_CHECKPOINT_API + `/requests/${id}?isAccepted=${isAccepted}`);
const myRequestTeacherCheckpoint = async (groupId: number) =>
  await apiRequest.get<BaseResponse<TCheckPointsRequestCreate>>(API_SUFFIX.TEACHER_CHECKPOINT_API + `/groups/${groupId}/my-request`);
export const teacher_checkpoints = {
  getTeacherList,
  getPendingRequests,
  getUnregisteredGroups,
  getRejectedGroups,
  getApprovedGroups,
  requestTeacherCheckpoint,
  updateTeacherCheckpointStatus,
  myRequestTeacherCheckpoint,
};
