import { apiRequest } from "@/lib/http";
import type { TCreateIdea, TIdea, TUpdateIdea } from "@/schema/ideas.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getIdeaList = async (id: number) => await apiRequest.get<BaseResponse<TIdea[]>>(API_SUFFIX.IDEA_GROUP_API + `/${id}`);
const createIdea = async (data: TCreateIdea) => await apiRequest.post<BaseResponse<TIdea>>(API_SUFFIX.IDEA_API, data);
const updateIdea = async (id: number, data: TUpdateIdea) => await apiRequest.put<BaseResponse<TIdea>>(API_SUFFIX.IDEA_API + `/${id}`, data);
const deleteIdea = async (id: number) => await apiRequest.delete<BaseResponse<null>>(API_SUFFIX.IDEA_API + `/${id}`);
const getAllIdeas = async () => await apiRequest.get<BaseResponse<TIdea[]>>(API_SUFFIX.IDEA_API);
export const ideaApi = {
  getIdeaList,
  createIdea,
  updateIdea,
  deleteIdea,
  getAllIdeas
};
