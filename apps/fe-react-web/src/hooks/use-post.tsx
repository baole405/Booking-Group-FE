// src/hooks/use-post.tsx
import { postApi } from "@/apis/post.api";
import type { TCreatePost, TUpdatePost, TPost } from "@/schema/post.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

/** Mock data khi BE lỗi 500 — khớp với cấu trúc backend trả về */
const MOCK_POSTS: TPost[] = [
  {
    id: 1,
    user: {
      id: 1,
      studentCode: "SE001",
      fullName: "Nguyễn Văn A",
      email: "a@student.fpt.edu.vn",
      cvUrl: null,
      avatarUrl: null,
      major: {
        id: 1,
        name: "Software Engineering",
      },
      role: "STUDENT",
      isActive: true,
    },
    group: {
      id: 1,
      title: "Group 1",
      description: "Đồ án Web bán nước hoa",
      semester: {
        id: 1,
        name: "Spring 2025",
        active: true,
      },
      type: "PUBLIC",
      status: "ACTIVE",
      createdAt: new Date("2025-10-20T10:00:00Z"),
    },
    content: "Nhóm đang tìm thêm 1 backend developer (mock data).",
    type: "FIND_MEMBER",
    createdAt: new Date("2025-10-21T18:42:08.622Z").toISOString(),
  },
  {
    id: 2,
    user: {
      id: 2,
      studentCode: "SE002",
      fullName: "Trần Thị B",
      email: "b@student.fpt.edu.vn",
      cvUrl: null,
      avatarUrl: null,
      major: {
        id: 2,
        name: "Artificial Intelligence",
      },
      role: "STUDENT",
      isActive: true,
    },
    group: {
      id: 2,
      title: "AI Vision Team",
      description: "Nhóm làm dự án nhận diện khuôn mặt bằng CNN.",
      semester: {
        id: 1,
        name: "Spring 2025",
        active: true,
      },
      type: "PRIVATE",
      status: "FORMING",
      createdAt: new Date("2025-10-19T09:00:00Z"),
    },
    content: "Mình đang tìm nhóm AI để tham gia (mock data).",
    type: "FIND_GROUP",
    createdAt: new Date("2025-10-21T18:42:08.622Z").toISOString(),
  },
];

export const usePostHook = () => {
  /** Lấy tất cả bài đăng */
  const useGetAllPosts = () =>
    useQuery({
      queryKey: ["allPosts"],
      queryFn: async () => {
        try {
          return await postApi.getAllPosts();
        } catch (err) {
          const e = err as AxiosError;
          if (e.response?.status === 500) {
            console.warn("⚠️ Server 500 — fallback sang mock data.");
            return { data: { data: MOCK_POSTS } };
          }
          throw e;
        }
      },
    });

  /** Lấy bài đăng theo ID */
  const useGetPostById = (id: number) =>
    useQuery({
      queryKey: ["postDetail", id],
      queryFn: async () => {
        try {
          return await postApi.getPostById(id);
        } catch (err) {
          const e = err as AxiosError;
          if (e.response?.status === 500) {
            const mock = MOCK_POSTS.find((p) => p.id === id) ?? null;
            return { data: { data: mock } };
          }
          throw e;
        }
      },
      enabled: !!id,
    });

  /** Lấy bài đăng theo loại (FIND_GROUP hoặc FIND_MEMBER) */
  const useGetPostsByType = (type: "FIND_GROUP" | "FIND_MEMBER") =>
    useQuery({
      queryKey: ["postsByType", type],
      queryFn: async () => {
        try {
          return await postApi.getPostsByType(type);
        } catch (err) {
          const e = err as AxiosError;
          if (e.response?.status === 500) {
            const mock = MOCK_POSTS.filter((p) => p.type === type);
            console.warn("⚠️ Server 500 — dùng mock theo type.");
            return { data: { data: mock } };
          }
          throw e;
        }
      },
      enabled: !!type,
    });

  /** Tạo bài đăng mới */
  const useCreatePost = () =>
    useMutation({
      mutationFn: (data: TCreatePost) => postApi.createPost(data),
    });

  /** Cập nhật bài đăng */
  const useUpdatePost = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: TUpdatePost }) =>
        postApi.updatePost(id, data),
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
