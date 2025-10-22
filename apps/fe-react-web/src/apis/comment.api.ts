// src/api/comment.api.ts
import { apiRequest } from "@/lib/http";
import type { BaseResponse } from "@/types/response.type";
import type {
  TComment,
  TCreateComment,
  TUpdateComment,
} from "@/schema/comment.schema";
import { API_SUFFIX } from "./util.api";


const getAllComments = async () =>
  await apiRequest.get<BaseResponse<TComment[]>>(API_SUFFIX.COMMENT_API);

const getCommentById = async (id: number) =>
  await apiRequest.get<BaseResponse<TComment>>(
    `${API_SUFFIX.COMMENT_API}/${id}`
  );

const getCommentsByPost = async (postId: number) =>
  await apiRequest.get<BaseResponse<TComment[]>>(
    `${API_SUFFIX.COMMENT_API}/post/${postId}`
  );

const createComment = async (data: TCreateComment) =>
  await apiRequest.post<BaseResponse<TComment>>(API_SUFFIX.COMMENT_API, data);

const updateComment = async (id: number, data: TUpdateComment) =>
  await apiRequest.put<BaseResponse<TComment>>(
    `${API_SUFFIX.COMMENT_API}/${id}`,
    data
  );

const deleteComment = async (id: number) =>
  await apiRequest.delete<BaseResponse<null>>(
    `${API_SUFFIX.COMMENT_API}/${id}`
  );

export const commentApi = {
  getAllComments,
  getCommentById,
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
};
