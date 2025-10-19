import { apiRequest } from "@/lib/http";
import type { TUpdateUserSchema, TUser } from "@/schema/user.schema";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getUserById = async (id: number) => await apiRequest.get<BaseResponse<TUser>>(API_SUFFIX.USER_API + `/${id}`);
const getMyProfile = async () => await apiRequest.get<BaseResponse<TUser>>(API_SUFFIX.MY_PROFILE_API);
const getUserList = async (params?: any) => await apiRequest.get<BaseResponse<PaginationResponse<TUser[]>>>(API_SUFFIX.USER_API, { params });
const updateStatus = async (id: number) => await apiRequest.patch<BaseResponse<TUser>>(API_SUFFIX.USER_API + `/${id}`);
const updateUser = async (id: number, data: TUpdateUserSchema) => await apiRequest.put<BaseResponse<TUser>>(API_SUFFIX.USER_API + `/${id}`, data);
const updateMyProfile = async (data: TUpdateUserSchema) => await apiRequest.put<BaseResponse<TUser>>(API_SUFFIX.MY_PROFILE_API, data);
const updateRoleToLecturer = async (id: number) => await apiRequest.patch<BaseResponse<TUser>>(API_SUFFIX.USER_API + `/role/${id}`);
const toggleLecturerModeratorRole = async (id: number) => await apiRequest.patch<BaseResponse<TUser>>(`${API_SUFFIX.USER_API}/role/${id}`, {});
export const userApi = {
  getUserById,
  getMyProfile,
  getUserList,
  updateStatus,
  updateUser,
  updateMyProfile,
  updateRoleToLecturer,
  toggleLecturerModeratorRole,
};
