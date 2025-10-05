import { apiRequest } from "@/lib/http";
import type { TUpdateUserSchema, TUser } from "@/schema/user.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getUser = async (id: number) => await apiRequest.get<BaseResponse<TUser>>(API_SUFFIX.USER_API + `/${id}`);
const getMyProfile = async () => await apiRequest.get<BaseResponse<TUser>>(API_SUFFIX.MY_PROFILE_API);
const getUserList = async () => await apiRequest.get<BaseResponse<TUser[]>>(API_SUFFIX.USER_API);
const updateStatus = async (id: number) => await apiRequest.patch<BaseResponse<TUser>>(API_SUFFIX.USER_API + `/${id}`);
const updateUser = async (id: number, data: TUpdateUserSchema) => await apiRequest.put<BaseResponse<TUser>>(API_SUFFIX.USER_API + `/${id}`, data);
const updateMyProfile = async (data: TUpdateUserSchema) => await apiRequest.put<BaseResponse<TUser>>(API_SUFFIX.MY_PROFILE_API, data);
export const userApi = {
  getUser,
  getMyProfile,
  getUserList,
  updateStatus,
  updateUser,
  updateMyProfile,
};
