import { postApi } from "@/apis/post.api";
import type { TCreatePost, TUpdatePost } from "@/schema/post.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Hook quản lý các thao tác bài đăng (post)
 * - Lấy danh sách, chi tiết, theo loại
 * - Tạo, cập nhật, xóa bài đăng
 */
export const usePostHook = () => {
  /** Lấy tất cả bài đăng */
  const useGetAllPosts = () =>
    useQuery({
      queryKey: ["allPosts"],
      queryFn: () => postApi.getAllPosts(),
    });

  /** Lấy bài đăng theo ID */
  const useGetPostById = (id: number) =>
    useQuery({
      queryKey: ["postDetail", id],
      queryFn: () => postApi.getPostById(id),
      enabled: !!id,
    });

  /** Lấy bài đăng theo loại (FIND_GROUP hoặc FIND_MEMBER) */
  const useGetPostsByType = (type: "FIND_GROUP" | "FIND_MEMBER") =>
    useQuery({
      queryKey: ["postsByType", type],
      queryFn: () => postApi.getPostsByType(type),
      enabled: !!type,
    });

  /** Tạo bài đăng mới */
  const useCreatePost = () =>
    useMutation({
      mutationFn: (data: TCreatePost) => postApi.createPost(data),
      retry: false,
      onSuccess: () => {
        console.log("Post created successfully");
      },
      onError: (error: unknown) => {
        console.error("Mutation error:", error);
        if (error && typeof error === "object" && "response" in error) {
          console.error("Error details:", (error as { response: unknown }).response);
        }
      },
    });

  /** Cập nhật bài đăng */
  const useUpdatePost = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: TUpdatePost }) => postApi.updatePost(id, data),
    });

  /** Xóa bài đăng */
  const useDeletePost = () =>
    useMutation({
      mutationFn: (id: number) => postApi.deletePost(id),
    });

  return {
    useGetAllPosts,
    useGetPostById,
    useGetPostsByType,
    useCreatePost,
    useUpdatePost,
    useDeletePost,
  };
};
