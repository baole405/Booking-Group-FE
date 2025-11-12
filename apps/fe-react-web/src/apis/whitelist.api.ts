import { apiRequest } from "@/lib/http";
import type { TWhitelist } from "@/schema/whitelist.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

/**
 * Upload an Excel file to import email whitelist for a semester
 * Excel format: Column A = Email, Column B = Full Name, Column C = Student Code (optional)
 */
const importWhitelist = async (semesterId: number, role: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return await apiRequest.post<BaseResponse<TWhitelist[]>>(`${API_SUFFIX.WHITELIST_API}/import?semesterId=${semesterId}&role=${role}`, formData);
};

/**
 * Retrieve all active whitelist emails for a specific semester (optionally filtered by role)
 */
const getWhitelistBySemester = async (semesterId: number, role?: string) => {
  const qs = new URLSearchParams();
  qs.append("semesterId", semesterId.toString());
  if (role) qs.append("role", role);
  return await apiRequest.get<BaseResponse<TWhitelist[]>>(`${API_SUFFIX.EXCEL_API}?${qs.toString()}`);
};

/**
 * Soft delete an email from the whitelist (set isActive = false)
 */
const removeEmail = async (email: string) => await apiRequest.delete<BaseResponse<string>>(`${API_SUFFIX.EXCEL_API}?email=${email}`);

/**
 * Soft delete multiple emails from the whitelist
 */
const clearAllEmails = async (semesterId: number, role?: string) =>
  await apiRequest.delete<BaseResponse<string>>(`${API_SUFFIX.EXCEL_API}/clear?semesterId=${semesterId}&role=${role}`, {
    data: { semesterId, role },
  });

/**
 * Check if a specific email is in the active whitelist
 */
const checkEmailInWhitelist = async (email: string) => await apiRequest.get<BaseResponse<boolean>>(`${API_SUFFIX.EXCEL_API}/check?email=${email}`);

export const whitelistApi = {
  importWhitelist,
  getWhitelistBySemester,
  removeEmail,
  clearAllEmails,
  checkEmailInWhitelist,
};
