import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { TMajor } from "@/schema/major.schema";
import { useState } from "react";
import { UpdateMajorDialog } from "./UpdateMajorDialog";

interface MajorDetailDialogProps {
  major: TMajor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSuccess?: () => void;
}

export function MajorDetailDialog({ major, open, onOpenChange, onUpdateSuccess }: MajorDetailDialogProps) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  if (!major) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chi tiết ngành học</DialogTitle>
            <DialogDescription>Xem thông tin chi tiết và quản lý ngành học.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-semibold">ID</span>
              <span className="col-span-3">{major.id}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-semibold">Tên ngành</span>
              <span className="col-span-3">{major.name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-semibold">Trạng thái</span>
              <div className="col-span-3">
                <Badge variant={major.active ? "default" : "destructive"}>{major.active ? "Đang hoạt động" : "Ngưng hoạt động"}</Badge>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsUpdateOpen(true)} variant="default">
              Cập nhật
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Major Dialog */}
      {major && (
        <UpdateMajorDialog
          major={major}
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          onUpdateSuccess={() => {
            onUpdateSuccess?.();
            onOpenChange(false); // Đóng detail dialog sau khi update thành công
          }}
        />
      )}
    </>
  );
}
