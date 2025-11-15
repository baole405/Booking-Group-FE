import { userApi } from "@/apis/user.api";
import type { RootState } from "@/redux/store";
import type { GetUserListParams, TUpdateUserSchema, TUser } from "@/schema/user.schema";
import type { BaseResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export const useUserHook = () => {
  const qc = useQueryClient();
  const userId = useSelector((state: RootState) => state.user.userId);
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
    // Use nullish coalescing to preserve 0 and avoid sending empty strings
    const page = params.page ?? 0;
    const size = params.size ?? 10;
    const role = params.role ?? null;
    const q = params.q ?? params.search ?? undefined;
    const majorCode = params.majorCode ?? null;
    const active = params.active ?? null;
    const sort = params.sort ?? "id";
    const dir = params.dir ?? "asc";

    const queryParams = {
      page: page,
      size: size,
      role: role ? role : undefined,
      q: q,
      majorCode: majorCode ? majorCode : undefined,
      active: active !== null ? active : undefined,
      sort: sort,
      dir: dir,
    };

    console.log("🔍 UserList Query Params:", queryParams);

    return useQuery({
      queryKey: ["userList", { page, size, role, q, majorCode, active, sort, dir }],
      queryFn: async () => {
        const response = await userApi.getUserList(queryParams);
        console.log("📦 UserList Response:", response.data);
        return response.data;
      },
    });
  };
  const useUpdateStatus = (id: number) =>
    useMutation({
      mutationFn: () => userApi.updateStatus(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["userList"] });
        qc.invalidateQueries({ queryKey: ["userdetail", id] });
        qc.invalidateQueries({ queryKey: ["usersNoGroup"] });
      },
    });
  const useUpdateUser = (id: number) =>
    useMutation({
      mutationFn: (data: TUpdateUserSchema) => userApi.updateUser(id, data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["userList"] });
        qc.invalidateQueries({ queryKey: ["userdetail", id] });
      },
    });
  const useUpdateMyProfile = () =>
    useMutation({
      mutationFn: (data: TUpdateUserSchema) => userApi.updateMyProfile(data),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["myProfile"] });
        qc.invalidateQueries({ queryKey: ["userdetail", userId] });
      },
    });
  const useUpdateRoleToLecturer = (id: number) =>
    useMutation({
      mutationFn: () => userApi.updateRoleToLecturer(id),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["userList"] });
        qc.invalidateQueries({ queryKey: ["userdetail", id] });
      },
    });
  const useToggleLecturerModeratorRole = () =>
    useMutation({
      mutationFn: (id: number) => userApi.toggleLecturerModeratorRole(id),
      onSuccess: (_res, id) => {
        qc.invalidateQueries({ queryKey: ["userList"] });
        qc.invalidateQueries({ queryKey: ["userdetail", id] });
      },
    });

  const useUploadAvatar = () =>
    useMutation({
      mutationFn: (file: File) => userApi.uploadAvatar(userId, file),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["myProfile"] });
        qc.invalidateQueries({ queryKey: ["userdetail", userId] });
      },
    });

  const useUploadCV = () =>
    useMutation({
      mutationFn: (file: File) => userApi.uploadCV(userId, file),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["myProfile"] });
        qc.invalidateQueries({ queryKey: ["userdetail", userId] });
      },
    });

  const useUsersNoGroup = () =>
    useQuery({
      queryKey: ["usersNoGroup"],
      queryFn: async () => (await userApi.getUsersNoGroup()).data,
    });

  return {
    useUserById,
    useMyProfile,
    useUserList,
    useUsersNoGroup,
    useUpdateStatus,
    useUpdateUser,
    useUpdateMyProfile,
    useUpdateRoleToLecturer,
    useToggleLecturerModeratorRole,
    useUploadAvatar,
    useUploadCV,
  };
};
