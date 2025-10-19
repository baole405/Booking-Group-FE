import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupApi } from "@/apis/group.api";
import type { TUpdateInformationGroup, UseGroupParams } from "@/schema/group.schema";

export const useGroupHook = () => {
  // 🔹 Lấy danh sách nhóm (phân trang, lọc, tìm kiếm)
  const useGroupList = (params: UseGroupParams) => {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sort = params.sort || "id",
      dir = params.dir || "asc",
      status = params.status || null,
      type = params.type || null,
      q = params.q || "",
    } = params;

    return useQuery({
      queryKey: ["groupList", { page, size, sort, dir, status, type, q }],
      queryFn: () => groupApi.getGroupList({ page, size, sort, dir, status, type, q }),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    });
  };

  // 🔹 Lấy chi tiết nhóm theo ID (dùng cho xem detail)
  const useGroupById = (id: number) =>
    useQuery({
      queryKey: ["groupDetail", id],
      queryFn: () => groupApi.getGroup(id),
      retry: false,
      enabled: !!id, // chỉ chạy khi id tồn tại
    });

  // 🔹 Lấy nhóm hiện tại mà user đang thuộc về
  const useMyGroup = () =>
    useQuery({
      queryKey: ["myGroup"],
      queryFn: () => groupApi.getMyGroup(),
      retry: false,
      refetchOnMount: "always",
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      staleTime: 0,
    });

  // 🔹 Lấy danh sách thành viên trong một nhóm cụ thể
  const useGroupMembers = (groupId: number) =>
    useQuery({
      queryKey: ["groupMembers", groupId],
      queryFn: () => groupApi.getUserGroupId(groupId),
      enabled: !!groupId,
      retry: false,
    });

  // 🔹 Tham gia một nhóm
  const useJoinGroup = () => {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: (groupId: number) => groupApi.joinGroup(groupId),
      onSuccess: async () => {
        await Promise.allSettled([
          qc.invalidateQueries({ queryKey: ["myGroup"] }),
          qc.invalidateQueries({ queryKey: ["groupList"] }),
          qc.invalidateQueries({ queryKey: ["groupMembers"] }),
        ]);
      },
    });
  };

  // 🔹 Rời khỏi nhóm hiện tại
  const useLeaveMyGroup = () => {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: () => groupApi.leaveMyGroup(),
      onSuccess: async () => {
        // Xóa cache cũ
        qc.removeQueries({ queryKey: ["myGroup"] });
        qc.removeQueries({ queryKey: ["myGroupMembers"] });

        // Cập nhật lại cache để UI phản ứng ngay
        qc.setQueryData(["myGroup"], () => ({ data: { data: null } }));

        await Promise.allSettled([
          qc.invalidateQueries({ queryKey: ["myGroup"] }),
          qc.invalidateQueries({ queryKey: ["groupList"] }),
          qc.invalidateQueries({ queryKey: ["groupMembers"] }),
        ]);
      },
    });
  };

  // 🔹 Cập nhật thông tin nhóm
  const useUpdateGroupInfo = () => {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: (data: TUpdateInformationGroup) => groupApi.updateGroupInfo(data),

      onMutate: async (newData) => {
        await qc.cancelQueries({ queryKey: ["myGroup"] });
        const previousData = qc.getQueryData(["myGroup"]);

        qc.setQueryData(["myGroup"], (old: any) => {
          if (!old?.data?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: {
                ...old.data.data,
                title: newData.title,
                description: newData.description,
              },
            },
          };
        });

        return { previousData };
      },

      onError: (err, _, context) => {
        if (context?.previousData) {
          qc.setQueryData(["myGroup"], context.previousData);
        }
        console.error("❌ Update group info failed:", err);
      },

      onSuccess: async () => {
        await Promise.allSettled([
          qc.invalidateQueries({ queryKey: ["myGroup"] }),
          qc.invalidateQueries({ queryKey: ["groupList"] }),
          qc.invalidateQueries({ queryKey: ["groupMembers"] }),
        ]);
      },
    });
  };

  const useRemoveUserFromGroup = () => {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: (userId: number) => groupApi.removeUserFromGroup(userId),
      onSuccess: async () => {
        await Promise.allSettled([
          qc.invalidateQueries({ queryKey: ["myGroup"] }),
          qc.invalidateQueries({ queryKey: ["groupList"] }),
          qc.invalidateQueries({ queryKey: ["groupMembers"] }),
        ]);
      },
    });
  };

  const useGetGroupLeader = (groupId: number) => {
    return useQuery({
      queryKey: ["groupLeader", groupId],
      queryFn: () => groupApi.getGroupLeader(groupId),
      enabled: !!groupId,
      retry: false,
    });
  };
  const useTransferLeader = () => {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: ({ newLeaderId }: { newLeaderId: number }) =>
        groupApi.transferLeader(newLeaderId),

      onSuccess: async () => {
        await Promise.allSettled([
          qc.invalidateQueries({ queryKey: ["groupLeader"] }),
          qc.invalidateQueries({ queryKey: ["groupMembers"] }),
          qc.invalidateQueries({ queryKey: ["myGroup"] }),
        ]);
      },
    });
  };


  return {
    useGroupList,
    useGroupById,
    useMyGroup,
    useGroupMembers,
    useJoinGroup,
    useLeaveMyGroup,
    useUpdateGroupInfo,
    useRemoveUserFromGroup,
    useGetGroupLeader,
    useTransferLeader,
  };
};
