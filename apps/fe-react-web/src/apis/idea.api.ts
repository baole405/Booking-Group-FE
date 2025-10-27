import { apiRequest } from "@/lib/http";
import type { TCreateIdea, TIdea, TUpdateIdea, TRejectIdea } from "@/schema/ideas.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getIdeaList = async (id: number) => await apiRequest.get<BaseResponse<TIdea[]>>(API_SUFFIX.IDEA_GROUP_API + `/${id}`);
const createIdea = async (data: TCreateIdea) => await apiRequest.post<BaseResponse<TIdea>>(API_SUFFIX.IDEA_API, data);
const updateIdea = async (id: number, data: TUpdateIdea) => await apiRequest.put<BaseResponse<TIdea>>(API_SUFFIX.IDEA_API + `/${id}`, data);
const deleteIdea = async (id: number) => await apiRequest.delete<BaseResponse<null>>(API_SUFFIX.IDEA_API + `/${id}`);
const getAllIdeas = async () => await apiRequest.get<BaseResponse<TIdea[]>>(API_SUFFIX.IDEA_API);
const submitIdea = async (id: number) => await apiRequest.patch<BaseResponse<null>>(API_SUFFIX.IDEA_API + `/${id}/submit`);
const approveIdea = async (id: number) => await apiRequest.patch<BaseResponse<null>>(API_SUFFIX.IDEA_API + `/${id}/approve`);
const rejectIdea = async (id: number, data: TRejectIdea) =>
  await apiRequest.patch<BaseResponse<null>>(API_SUFFIX.IDEA_API + `/${id}/reject?reason=${data.reason}`);

export const ideaApi = {
  getIdeaList,
  createIdea,
  updateIdea,
  deleteIdea,
  getAllIdeas,
  submitIdea,
  approveIdea,
  rejectIdea,
};
