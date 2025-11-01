import { CheckCircle, Clock, Loader2, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);

  const { usePendingRequests, useApprovedGroups, useRejectedGroups, useUpdateTeacherCheckpointStatus } = useTeacherCheckpointsHook();

  // Fetch data
  const { data: pendingRes, isPending: isPendingLoading, refetch: refetchPending } = usePendingRequests();
  const { data: approvedRes, isPending: isApprovedLoading, refetch: refetchApproved } = useApprovedGroups();
  const { data: rejectedRes, isPending: isRejectedLoading, refetch: refetchRejected } = useRejectedGroups();

  const { mutateAsync: updateStatusAsync, isPending: isUpdating } = useUpdateTeacherCheckpointStatus();

  // Extract data safely
  const pendingRequests: TCheckPointsRequest[] = pendingRes?.data?.data || [];

  // Debug: Log first request to see structure
  if (pendingRequests.length > 0) {
    console.log("📊 First pending request structure:", pendingRequests[0]);
  }

  // Type-safe extraction for groups
  const rawApprovedGroups = approvedRes?.data?.data || [];
  const approvedGroups: GroupData[] = rawApprovedGroups
    .filter((group) => group?.id != null)
    .map((group) => ({
      id: group.id as number,
      title: group.title || "",
      description: group.description || "",
      type: group.type || "",
      status: group.status || "",
      semester: group.semester,
    }));

  const rawRejectedGroups = rejectedRes?.data?.data || [];
  const rejectedGroups: GroupData[] = rawRejectedGroups
    .filter((group) => group?.id != null)
    .map((group) => ({
      id: group.id as number,
      title: group.title || "",
      description: group.description || "",
      type: group.type || "",
      status: group.status || "",
      semester: group.semester,
    }));

  // Handle actions
  const handleAction = (request: TCheckPointsRequest, action: "approve" | "reject") => {
    // Handle both id and requestId from API
    const requestWithId = request as TCheckPointsRequest & { requestId?: number };
    const requestId = requestWithId.requestId || request.id;
    console.log("🔵 handleAction called:", {
      request,
      requestId,
      action,
      hasId: !!request.id,
      hasRequestId: !!requestWithId.requestId,
    });
    setSelectedRequest(request);
    setActionType(action);
  };

  const confirmAction = async () => {
    // Handle both id and requestId from API
    const requestWithId = selectedRequest as TCheckPointsRequest & { requestId?: number };
    const requestId = requestWithId?.requestId || selectedRequest?.id;

    console.log("🟢 confirmAction called:", {
      selectedRequest,
      requestId,
      actionType,
      hasId: !!selectedRequest?.id,
      hasRequestId: !!requestWithId?.requestId,
    });

    if (!selectedRequest || !actionType || !requestId) {
      console.log("❌ Missing required data, returning early");
      return;
    }

    try {
      const isAccepted = actionType === "approve";
      console.log("🚀 Calling API:", { id: requestId, isAccepted });
      await updateStatusAsync({ id: requestId, isAccepted });
      const successMessage = isAccepted ? "Đã chấp nhận yêu cầu chấm checkpoint!" : "Đã từ chối yêu cầu chấm checkpoint!";
      console.log("✅ API success:", successMessage);
      toast.success(successMessage);

      // Refresh data
      console.log("🔄 Refreshing data...");
      await refetchPending();
      await refetchApproved();
      await refetchRejected();

      setSelectedRequest(null);
      setActionType(null);
    } catch (err: unknown) {
      console.error("❌ API error:", err);
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Không thể cập nhật trạng thái yêu cầu!";
      toast.error(msg);
    }
  };

  // Render request card
  const renderRequestCard = (request: TCheckPointsRequest, type: "pending") => (
    <Card key={request.id} className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold">{request.group?.title}</h3>
              <Badge variant="outline">{request.group?.type}</Badge>
            </div>

            <p className="text-muted-foreground mb-2 text-sm">{request.group?.description}</p>

            <div className="text-muted-foreground flex items-center gap-4 text-xs">
              <span>Học kỳ: {request.group?.semester?.name}</span>
              <span>Trạng thái: {request.group?.status}</span>
            </div>

            {request.teacher && (
              <div className="mt-2 text-sm">
                <span className="font-medium">Giáo viên được chọn:</span> {request.teacher.fullName}
              </div>
            )}
          </div>

          {type === "pending" && (
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={() => handleAction(request, "reject")} disabled={isUpdating}>
                <XCircle className="mr-1 h-4 w-4" />
                Từ chối
              </Button>
              <Button size="sm" onClick={() => handleAction(request, "approve")} disabled={isUpdating}>
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
  const renderGroupCard = (group: GroupData, type: "approved" | "rejected") => (
    <Card key={group.id} className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <h3 className="font-semibold">{group.title}</h3>
              <Badge variant="outline">{group.type}</Badge>
              <Badge className={type === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {type === "approved" ? "Đã chấp nhận" : "Đã từ chối"}
              </Badge>
            </div>

            <p className="text-muted-foreground mb-2 text-sm">{group.description}</p>

            <div className="text-muted-foreground flex items-center gap-4 text-xs">
              <span>Học kỳ: {group.semester?.name}</span>
              <span>Trạng thái: {group.status}</span>
            </div>
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
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span>Đang tải...</span>
        </div>
      );
    }

    if (pendingRequests.length === 0) {
      return <div className="text-muted-foreground py-8 text-center">Không có yêu cầu nào đang chờ xét duyệt</div>;
    }

    return <div className="space-y-4">{pendingRequests.map((request) => renderRequestCard(request, "pending"))}</div>;
  };

  const renderApprovedContent = () => {
    if (isApprovedLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span>Đang tải...</span>
        </div>
      );
    }

    if (approvedGroups.length === 0) {
      return <div className="text-muted-foreground py-8 text-center">Chưa có nhóm nào được chấp nhận</div>;
    }

    return <div className="space-y-4">{approvedGroups.map((group) => renderGroupCard(group, "approved"))}</div>;
  };

  const renderRejectedContent = () => {
    if (isRejectedLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span>Đang tải...</span>
        </div>
      );
    }

    if (rejectedGroups.length === 0) {
      return <div className="text-muted-foreground py-8 text-center">Chưa có nhóm nào bị từ chối</div>;
    }

    return <div className="space-y-4">{rejectedGroups.map((group) => renderGroupCard(group, "rejected"))}</div>;
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
    return actionType === "approve" ? "Chấp nhận" : "Từ chối";
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Background decorative effect */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />

      {/* Header Section */}
      <div className="mx-auto w-full max-w-6xl px-6 py-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-primary text-xl font-semibold">Yêu cầu chấm checkpoint</h1>
            <p className="text-muted-foreground mt-1 text-sm">Quản lý các yêu cầu chấm checkpoint từ các nhóm sinh viên</p>
          </div>
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
              <CardContent>{renderPendingContent()}</CardContent>
            </Card>
          </TabsContent>

          {/* Approved Tab */}
          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Nhóm đã chấp nhận</CardTitle>
              </CardHeader>
              <CardContent>{renderApprovedContent()}</CardContent>
            </Card>
          </TabsContent>

          {/* Rejected Tab */}
          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Nhóm đã từ chối</CardTitle>
              </CardHeader>
              <CardContent>{renderRejectedContent()}</CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Confirmation Dialog */}
        <AlertDialog
          open={!!selectedRequest}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedRequest(null);
              setActionType(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{actionType === "approve" ? "Chấp nhận yêu cầu" : "Từ chối yêu cầu"}</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn {actionType === "approve" ? "chấp nhận" : "từ chối"} yêu cầu chấm checkpoint cho nhóm "
                {selectedRequest?.group?.title}"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmAction}
                disabled={isUpdating}
                className={actionType === "reject" ? "bg-destructive hover:bg-destructive/90" : ""}
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
