import { Users, Loader2, LogOut } from "lucide-react";
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
  isGroupMembersPending: boolean;
  isLeaving: boolean;
  onKick: (id: number, fullName: string) => Promise<void> | void;
  onTransfer: (id: number, fullName: string) => Promise<void> | void;
  onLeave: () => Promise<void> | void;
  onViewProfile: (id: number) => void;
};

export default function MembersAside({
  members, isLeader, currentEmail, isGroupMembersPending,
  isLeaving, onKick, onTransfer, onLeave, onViewProfile,
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
              return (
                <MemberCard
                  key={m.id}
                  user={m}
                  isLeader={isLeader}
                  isCurrentUser={isCurrentUser}
                  onViewProfile={(id) => onViewProfile(id)}
                  onKick={async (id) => onKick(id, m.fullName)}
                  onTransferLeader={async (id) => onTransfer(id, m.fullName)}
                />
              );
            })}
          </div>
        )}

        {!isLeader && (
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
                  <AlertDialogTitle>Xác nhận rời nhóm?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isLeaving}>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onLeave()} disabled={isLeaving}>
                    {isLeaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Xác nhận"
                    )}
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
