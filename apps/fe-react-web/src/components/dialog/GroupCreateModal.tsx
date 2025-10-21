import { useGroupHook } from "@/hooks/use-group";
import React, { useState } from "react";
interface GroupCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  semesterId: number;
}

const GroupCreateModal: React.FC<GroupCreateModalProps> = ({ open, onClose, onSuccess, semesterId }) => {
  const [size, setSize] = useState(1);
  const { useCreateGroupWithSemester } = useGroupHook();
  const createGroups = useCreateGroupWithSemester();

  const resetForm = () => {
    setSize(1);
    createGroups.reset && createGroups.reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createGroups.mutateAsync({ size, semesterId }); // 👈 thêm semesterId ở đây

    if (onSuccess) onSuccess();
    resetForm();
    onClose();
  };

  React.useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Tạo nhóm rỗng</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-medium">Số lượng nhóm</label>
            <input
              type="number"
              min={1}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full rounded border px-3 py-2"
              required
            />
            <p className="mt-1 text-sm text-gray-500">Nhóm sẽ được tạo trong học kỳ hiện tại (ID: {semesterId})</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="rounded bg-gray-200 px-4 py-2"
            >
              Hủy
            </button>
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white" disabled={createGroups.status === "pending"}>
              {createGroups.status === "pending" ? "Đang tạo..." : "Tạo nhóm"}
            </button>
          </div>
          {createGroups.isError && <div className="text-sm text-red-500">Tạo nhóm thất bại</div>}
        </form>
      </div>
    </div>
  );
};

export default GroupCreateModal;
