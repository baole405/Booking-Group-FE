// src/hooks/use-comment.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "@/apis/comment.api";
import type {
  TCreateComment,
  TUpdateComment,
} from "@/schema/comment.schema";


export const useCommentHook = () => {
  const qc = useQueryClient();

  /** Lấy tất cả comments */
  const useGetAllComments = () =>
    useQuery({
      queryKey: ["comments"],
      queryFn: () => commentApi.getAllComments(),
    });

  /** Lấy comment theo ID */
  const useGetCommentById = (id: number) =>
    useQuery({
      queryKey: ["comment", id],
      queryFn: () => commentApi.getCommentById(id),
      enabled: !!id,
    });

  /** Lấy comments theo postId */
  const useGetCommentsByPost = (postId: number) =>
    useQuery({
      queryKey: ["commentsByPost", postId],
      queryFn: () => commentApi.getCommentsByPost(postId),
      enabled: !!postId,
    });

  /** Tạo comment */
  const useCreateComment = () =>
    useMutation({
      mutationFn: (data: TCreateComment) => commentApi.createComment(data),
      onSuccess: (_res, vars) => {
        qc.invalidateQueries({ queryKey: ["comments"] });
        // Làm tươi danh sách theo post nếu có postId
        if (vars.postId) {
          qc.invalidateQueries({ queryKey: ["commentsByPost", vars.postId] });
        }
      },
    });

  /** Cập nhật comment */
  const useUpdateComment = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: TUpdateComment }) =>
        commentApi.updateComment(id, data),
      onSuccess: (_res, vars) => {
        qc.invalidateQueries({ queryKey: ["comment", vars.id] });
        qc.invalidateQueries({ queryKey: ["comments"] });
        // Không biết postId ở đây, nếu cần có thể truyền thêm để invalidate cụ thể
        qc.invalidateQueries({ queryKey: ["commentsByPost"] });
      },
    });

  /** Xoá comment */
  const useDeleteComment = () =>
    useMutation({
      mutationFn: (id: number) => commentApi.deleteComment(id),
      onSuccess: (_res, id) => {
        qc.invalidateQueries({ queryKey: ["comment", id] });
        qc.invalidateQueries({ queryKey: ["comments"] });
        qc.invalidateQueries({ queryKey: ["commentsByPost"] });
      },
    });

  return {
    useGetAllComments,
    useGetCommentById,
    useGetCommentsByPost,
    useCreateComment,
    useUpdateComment,
    useDeleteComment,
  };
};
