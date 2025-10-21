// src/apis/post.api.ts
import { apiRequest } from "@/lib/http";
import type {  TCreatePost, TPost, TUpdatePost } from "@/schema/post.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getAllPosts = async () =>
  await apiRequest.get<BaseResponse<TPost[]>>(API_SUFFIX.POST_API);

const getPostById = async (id: number) =>
  await apiRequest.get<BaseResponse<TPost>>(API_SUFFIX.POST_API + `/${id}`);

const getPostsByType = async (type: "FIND_GROUP" | "FIND_MEMBER") =>
  await apiRequest.get<BaseResponse<TPost[]>>(API_SUFFIX.POST_API + `/type/${type}`);

const createPost = async (data: TCreatePost) =>
  await apiRequest.post<BaseResponse<TPost>>(API_SUFFIX.POST_API, data);

const updatePost = async (id: number, data: TUpdatePost) =>
  await apiRequest.put<BaseResponse<TPost>>(API_SUFFIX.POST_API + `/${id}`, data);

const deletePost = async (id: number) =>
  await apiRequest.delete<BaseResponse<null>>(API_SUFFIX.POST_API + `/${id}`);

export const postApi = {
  getAllPosts,
  getPostById,
  getPostsByType,
  createPost,
  updatePost,
  deletePost,
};
