import { inviteApi } from "@/apis/invite.api";
import type { TCreateInvite, TRespondInvite, UseInviteParams } from "@/schema/invite.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useInviteHook = () => {
  const queryClient = useQueryClient();

  // 🔹 Lấy danh sách lời mời của tôi (đã gửi và đã nhận)
  const useMyInvites = (params?: UseInviteParams, enabled: boolean = true) => {
    const {
      status = params?.status,
      receivedPage = params?.receivedPage || 1,
      receivedSize = params?.receivedSize || 10,
      sentPage = params?.sentPage || 1,
      sentSize = params?.sentSize || 10,
    } = params || {};

    return useQuery({
      queryKey: ["myInvites", { status, receivedPage, receivedSize, sentPage, sentSize }],
      queryFn: () => inviteApi.getMyInvites({ status, receivedPage, receivedSize, sentPage, sentSize }),
      staleTime: 1000 * 60 * 5, // 5 phút
      gcTime: 1000 * 60 * 10, // 10 phút
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      enabled,
    });
  };

  // 🔹 Tạo lời mời mới (Leader only)
  const useCreateInvite = () => {
    return useMutation({
      mutationFn: (data: TCreateInvite) => inviteApi.createInvite(data),
      onSuccess: async () => {
        // Invalidate danh sách lời mời đã gửi
        await queryClient.invalidateQueries({ queryKey: ["myInvites"] });
      },
    });
  };

  // 🔹 Phản hồi lời mời (Accept/Decline)
  const useRespondToInvite = () => {
    return useMutation({
      mutationFn: ({ inviteId, data }: { inviteId: number; data: TRespondInvite }) => inviteApi.respondToInvite(inviteId, data),
      onSuccess: async () => {
        // Invalidate danh sách lời mời và nhóm của tôi (vì có thể đã join vào group mới)
        await Promise.allSettled([
          queryClient.invalidateQueries({ queryKey: ["myInvites"] }),
          queryClient.invalidateQueries({ queryKey: ["myGroup"] }),
          queryClient.invalidateQueries({ queryKey: ["groupMembers"] }),
        ]);
      },
    });
  };

  // 🔹 Hủy lời mời đã gửi
  const useCancelInvite = () => {
    return useMutation({
      mutationFn: (inviteId: number) => inviteApi.cancelInvite(inviteId),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["myInvites"] });
      },
    });
  };

  return {
    useMyInvites,
    useCreateInvite,
    useRespondToInvite,
    useCancelInvite,
  };
};
