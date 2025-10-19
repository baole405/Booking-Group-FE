import { userApi } from "@/apis/user.api";
import type { GetUserListParams, TUpdateUserSchema, TUser } from "@/schema/user.schema";
import type { BaseResponse } from "@/types/response.type";
import { useMutation, useQuery, type UseQueryOptions } from "@tanstack/react-query";

export const useUserHook = () => {
  const useUserById = (id: number, options?: Omit<UseQueryOptions<BaseResponse<TUser>>, "queryKey" | "queryFn">) =>
    useQuery({
      queryKey: ["userdetail", id],
      queryFn: async () => (await userApi.getUserById(id)).data,
      ...options,
    });
  const useMyProfile = () =>
    useQuery({
      queryKey: ["myProfile"],
      queryFn: async () => (await userApi.getMyProfile()).data,
    });

  const useUserList = (params: GetUserListParams) => {
    const {
      page = params.page || 1,
      size = params.size || 10,
      role = params.role || null,
      q = params.q || "",
      majorCode = params.majorCode || null,
      isActive = params.isActive || null,
      sort = params.sort || "id",
      dir = params.dir || "asc",
    } = params;
    return useQuery({
      queryKey: ["userList", { page, size, role, q, majorCode, isActive, sort, dir }],
      queryFn: async () =>
        (
          await userApi.getUserList({
            page: page,
            size: size,
            role: role,
            q: q,
            majorCode: majorCode,
            isActive: isActive,
            sort: sort,
            dir: dir,
          })
        ).data,
    });
  };
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
  const useUpdateRoleToLecturer = (id: number) =>
    useMutation({
      mutationFn: () => userApi.updateRoleToLecturer(id),
    });
  const useToggleLecturerModeratorRole = () =>
    useMutation({
      mutationFn: (id: number) => userApi.toggleLecturerModeratorRole(id),
    });
  return {
    useUserById,
    useMyProfile,
    useUserList,
    useUpdateStatus,
    useUpdateUser,
    useUpdateMyProfile,
    useUpdateRoleToLecturer,
    useToggleLecturerModeratorRole,
  };
};
