import { apiRequest } from "@/lib/http";
import type { TGroup } from "@/schema/group.schema";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getGroupList = async (params?: any) => await apiRequest.get<BaseResponse<PaginationResponse<TGroup[]>>>(API_SUFFIX.GROUP_API, { params });
const getGroup = async (id: number) => await apiRequest.get<BaseResponse<TGroup>>(API_SUFFIX.GROUP_API + `/${id}`);
const updateGroup = async (id: number, data: TGroup) => await apiRequest.put<BaseResponse<TGroup>>(API_SUFFIX.GROUP_API + `/${id}`, data);
const createGroup = async (data: TGroup) => await apiRequest.post<BaseResponse<TGroup>>(API_SUFFIX.GROUP_API, data);
const deleteGroup = async (id: number) => await apiRequest.delete<BaseResponse<null>>(API_SUFFIX.GROUP_API + `/${id}`);
export const groupApi = {
  getGroupList,
  getGroup,
  updateGroup,
  createGroup,
  deleteGroup,
};
