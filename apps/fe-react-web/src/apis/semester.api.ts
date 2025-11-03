import { apiRequest } from "@/lib/http";
import type { TCreateSemester, TSemester, TUpdateSemester } from "@/schema/semester.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getSemesterList = async () => await apiRequest.get<BaseResponse<TSemester[]>>(API_SUFFIX.SEMESTER_API);
const createSemester = async (data: TCreateSemester) => await apiRequest.post<BaseResponse<TSemester>>(API_SUFFIX.SEMESTER_API, data);
const updateStatusSemester = async (id: number) => await apiRequest.patch<BaseResponse<TSemester>>(API_SUFFIX.SEMESTER_API + `/${id}/active`);
const updateSemester = async (id: number, data: TUpdateSemester) =>
  await apiRequest.put<BaseResponse<TSemester>>(API_SUFFIX.SEMESTER_API + `/${id}`, data);
const completeSemester = async (id: number) => await apiRequest.put<BaseResponse<TSemester>>(API_SUFFIX.SEMESTER_API + `/${id}/complete`);

export const semesterApi = {
  getSemesterList,
  createSemester,
  updateStatusSemester,
  updateSemester,
  completeSemester,
};
