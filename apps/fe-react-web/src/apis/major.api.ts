import { apiRequest } from "@/lib/http";
import type { TCreateMajor, TMajor, TUpdateMajor } from "@/schema/major.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getMajorList = async () => await apiRequest.get<BaseResponse<TMajor[]>>(API_SUFFIX.MAJOR_API);
const getMajor = async (id: number) => await apiRequest.get<BaseResponse<TMajor>>(API_SUFFIX.MAJOR_API + `/${id}`);
const updateMajor = async (id: number, data: TUpdateMajor) => await apiRequest.put<BaseResponse<TMajor>>(API_SUFFIX.MAJOR_API + `/${id}`, data);
const createMajor = async (data: TCreateMajor) => await apiRequest.post<BaseResponse<TMajor>>(API_SUFFIX.MAJOR_API, data);
const deleteMajor = async (id: number) => await apiRequest.delete<BaseResponse<null>>(API_SUFFIX.MAJOR_API + `/${id}`);
export const majorApi = {
  getMajorList,
  getMajor,
  updateMajor,
  createMajor,
  deleteMajor,
};
