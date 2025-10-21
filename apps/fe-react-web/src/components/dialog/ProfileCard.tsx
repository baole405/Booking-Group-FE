import { useMyProfile } from "@/hooks/use-my-profile";
import { X } from "lucide-react";
import React from "react";

interface ProfileCardProps {
  open: boolean;
  onClose: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ open, onClose }) => {
  const { data, isLoading } = useMyProfile();
  const user = data?.data;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="size-5" />
        </button>

        <h2 className="mb-4 text-xl font-bold text-gray-900">Thông tin tài khoản</h2>

        {isLoading && <div className="py-8 text-center text-gray-500">Đang tải...</div>}

        {!isLoading && !user && <div className="py-8 text-center text-red-500">Không thể tải thông tin tài khoản</div>}

        {!isLoading && user && (
          <div className="space-y-4">
            {/* Avatar */}
            <div className="flex justify-center">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName} className="size-24 rounded-full object-cover" />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-600">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                <div className="text-base font-semibold text-gray-900">{user.fullName}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="text-base text-gray-900">{user.email}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Mã số</label>
                <div className="text-base text-gray-900">{user.studentCode}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Vai trò</label>
                <div className="text-base text-gray-900">{user.role}</div>
              </div>
              {user.major && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Chuyên ngành</label>
                  <div className="text-base text-gray-900">{user.major.name}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
