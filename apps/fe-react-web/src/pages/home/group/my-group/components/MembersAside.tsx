import { Users, Loader2, LogOut, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MemberCard } from "./member-card"; // đường dẫn phù hợp dự án của bạn
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SimpleUser = {
  id: number;
  fullName: string;
  email: string;
  studentCode?: string | null;
  avatarUrl?: string | null;
  majorName?: string | null;
};

type Props = {
  members: SimpleUser[];
  isLeader: boolean;
  currentEmail: string | null;
  leaderEmail?: string | null; // email of the group leader
  isGroupMembersPending: boolean;
  isLeaving: boolean;
  groupStatus?: "ACTIVE" | "DONE" | string; // trạng thái nhóm
  onKick: (id: number, fullName: string) => Promise<void> | void;
  onTransfer: (id: number, fullName: string) => Promise<void> | void;
  onLeave: () => Promise<void> | void;
  onViewProfile: (id: number) => void;
  onSelectLecturer?: () => Promise<void> | void; // callback chọn giảng viên
};

export default function MembersAside({
  members, isLeader, currentEmail, leaderEmail,
  isGroupMembersPending, isLeaving, groupStatus,
  onKick, onTransfer, onLeave, onViewProfile, onSelectLecturer,
}: Props) {
  return (
    <Card className="p-4 space-y-4">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold">Thành viên ({members.length})</h3>
          </div>
        </div>

        {!isGroupMembersPending && members.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {members.map((m) => {
              const isCurrentUser = m.email === currentEmail;
              const isThisUserTheLeader = m.email === leaderEmail;
              return (
                <MemberCard
                  key={m.id}
                  user={m}
                  isLeader={isLeader}
                  isThisUserTheLeader={isThisUserTheLeader}
                  isCurrentUser={isCurrentUser}
                  onViewProfile={(id) => onViewProfile(id)}
                  onKick={async (id) => onKick(id, m.fullName)}
                  onTransferLeader={async (id) => onTransfer(id, m.fullName)}
                />
              );
            })}
          </div>
        )}

        {/* Nút chọn giảng viên chấm Checkpoint khi group DONE */}
        {groupStatus === "DONE" && (
          <div className="mt-4">
            <Button
              variant="default"
              size="sm"
              disabled={isGroupMembersPending}
              onClick={() => onSelectLecturer?.()}
              className="w-full"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Chọn giảng viên chấm Checkpoint
            </Button>
          </div>
        )}

        {/* Nút rời khỏi nhóm khi group không phải DONE */}
        {groupStatus !== "DONE" && ((!isLeader) || (isLeader && members.length === 1)) && (
          <div className="mt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isLeaving || isGroupMembersPending}>
                  {isLeaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang rời...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Rời khỏi nhóm
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {isLeader && members.length === 1
                      ? "Xác nhận giải tán nhóm?"
                      : "Xác nhận rời nhóm?"
                    }
                  </AlertDialogTitle>
                  {isLeader && members.length === 1 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Bạn là thành viên duy nhất trong nhóm. Rời khỏi nhóm sẽ giải tán nhóm này.
                    </p>
                  )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isLeaving}>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onLeave()} disabled={isLeaving}>
                    {(() => {
                      if (isLeaving) {
                        return (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                          </>
                        );
                      }
                      return isLeader && members.length === 1 ? "Giải tán nhóm" : "Xác nhận";
                    })()}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </Card>
  );
}
