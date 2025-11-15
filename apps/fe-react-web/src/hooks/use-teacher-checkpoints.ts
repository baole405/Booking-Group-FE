import { teacher_checkpoints } from "@/apis/teacher-checkpoints.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTeacherCheckpointsHook = () => {
  const qc = useQueryClient();
  /** Lấy danh sách giảng viên có thể chọn */
  const useTeacherList = () =>
    useQuery({
      queryKey: ["teacherList"],
      queryFn: () => teacher_checkpoints.getTeacherList(),
    });

  /** Lấy danh sách yêu cầu đang chờ xét duyệt */
  const usePendingRequests = () =>
    useQuery({
      queryKey: ["pendingRequests"],
      queryFn: () => teacher_checkpoints.getPendingRequests(),
      select: (data) => {
        // Deduplicate requests by id
        if (!data?.data?.data) return data;
        const uniqueRequests = Array.from(new Map(data.data.data.map((request) => [request.id, request])).values());
        return {
          ...data,
          data: {
            ...data.data,
            data: uniqueRequests,
          },
        };
      },
    });

  /** Lấy danh sách nhóm chưa đăng ký giảng viên */
  const useUnregisteredGroups = () =>
    useQuery({
      queryKey: ["unregisteredGroups"],
      queryFn: () => teacher_checkpoints.getUnregisteredGroups(),
      select: (data) => {
        // Deduplicate groups by id
        if (!data?.data?.data) return data;
        const uniqueGroups = Array.from(new Map(data.data.data.map((group) => [group.id, group])).values());
        return {
          ...data,
          data: {
            ...data.data,
            data: uniqueGroups,
          },
        };
      },
    });

  /** Lấy danh sách nhóm bị từ chối */
  const useRejectedGroups = () =>
    useQuery({
      queryKey: ["rejectedGroups"],
      queryFn: () => teacher_checkpoints.getRejectedGroups(),
      select: (data) => {
        // Deduplicate groups by id
        if (!data?.data?.data) return data;
        const uniqueGroups = Array.from(new Map(data.data.data.map((group) => [group.id, group])).values());
        return {
          ...data,
          data: {
            ...data.data,
            data: uniqueGroups,
          },
        };
      },
    });

  /** Lấy danh sách nhóm được chấp nhận */
  const useApprovedGroups = () =>
    useQuery({
      queryKey: ["approvedGroups"],
      queryFn: () => teacher_checkpoints.getApprovedGroups(),
      select: (data) => {
        // Deduplicate groups by id
        if (!data?.data?.data) return data;
        const uniqueGroups = Array.from(new Map(data.data.data.map((group) => [group.id, group])).values());
        return {
          ...data,
          data: {
            ...data.data,
            data: uniqueGroups,
          },
        };
      },
    });

  /** Gửi yêu cầu chọn giảng viên */
  const useRequestTeacherCheckpoint = () =>
    useMutation({
      mutationFn: (teacherId: number) => teacher_checkpoints.requestTeacherCheckpoint(teacherId),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["pendingRequests"] });
        qc.invalidateQueries({ queryKey: ["unregisteredGroups"] });
        qc.invalidateQueries({ queryKey: ["myRequestTeacherCheckpoint"] });
        qc.invalidateQueries({ queryKey: ["myGroup"] });
      },
    });

  /** Cập nhật trạng thái yêu cầu (chấp nhận/từ chối) */
  const useUpdateTeacherCheckpointStatus = () =>
    useMutation({
      mutationFn: ({ id, isAccepted }: { id: number; isAccepted: boolean }) => teacher_checkpoints.updateTeacherCheckpointStatus(id, isAccepted),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["pendingRequests"] });
        qc.invalidateQueries({ queryKey: ["approvedGroups"] });
        qc.invalidateQueries({ queryKey: ["rejectedGroups"] });
        qc.invalidateQueries({ queryKey: ["unregisteredGroups"] });
      },
    });

  /** Moderator gán trực tiếp giảng viên vào nhóm (không cần teacher accept) */
  const useAssignTeacherToGroup = () =>
    useMutation({
      mutationFn: ({ groupId, teacherId }: { groupId: number; teacherId: number }) => teacher_checkpoints.assignTeacherToGroup(groupId, teacherId),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["unregisteredGroups"] });
        qc.invalidateQueries({ queryKey: ["approvedGroups"] });
        qc.invalidateQueries({ queryKey: ["groupList"] });
      },
    });

  /** Lấy yêu cầu giảng viên chấm của nhóm hiện tại */
  const useMyRequestTeacherCheckpoint = (groupId: number | null) => {
    const query = useQuery({
      queryKey: ["myRequestTeacherCheckpoint", groupId],
      queryFn: () => teacher_checkpoints.myRequestTeacherCheckpoint(groupId as number),
      enabled: !!groupId, // Chỉ gọi API khi có groupId
      retry: (failureCount, error) => {
        // Không retry nếu là 404 (không có request)
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status === 404) {
          return false;
        }
        return failureCount < 2;
      },
    });

    // Trả về thêm các utility function để check trạng thái
    // API trả về object trực tiếp, không phải array
    const currentRequest = query.data?.data?.data ?? null;

    return {
      ...query,
      currentRequest,
      hasActiveRequest: !!currentRequest,
      canSendNewRequest: !currentRequest || currentRequest.status === "REJECTED",
      isPending: currentRequest?.status === "PENDING",
      isApproved: currentRequest?.status === "ACCEPTED",
      isRejected: currentRequest?.status === "REJECTED",
    };
  };

  return {
    useTeacherList,
    usePendingRequests,
    useUnregisteredGroups,
    useRejectedGroups,
    useApprovedGroups,
    useRequestTeacherCheckpoint,
    useUpdateTeacherCheckpointStatus,
    useMyRequestTeacherCheckpoint,
    useAssignTeacherToGroup,
  };
};
