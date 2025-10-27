import { useState } from "react";
import { Loader2, Clock, CheckCircle, XCircle, Users } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useTeacherCheckpointsHook } from "@/hooks/use-teacher-checkpoints";
import type { TCheckPointsRequest } from "@/schema/teacher-checkpoints.schema";

// Type for group data from API
interface GroupData {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  semester?: {
    name: string;
  };
}

export default function CheckpointRequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<TCheckPointsRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const {
    usePendingRequests,
    useApprovedGroups,
    useRejectedGroups,
    useUpdateTeacherCheckpointStatus,
  } = useTeacherCheckpointsHook();

  // Fetch data
  const { data: pendingRes, isPending: isPendingLoading, refetch: refetchPending } = usePendingRequests();
  const { data: approvedRes, isPending: isApprovedLoading, refetch: refetchApproved } = useApprovedGroups();
  const { data: rejectedRes, isPending: isRejectedLoading, refetch: refetchRejected } = useRejectedGroups();

  const { mutateAsync: updateStatusAsync, isPending: isUpdating } = useUpdateTeacherCheckpointStatus();

  // Extract data safely
  const pendingRequests: TCheckPointsRequest[] = pendingRes?.data?.data || [];

  // Type-safe extraction for groups
  const rawApprovedGroups = approvedRes?.data?.data || [];
  const approvedGroups: GroupData[] = rawApprovedGroups
    .filter((group) => group?.id != null)
    .map((group) => ({
      id: group.id as number,
      title: group.title || '',
      description: group.description || '',
      type: group.type || '',
      status: group.status || '',
      semester: group.semester,
    }));

  const rawRejectedGroups = rejectedRes?.data?.data || [];
  const rejectedGroups: GroupData[] = rawRejectedGroups
    .filter((group) => group?.id != null)
    .map((group) => ({
      id: group.id as number,
      title: group.title || '',
      description: group.description || '',
      type: group.type || '',
      status: group.status || '',
      semester: group.semester,
    }));

  // Handle actions
  const handleAction = (request: TCheckPointsRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
  };

  const confirmAction = async () => {
    if (!selectedRequest || !actionType || !selectedRequest.id) return;

    try {
      const isAccepted = actionType === 'approve';
      await updateStatusAsync({ id: selectedRequest.id, isAccepted });

      const successMessage = isAccepted
        ? "Đã chấp nhận yêu cầu chấm checkpoint!"
        : "Đã từ chối yêu cầu chấm checkpoint!";
      toast.success(successMessage);

      // Refresh data
      await refetchPending();
      await refetchApproved();
      await refetchRejected();

      setSelectedRequest(null);
      setActionType(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Không thể cập nhật trạng thái yêu cầu!";
      toast.error(msg);
    }
  };

  // Handle status change for approved/rejected groups
  const handleStatusChange = async (groupId: number, newStatus: 'approve' | 'reject') => {
    try {
      // Find the corresponding request (might need to search in different lists)
      // For now, we'll use groupId as requestId (this might need adjustment based on API structure)
      await updateStatusAsync({ id: groupId, isAccepted: newStatus === 'approve' });

      const successMessage = newStatus === 'approve'
        ? "Đã tiếp nhận lại nhóm!"
        : "Đã từ chối nhóm!";
      toast.success(successMessage);

      // Refresh data
      await refetchPending();
      await refetchApproved();
      await refetchRejected();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Không thể cập nhật trạng thái!";
      toast.error(msg);
    }
  };

  // Render request card
  const renderRequestCard = (request: TCheckPointsRequest, type: 'pending') => (
    <Card key={request.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold">{request.group?.title}</h3>
              <Badge variant="outline">{request.group?.type}</Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              {request.group?.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Học kỳ: {request.group?.semester?.name}</span>
              <span>Trạng thái: {request.group?.status}</span>
            </div>

            {request.teacher && (
              <div className="mt-2 text-sm">
                <span className="font-medium">Giáo viên được chọn:</span> {request.teacher.fullName}
              </div>
            )}
          </div>

          {type === 'pending' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleAction(request, 'reject')}
                disabled={isUpdating}
              >
                <XCircle className="mr-1 h-4 w-4" />
                Từ chối
              </Button>
              <Button
                size="sm"
                onClick={() => handleAction(request, 'approve')}
                disabled={isUpdating}
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Đồng ý
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Render group card for approved/rejected
  const renderGroupCard = (group: GroupData, type: 'approved' | 'rejected') => (
    <Card key={group.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold">{group.title}</h3>
              <Badge variant="outline">{group.type}</Badge>
              <Badge
                className={type === 'approved'
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                }
              >
                {type === 'approved' ? 'Đã chấp nhận' : 'Đã từ chối'}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              {group.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Học kỳ: {group.semester?.name}</span>
              <span>Trạng thái: {group.status}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {type === 'approved' ? (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleStatusChange(group.id, 'reject')}
                disabled={isUpdating}
              >
                <XCircle className="mr-1 h-4 w-4" />
                Từ chối nhóm
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => handleStatusChange(group.id, 'approve')}
                disabled={isUpdating}
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Tiếp nhận lại
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Helper functions to render tab content
  const renderPendingContent = () => {
    if (isPendingLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Đang tải...</span>
        </div>
      );
    }

    if (pendingRequests.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Không có yêu cầu nào đang chờ xét duyệt
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {pendingRequests.map(request => renderRequestCard(request, 'pending'))}
      </div>
    );
  };

  const renderApprovedContent = () => {
    if (isApprovedLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Đang tải...</span>
        </div>
      );
    }

    if (approvedGroups.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có nhóm nào được chấp nhận
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {approvedGroups.map(group => renderGroupCard(group, 'approved'))}
      </div>
    );
  };

  const renderRejectedContent = () => {
    if (isRejectedLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Đang tải...</span>
        </div>
      );
    }

    if (rejectedGroups.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có nhóm nào bị từ chối
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {rejectedGroups.map(group => renderGroupCard(group, 'rejected'))}
      </div>
    );
  };

  const getActionButtonText = () => {
    if (isUpdating) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang xử lý...
        </>
      );
    }
    return actionType === 'approve' ? 'Chấp nhận' : 'Từ chối';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Yêu cầu chấm checkpoint</h1>
          <p className="text-muted-foreground">
            Quản lý các yêu cầu chấm checkpoint từ các nhóm sinh viên
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Đang chờ ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Đã chấp nhận ({approvedGroups.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Đã từ chối ({rejectedGroups.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Yêu cầu đang chờ xét duyệt</CardTitle>
              </CardHeader>
              <CardContent>
                {renderPendingContent()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Tab */}
          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Nhóm đã chấp nhận</CardTitle>
              </CardHeader>
              <CardContent>
                {renderApprovedContent()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rejected Tab */}
          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Nhóm đã từ chối</CardTitle>
              </CardHeader>
              <CardContent>
                {renderRejectedContent()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Confirmation Dialog */}
        <AlertDialog open={!!selectedRequest} onOpenChange={(open) => {
          if (!open) {
            setSelectedRequest(null);
            setActionType(null);
          }
        }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === 'approve' ? 'Chấp nhận yêu cầu' : 'Từ chối yêu cầu'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn {actionType === 'approve' ? 'chấp nhận' : 'từ chối'} yêu cầu chấm checkpoint
                cho nhóm "{selectedRequest?.group?.title}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmAction}
                disabled={isUpdating}
                className={actionType === 'reject' ? 'bg-destructive hover:bg-destructive/90' : ''}
              >
                {getActionButtonText()}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
