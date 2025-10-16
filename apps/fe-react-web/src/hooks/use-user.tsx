import { userApi } from "@/apis/user.api";
import type { TUpdateUserSchema } from "@/schema/user.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

interface UseUserListParams {
  page?: number;
  size?: number;
  role?: "STUDENT" | "LECTURER" | "MODERATOR" | "ADMIN";
  search?: string;
  majorId?: number;
  isActive?: boolean;
  sort?: string;
}

export const useUserHook = () => {
  const useUser = (id: number) =>
    useQuery({
      queryKey: ["user", id],
      queryFn: () => userApi.getUser(id),
    });
  const useMyProfile = () =>
    useQuery({
      queryKey: ["myProfile"],
      queryFn: () => userApi.getMyProfile(),
    });
  const useMyGroupId = (id: number) =>
    useQuery({
      queryKey: ["myGroupId"],
      queryFn: () => userApi.getUserGroupId(id),
    });
  const useUserList = (params?: UseUserListParams) =>
    useQuery({
      queryKey: ["userList", params],
      queryFn: () => userApi.getUserList(params),
    });
  const useUpdateStatus = (id: number) =>
    useMutation({
      mutationFn: () => userApi.updateStatus(id),
    });
  const useUpdateUser = (id: number) =>
    useMutation({
      mutationFn: (data: TUpdateUserSchema) => userApi.updateUser(id, data),
    });
  const useUpdateMyProfile = () =>
    useMutation({
      mutationFn: (data: TUpdateUserSchema) => userApi.updateMyProfile(data),
    });
  return {
    useUser,
    useMyProfile,
    useMyGroupId,
    useUserList,
    useUpdateStatus,
    useUpdateUser,
    useUpdateMyProfile,
  };
};
