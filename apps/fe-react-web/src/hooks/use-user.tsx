import { userApi } from "@/apis/user.api";
import type { TUpdateUserSchema } from "@/schema/user.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

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
  const useUserList = () =>
    useQuery({
      queryKey: ["userList"],
      queryFn: () => userApi.getUserList(),
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
    useUserList,
    useUpdateStatus,
    useUpdateUser,
    useUpdateMyProfile,
  };
};
