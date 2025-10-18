import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { groupApi } from "@/apis/group.api";
import type { TUpdateInformationGroup, UseGroupParams } from "@/schema/group.schema";

export const useGroupHook = () => {
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
      queryFn: () =>
        groupApi.getGroupList({ page, size, sort, dir, status, type, q }),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    });
  };

  const useGroupById = (id: number) =>
    useQuery({
      queryKey: ["groupdetail", id],
      queryFn: () => groupApi.getGroup(id),
      retry: false,
    });

  const useMyGroup = () =>
    useQuery({
      queryKey: ["myGroup"],
      queryFn: () => groupApi.getMyGroup(),
      retry: false,
      refetchOnMount: "always", // 🔹 luôn fetch lại khi vào trang
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      staleTime: 0, // 🔹 luôn coi là stale
    });

  const useLeaveMyGroup = () => {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: () => groupApi.leaveMyGroup(),
      onSuccess: async () => {
        // Xóa cache cũ
        qc.removeQueries({ queryKey: ["myGroup"] });
        qc.removeQueries({ queryKey: ["myGroupMembers"] });

        // Đặt myGroup về null để UI phản ứng tức thì
        qc.setQueryData(["myGroup"], () => ({ data: { data: null } }));

        // Invalidate các vùng liên quan
        await Promise.allSettled([
          qc.invalidateQueries({ queryKey: ["myGroup"] }),
          qc.invalidateQueries({ queryKey: ["myGroupMembers"] }),
          qc.invalidateQueries({ queryKey: ["groupList"] }),
        ]);
      },
    });
  };

  const useUpdateGroupInfo = () => {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: (data: TUpdateInformationGroup) => groupApi.updateGroupInfo(data),

      onMutate: async (newData) => {
        // ⚡ Hủy refetch tạm thời để tránh ghi đè dữ liệu cũ
        await qc.cancelQueries({ queryKey: ["myGroup"] });

        // ⚡ Lấy snapshot cache cũ để rollback nếu lỗi
        const previousData = qc.getQueryData(["myGroup"]);

        // ⚡ Update cache local ngay để phản ứng nhanh trên UI
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

        // Return snapshot để rollback nếu cần
        return { previousData };
      },

      onError: (err, _, context) => {
        // ⚠️ Rollback cache nếu lỗi
        if (context?.previousData) {
          qc.setQueryData(["myGroup"], context.previousData);
        }
        console.error("❌ Update group info failed:", err);
      },

      onSuccess: async () => {
        // ✅ Invalidate queries để refresh chính xác
        await Promise.allSettled([
          qc.invalidateQueries({ queryKey: ["myGroup"] }),
          qc.invalidateQueries({ queryKey: ["groupList"] }),
          qc.invalidateQueries({ queryKey: ["myGroupMembers"] }),
        ]);
      },
    });
  };

  const useJoinGroup = () => {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: (groupId: number) => groupApi.joinGroup(groupId),
      onSuccess: async () => {
        await Promise.allSettled([
          qc.invalidateQueries({ queryKey: ["myGroup"] }),
          qc.invalidateQueries({ queryKey: ["groupList"] }),
        ]);
      },
    });
  };

  return {
    useGroupList,
    useGroupById,
    useMyGroup,
    useLeaveMyGroup,
    useUpdateGroupInfo,
    useJoinGroup,
  };
};
