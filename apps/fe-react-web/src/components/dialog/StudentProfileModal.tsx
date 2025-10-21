import { useUserHook } from "@/hooks/use-user";
import { X } from "lucide-react";
import React from "react";

interface StudentProfileModalProps {
  open: boolean;
  onClose: () => void;
  studentId: number;
}

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ open, onClose, studentId }) => {
  const { useUserById } = useUserHook();
  const { data, isLoading } = useUserById(studentId, { enabled: open && !!studentId });
  const student = data?.data;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="size-5" />
        </button>

        <h2 className="mb-4 text-xl font-bold text-gray-900">Thông tin sinh viên</h2>

        {isLoading && <div className="py-8 text-center text-gray-500">Đang tải...</div>}

        {!isLoading && !student && <div className="py-8 text-center text-red-500">Không thể tải thông tin sinh viên</div>}

        {!isLoading && student && (
          <div className="space-y-4">
            {/* Avatar */}
            <div className="flex justify-center">
              {student.avatarUrl ? (
                <img src={student.avatarUrl} alt={student.fullName} className="size-24 rounded-full object-cover" />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-600">
                  {student.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                <div className="text-base font-semibold text-gray-900">{student.fullName}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="text-base text-gray-900">{student.email}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">MSSV</label>
                <div className="text-base text-gray-900">{student.studentCode || "-"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Vai trò</label>
                <div className="text-base text-gray-900">{student.role}</div>
              </div>
              {student.major && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Chuyên ngành</label>
                  <div className="text-base text-gray-900">{student.major.name}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfileModal;
