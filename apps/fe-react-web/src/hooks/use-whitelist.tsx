import { whitelistApi } from "@/apis/whitelist.api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useWhitelistHook = () => {
  /**
   * Lấy tất cả whitelist theo kỳ học (và role nếu có)
   */
  const useWhitelistBySemester = (semesterId: number, role?: string) =>
    useQuery({
      queryKey: ["whitelistList", semesterId, role],
      queryFn: () => whitelistApi.getWhitelistBySemester(semesterId, role),
      enabled: !!semesterId && semesterId > 0,
    });

  /**
   * Import whitelist từ file Excel
   */
  const useImportWhitelist = () =>
    useMutation({
      mutationFn: ({ semesterId, role, file }: { semesterId: number; role: string; file: File }) =>
        whitelistApi.importWhitelist(semesterId, role, file),
    });

  /**
   * Xóa mềm một email khỏi whitelist (isActive = false)
   */
  const useRemoveEmail = () =>
    useMutation({
      mutationFn: (email: string) => whitelistApi.removeEmail(email),
    });

  /**
   * Xóa mềm toàn bộ email của một kỳ học (và role nếu có)
   */
  const useClearAllEmails = () =>
    useMutation({
      mutationFn: ({ semesterId, role }: { semesterId: number; role?: string }) => whitelistApi.clearAllEmails(semesterId, role),
    });

  /**
   * Kiểm tra xem email có nằm trong whitelist hay không
   */
  const useCheckEmailInWhitelist = () =>
    useMutation({
      mutationFn: (email: string) => whitelistApi.checkEmailInWhitelist(email),
    });

  return {
    useWhitelistBySemester,
    useImportWhitelist,
    useRemoveEmail,
    useClearAllEmails,
    useCheckEmailInWhitelist,
  };
};
