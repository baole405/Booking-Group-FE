import { ArrowLeft, Lightbulb, Loader2, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useGroupHook } from "@/hooks/use-group";
import { useIdeaHook } from "@/hooks/use-idea";
import type { TIdea } from "@/schema/ideas.schema";
import type { TUser } from "@/schema/user.schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ───────────────────── Helper Functions ─────────────────────
const statusClass = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "LOCKED":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "FORMING":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const statusLabel = (status?: string) => {
  const map: Record<string, string> = {
    ACTIVE: "Hoạt động",
    LOCKED: "Đã khóa",
    FORMING: "Đang hình thành",
  };
  return map[status?.toUpperCase() || ""] || status || "Không rõ";
};

export default function GroupDetail() {
  const { id } = useParams();
  const groupId = Number(id);
  const navigate = useNavigate();

  const { useGroupById, useGroupMembers } = useGroupHook();
  const { useIdeaListByGroupId } = useIdeaHook();

  // ───────────────────── Fetch Data ─────────────────────
  const { data: groupRes, isPending: isGroupPending, error: groupError } = useGroupById(groupId);
  const group = groupRes?.data?.data ?? null;

  const { data: membersRes, isPending: isMembersPending, error: membersError } = useGroupMembers(groupId);
  const members: TUser[] = membersRes?.data?.data ?? [];

  const { data: ideasRes, isPending: isIdeasPending, error: ideasError } = useIdeaListByGroupId(groupId);
  const ideas: TIdea[] = ideasRes?.data?.data ?? [];

  // ───────────────────── Loading State ─────────────────────
  if (isGroupPending) {
    return (
      <div className="text-muted-foreground flex min-h-screen items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải thông tin nhóm...
      </div>
    );
  }

  // ───────────────────── Error State ─────────────────────
  if (groupError || !group) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-destructive mb-4 text-xl font-bold">Không tìm thấy nhóm!</h2>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </Card>
      </div>
    );
  }

  // ───────────────────── Render Main ─────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{group.title}</h1>
                <p className="mt-2 text-sm text-gray-600">{group.description || "Chưa có mô tả"}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {group.semester && (
                    <Badge variant="secondary" className="text-sm">
                      📚 {group.semester.name}
                    </Badge>
                  )}
                  {group.type && (
                    <Badge variant="outline" className="text-sm">
                      {group.type === "PUBLIC" ? "🌐 Công khai" : "🔒 Riêng tư"}
                    </Badge>
                  )}
                  {group.status && <Badge className={statusClass(group.status)}>{statusLabel(group.status)}</Badge>}
                </div>
              </div>

              <Badge variant="secondary" className="text-lg font-semibold">
                ID: #{group.id}
              </Badge>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Left (Goals + Ideas) | Right (Members) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT COLUMN: Goals + Ideas */}
          <div className="space-y-6 lg:col-span-2">
            {/* Goals Section */}
            <Card className="p-6">
              <h2 className="mb-2 text-lg font-semibold">Mục tiêu của nhóm</h2>
              <Separator className="mb-4" />
              <p className="text-foreground/80 text-sm leading-relaxed">{group.description || "Chưa có mô tả."}</p>
            </Card>

            {/* Ideas Section */}
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2 border-b pb-4">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
                <h2 className="text-xl font-semibold">Ý tưởng của nhóm</h2>
              </div>

              {/* Loading Ideas */}
              {isIdeasPending && (
                <div className="text-muted-foreground flex items-center gap-2 py-8 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang tải danh sách ý tưởng...
                </div>
              )}

              {/* Error Loading Ideas */}
              {!isIdeasPending && ideasError && <div className="text-destructive py-8 text-center text-sm">Không thể tải danh sách ý tưởng.</div>}

              {/* No Ideas */}
              {!isIdeasPending && !ideasError && ideas.length === 0 && (
                <div className="text-muted-foreground py-12 text-center text-sm">Chưa có ý tưởng nào.</div>
              )}

              {/* Ideas List */}
              {!isIdeasPending && !ideasError && ideas.length > 0 && (
                <div className="space-y-4">
                  {ideas.map((idea) => (
                    <div
                      key={idea.id}
                      className="rounded-lg border bg-gradient-to-r from-yellow-50 to-orange-50 p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          #{idea.id}
                        </Badge>
                      </div>
                      {idea.description && <p className="text-sm text-gray-700">{idea.description}</p>}
                      {idea.createdAt && (
                        <p className="mt-2 text-xs text-gray-500">Đăng ngày: {new Date(idea.createdAt).toLocaleDateString("vi-VN")}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT COLUMN: Members */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-2 border-b pb-4">
                <Users className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Thành viên ({members.length}/6)</h2>
              </div>

              {/* Loading Members */}
              {isMembersPending && (
                <div className="text-muted-foreground flex items-center gap-2 py-8 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang tải danh sách thành viên...
                </div>
              )}

              {/* Error Loading Members */}
              {!isMembersPending && membersError && (
                <div className="text-destructive py-8 text-center text-sm">Không tải được danh sách thành viên.</div>
              )}

              {/* No Members */}
              {!isMembersPending && !membersError && members.length === 0 && (
                <div className="text-muted-foreground py-12 text-center text-sm">Nhóm chưa có thành viên nào.</div>
              )}

              {/* Members List - Single Column Vertical Stack */}
              {!isMembersPending && !membersError && members.length > 0 && (
                <div className="space-y-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 rounded-lg border bg-white p-4 transition-shadow hover:shadow-md">
                      {/* Avatar */}
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.fullName} className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
                          {member.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Member Info */}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{member.fullName}</div>
                        <div className="text-xs text-gray-500">{member.email}</div>
                        {member.studentCode && <div className="text-xs text-gray-400">MSSV: {member.studentCode}</div>}
                      </div>

                      {/* Role Badge */}
                      <Badge variant="secondary" className="text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
