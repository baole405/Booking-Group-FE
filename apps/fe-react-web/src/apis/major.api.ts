import { apiRequest } from "@/lib/http";
import type { TMajor } from "@/schema/major.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getMajorList = async () => await apiRequest.get<BaseResponse<TMajor[]>>(API_SUFFIX.MAJOR_API);
const getMajor = async (code: string) => await apiRequest.get<BaseResponse<TMajor>>(API_SUFFIX.MAJOR_API + `/${code}`);
const updateMajor = async (code: string, data: TMajor) => await apiRequest.put<BaseResponse<TMajor>>(API_SUFFIX.MAJOR_API + `/${code}`, data);
const createMajor = async (data: TMajor) => await apiRequest.post<BaseResponse<TMajor>>(API_SUFFIX.MAJOR_API, data);
const deleteMajor = async (code: string) => await apiRequest.delete<BaseResponse<null>>(API_SUFFIX.MAJOR_API + `/${code}`);
export const majorApi = {
  getMajorList,
  getMajor,
  updateMajor,
  createMajor,
  deleteMajor,
};
