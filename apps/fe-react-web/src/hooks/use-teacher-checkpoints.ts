import { useMutation, useQuery } from "@tanstack/react-query";
import { teacher_checkpoints } from "@/apis/teacher-checkpoints.api";

export const useTeacherCheckpointsHook = () => {
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
    });

  /** Lấy danh sách nhóm chưa đăng ký giảng viên */
  const useUnregisteredGroups = () =>
    useQuery({
      queryKey: ["unregisteredGroups"],
      queryFn: () => teacher_checkpoints.getUnregisteredGroups(),
    });

  /** Lấy danh sách nhóm bị từ chối */
  const useRejectedGroups = () =>
    useQuery({
      queryKey: ["rejectedGroups"],
      queryFn: () => teacher_checkpoints.getRejectedGroups(),
    });

  /** Lấy danh sách nhóm được chấp nhận */
  const useApprovedGroups = () =>
    useQuery({
      queryKey: ["approvedGroups"],
      queryFn: () => teacher_checkpoints.getApprovedGroups(),
    });

  /** Gửi yêu cầu chọn giảng viên */
  const useRequestTeacherCheckpoint = () =>
    useMutation({
      mutationFn: (teacherId: number) => teacher_checkpoints.requestTeacherCheckpoint(teacherId),
    });

  /** Cập nhật trạng thái yêu cầu (chấp nhận/từ chối) */
  const useUpdateTeacherCheckpointStatus = () =>
    useMutation({
      mutationFn: ({ id, isAccepted }: { id: number; isAccepted: boolean }) =>
        teacher_checkpoints.updateTeacherCheckpointStatus(id, isAccepted),
    });

  /** Lấy yêu cầu giảng viên chấm của nhóm hiện tại */
  const useMyRequestTeacherCheckpoint = (groupId: number) => {
    const query = useQuery({
      queryKey: ["myRequestTeacherCheckpoint", groupId],
      queryFn: () => teacher_checkpoints.myRequestTeacherCheckpoint(groupId),
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
  };
};
