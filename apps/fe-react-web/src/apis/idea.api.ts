import { apiRequest } from "@/lib/http";
import type { TIdea } from "@/schema/ideas.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getIdeaList = async (id: number) => await apiRequest.get<BaseResponse<TIdea[]>>(API_SUFFIX.IDEA_GROUP_API + `/${id}`);
export const ideaApi = {
  getIdeaList,
};
