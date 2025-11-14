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
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useIdeaHook } from "@/hooks/use-idea";
import { useTeacherCheckpointsHook } from "@/hooks/use-teacher-checkpoints";
import type { TGroup } from "@/schema/group.schema";
import type { TIdea } from "@/schema/ideas.schema";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ChevronDown, ChevronRight, Clock, ExternalLink, FileText, Lightbulb, Search, User, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Type for approval/rejection/deactivate dialog
type ApprovalAction = {
  type: "approve" | "reject" | "deactivate";
  idea: TIdea;
  groupId: number;
} | null;
export default function IdeaReviewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [openGroups, setOpenGroups] = useState<Set<number>>(new Set());
  const [approvalAction, setApprovalAction] = useState<ApprovalAction>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { useApprovedGroups } = useTeacherCheckpointsHook();
  const { data: groupsRes, isPending: isLoadingGroups } = useApprovedGroups();
  const { useApproveIdea, useRejectIdea, useDeactivateIdea } = useIdeaHook();
  const { mutate: approveIdea, isPending: isApproving } = useApproveIdea();
  const { mutate: rejectIdea, isPending: isRejecting } = useRejectIdea();
  const { mutate: deactivateIdea, isPending: isDeactivating } = useDeactivateIdea();

  const approvedGroups = groupsRes?.data?.data ?? [];

  // Filter groups by search only
  const searchFilteredGroups = approvedGroups.filter((group) => group.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // For "pending" tab, we'll filter in the component after fetching ideas
  // This avoids violating Rules of Hooks
  const filteredGroups = searchFilteredGroups;

  // Simplified statistics - will show total groups only
  // Individual idea counts will be shown in each GroupIdeaCard
  const stats = {
    totalGroups: approvedGroups.length,
    groupsWithPending: 0, // Will be calculated in UI
    totalPendingIdeas: 0, // Will be calculated in UI
  }; // Toggle group expand/collapse
  const toggleGroup = (groupId: number) => {
    setOpenGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Handle approve
  const handleApprove = (idea: TIdea, groupId: number) => {
    setApprovalAction({ type: "approve", idea, groupId });
  };

  // Handle reject
  const handleReject = (idea: TIdea, groupId: number) => {
    setApprovalAction({ type: "reject", idea, groupId });
    setRejectReason("");
  };

  // Handle deactivate (revert approved idea)
  const handleDeactivate = (idea: TIdea, groupId: number) => {
    setApprovalAction({ type: "deactivate", idea, groupId });
  };

  // Confirm approval
  const confirmApproval = () => {
    if (!approvalAction) return;

    if (approvalAction.type === "approve") {
      approveIdea(approvalAction.idea.id, {
        onSuccess: () => {
          toast.success("Đã phê duyệt ý tưởng thành công");
          queryClient.invalidateQueries({ queryKey: ["ideaList", approvalAction.groupId] });
          setApprovalAction(null);
        },
        onError: (error: Error) => {
          toast.error(`Lỗi: ${error.message}`);
        },
      });
    } else if (approvalAction.type === "reject") {
      if (!rejectReason.trim()) {
        toast.error("Vui lòng nhập lý do từ chối");
        return;
      }
      rejectIdea(
        { id: approvalAction.idea.id, data: { reason: rejectReason } },
        {
          onSuccess: () => {
            toast.success("Đã từ chối ý tưởng");
            queryClient.invalidateQueries({ queryKey: ["ideaList", approvalAction.groupId] });
            setApprovalAction(null);
            setRejectReason("");
          },
          onError: (error: Error) => {
            toast.error(`Lỗi: ${error.message}`);
          },
        },
      );
    } else if (approvalAction.type === "deactivate") {
      deactivateIdea(approvalAction.idea.id, {
        onSuccess: () => {
          toast.success("Đã chuyển ý tưởng về trạng thái chưa duyệt");
          queryClient.invalidateQueries({ queryKey: ["ideaList", approvalAction.groupId] });
          setApprovalAction(null);
        },
        onError: (error: Error) => {
          toast.error(`Lỗi: ${error.message}`);
        },
      });
    }
  };

  const isProcessing = isApproving || isRejecting || isDeactivating;

  // Helper functions to avoid nested ternary
  const getDialogTitle = () => {
    if (approvalAction?.type === "approve") return "Phê duyệt ý tưởng";
    if (approvalAction?.type === "reject") return "Từ chối ý tưởng";
    return "Hoàn tác duyệt ý tưởng";
  };

  const getDialogDescription = () => {
    if (approvalAction?.type === "approve") return "Bạn có chắc chắn muốn phê duyệt ý tưởng này?";
    if (approvalAction?.type === "reject") return "Vui lòng nhập lý do từ chối ý tưởng này:";
    return "Bạn có chắc chắn muốn hoàn tác việc duyệt ý tưởng này? Ý tưởng sẽ trở về trạng thái chưa duyệt.";
  };

  const getButtonClassName = () => {
    if (approvalAction?.type === "approve") return "";
    if (approvalAction?.type === "reject") return "bg-destructive hover:bg-destructive/90";
    return "bg-orange-500 hover:bg-orange-600";
  };

  const getButtonText = () => {
    if (isProcessing) return "Đang xử lý...";
    if (approvalAction?.type === "approve") return "Phê duyệt";
    if (approvalAction?.type === "reject") return "Từ chối";
    return "Hoàn tác";
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Background decorative effect */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />

      {/* Header Section */}
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-primary text-2xl font-semibold">Duyệt Ý Tưởng</h1>
            <p className="text-muted-foreground mt-1 text-sm">Quản lý và duyệt ý tưởng từ các nhóm bạn đang phụ trách</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Tổng số nhóm</p>
                <p className="text-2xl font-bold">{stats.totalGroups}</p>
              </div>
              <Users className="text-muted-foreground h-8 w-8" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Nhóm có ý tưởng chờ</p>
                <p className="text-2xl font-bold">{stats.groupsWithPending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Tổng ý tưởng chờ duyệt</p>
                <p className="text-2xl font-bold">{stats.totalPendingIdeas}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input placeholder="Tìm kiếm nhóm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "all")} className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              <Clock className="mr-2 h-4 w-4" />
              Có ý tưởng chờ duyệt
            </TabsTrigger>
            <TabsTrigger value="all">
              <Users className="mr-2 h-4 w-4" />
              Tất cả nhóm ({searchFilteredGroups.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3">
            {(() => {
              if (isLoadingGroups) {
                return <GroupListSkeleton />;
              }

              if (filteredGroups.length === 0) {
                return (
                  <Card className="p-8 text-center">
                    <CheckCircle2 className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <p className="text-muted-foreground">{searchQuery ? "Không tìm thấy nhóm phù hợp" : "Không có ý tưởng nào đang chờ duyệt"}</p>
                  </Card>
                );
              }

              return (
                <div className="space-y-3">
                  {filteredGroups
                    .filter((g) => g.id)
                    .map((group) => (
                      <GroupIdeaCard
                        key={group.id}
                        group={group}
                        isOpen={openGroups.has(group.id ?? 0)}
                        onToggle={() => toggleGroup(group.id ?? 0)}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onDeactivate={handleDeactivate}
                        onViewGroup={() => navigate(`/lecturer/groups/${group.id}`)}
                        isProcessing={isProcessing}
                        activeTab="pending"
                      />
                    ))}
                </div>
              );
            })()}
          </TabsContent>

          <TabsContent value="all" className="space-y-3">
            {(() => {
              if (isLoadingGroups) {
                return <GroupListSkeleton />;
              }

              if (filteredGroups.length === 0) {
                return (
                  <Card className="p-8 text-center">
                    <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <p className="text-muted-foreground">{searchQuery ? "Không tìm thấy nhóm phù hợp" : "Bạn chưa phụ trách nhóm nào"}</p>
                  </Card>
                );
              }

              return (
                <div className="space-y-3">
                  {filteredGroups
                    .filter((g) => g.id)
                    .map((group) => (
                      <GroupIdeaCard
                        key={group.id}
                        group={group}
                        isOpen={openGroups.has(group.id ?? 0)}
                        onToggle={() => toggleGroup(group.id ?? 0)}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onDeactivate={handleDeactivate}
                        onViewGroup={() => navigate(`/lecturer/groups/${group.id}`)}
                        isProcessing={isProcessing}
                        activeTab="all"
                      />
                    ))}
                </div>
              );
            })()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Approval/Rejection Dialog */}
      <AlertDialog open={!!approvalAction} onOpenChange={() => !isProcessing && setApprovalAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getDialogTitle()}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>{getDialogDescription()}</p>
                {approvalAction?.type === "reject" && (
                  <Textarea
                    placeholder="Nhập lý do từ chối..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                )}
                <div className="bg-muted rounded-md p-3">
                  <p className="mb-1 text-sm font-semibold">Ý tưởng: {approvalAction?.idea.title}</p>
                  <p className="text-muted-foreground line-clamp-2 text-sm">{approvalAction?.idea.description}</p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApproval} disabled={isProcessing} className={getButtonClassName()}>
              {getButtonText()}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
// Component: Group with expandable idea list
interface GroupIdeaCardProps {
  group: TGroup; // Changed from GroupWithIdeas since we'll fetch ideas here
  isOpen: boolean;
  onToggle: () => void;
  onApprove: (idea: TIdea, groupId: number) => void;
  onReject: (idea: TIdea, groupId: number) => void;
  onDeactivate: (idea: TIdea, groupId: number) => void;
  onViewGroup: () => void;
  isProcessing: boolean;
  activeTab: "pending" | "all";
}

function GroupIdeaCard({ group, isOpen, onToggle, onApprove, onReject, onDeactivate, onViewGroup, isProcessing, activeTab }: GroupIdeaCardProps) {
  // Fetch ideas for this specific group
  const { useIdeaListByGroupId } = useIdeaHook();
  const { data: ideasRes, isPending: isLoadingIdeas } = useIdeaListByGroupId(group.id ?? 0);

  const ideas = ideasRes?.data?.data || [];
  const proposedIdeas = ideas.filter((i) => i.status === "PROPOSED");
  const approvedIdeas = ideas.filter((i) => i.status === "APPROVED");
  const rejectedIdeas = ideas.filter((i) => i.status === "REJECTED");

  // If we're in "pending" tab and this group has no proposed ideas, don't render it
  if (activeTab === "pending" && proposedIdeas.length === 0 && !isLoadingIdeas) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <div className="p-4">
          {/* Group Header */}
          <div className="flex items-start gap-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 shrink-0 p-0">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold">{group.title}</h3>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{group.description || "Chưa có mô tả"}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewGroup();
                  }}
                  className="shrink-0"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Xem chi tiết nhóm
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className="text-muted-foreground">Chờ duyệt:</span>
                  <span className="font-semibold">{proposedIdeas.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">Đã duyệt:</span>
                  <span className="font-semibold">{approvedIdeas.length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-muted-foreground">Từ chối:</span>
                  <span className="font-semibold">{rejectedIdeas.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Content - Idea List */}
          <CollapsibleContent>
            <div className="mt-4 ml-11 space-y-3">
              {ideas.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  <Lightbulb className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p className="text-sm">Nhóm này chưa có ý tưởng nào</p>
                </div>
              ) : (
                ideas.map((idea) => (
                  <IdeaItem
                    key={idea.id}
                    idea={idea}
                    onApprove={() => onApprove(idea, group.id ?? 0)}
                    onReject={() => onReject(idea, group.id ?? 0)}
                    onDeactivate={() => onDeactivate(idea, group.id ?? 0)}
                    isProcessing={isProcessing}
                  />
                ))
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </Card>
  );
}

// Component: Individual Idea Item
interface IdeaItemProps {
  idea: TIdea;
  onApprove: () => void;
  onReject: () => void;
  onDeactivate: () => void;
  isProcessing: boolean;
}

function IdeaItem({ idea, onApprove, onReject, onDeactivate, isProcessing }: IdeaItemProps) {
  const getStatusBadge = () => {
    switch (idea.status) {
      case "PROPOSED":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            <Clock className="mr-1 h-3 w-3" />
            Chờ duyệt
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Đã duyệt
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            <XCircle className="mr-1 h-3 w-3" />
            Từ chối
          </Badge>
        );
      default:
        return <Badge variant="outline">Nháp</Badge>;
    }
  };

  return (
    <Card className="bg-muted/30 p-4">
      <div className="space-y-3">
        {/* Idea Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 shrink-0 text-yellow-600" />
              <h4 className="font-semibold">{idea.title}</h4>
            </div>
            <p className="text-muted-foreground text-sm">{idea.description || "Không có mô tả"}</p>
          </div>
          {getStatusBadge()}
        </div>

        {/* Author Info */}
        {idea.author && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <User className="h-3 w-3" />
            <span>Người tạo: {idea.author.fullName || idea.author.email}</span>
          </div>
        )}

        {/* Action Buttons */}
        {idea.status === "PROPOSED" && (
          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={onApprove} disabled={isProcessing} className="flex-1">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Phê duyệt
            </Button>
            <Button size="sm" variant="destructive" onClick={onReject} disabled={isProcessing} className="flex-1">
              <XCircle className="mr-2 h-4 w-4" />
              Từ chối
            </Button>
          </div>
        )}

        {/* Deactivate Button for APPROVED ideas */}
        {idea.status === "APPROVED" && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onDeactivate}
              disabled={isProcessing}
              className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Hoàn tác duyệt
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

// Skeleton loader
function GroupListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
