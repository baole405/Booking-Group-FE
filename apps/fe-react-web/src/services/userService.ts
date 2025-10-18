import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import type { TUpdateUserSchema, TUser } from "../schema/user.schema";
import { UserSchema } from "../schema/user.schema";

const BASE_URL = `${import.meta.env.VITE_API_URL}/users`;

// Helper function để validate URL
const isValidUrl = (str: string | null | undefined): boolean => {
  if (!str || typeof str !== "string" || str.trim() === "") return false;
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export const userService = {
  async getUser(id: number): Promise<TUser> {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = (await res.json()) as BaseResponse<TUser>;
      console.log("getUser response:", json);

      if (!json.data) {
        throw new Error("No data in response");
      }

      const u = json.data;
      return UserSchema.parse({
        id: u.id,
        studentCode: u.studentCode ?? null,
        fullName: u.fullName,
        email: u.email,
        cvUrl: isValidUrl(u.cvUrl) ? u.cvUrl : null,
        avatarUrl: isValidUrl(u.avatarUrl) ? u.avatarUrl : null,
        major: u.major,
        role: u.role,
        isActive: u.isActive ?? true,
      });
    } catch (error) {
      console.error("Error in getUser:", error);
      throw error;
    }
  },

  async getUsers(): Promise<TUser[]> {
    try {
      const res = await fetch(BASE_URL, {
        headers: {
          "Content-Type": "application/json",
          // Thêm Authorization header nếu cần
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      // Kiểm tra response status
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = (await res.json()) as BaseResponse<PaginationResponse<TUser>>;

      // Log để debug
      console.log("getUsers API Response:", json);

      if (!json.data) {
        throw new Error("No data field in response");
      }

      const users = json.data.content;

      // Log first item để xem cấu trúc
      if (users.length > 0) {
        console.log("First user in array:", users[0]);
      }

      // Xử lý array response
      console.log("Processing array of users, length:", users.length);
      return users.map((u, index: number) => {
        try {
          console.log(`Mapping user ${index}:`, u);

          const mappedUser = {
            id: u.id,
            studentCode: u.studentCode ?? null,
            fullName: u.fullName,
            email: u.email,
            cvUrl: isValidUrl(u.cvUrl) ? u.cvUrl : null,
            avatarUrl: isValidUrl(u.avatarUrl) ? u.avatarUrl : null,
            major: u.major,
            role: u.role,
            isActive: u.isActive ?? true,
          };

          console.log(`Mapped user ${index}:`, mappedUser);

          return UserSchema.parse(mappedUser);
        } catch (error) {
          console.error(`Parse error for user ${index}:`, u);
          console.error("Parse error details:", error);
          throw error;
        }
      });
    } catch (error) {
      console.error("Error in getUsers:", error);
      throw error;
    }
  },

  async updateUser(id: number, data: TUpdateUserSchema): Promise<TUser> {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = (await res.json()) as BaseResponse<TUser>;
      console.log("updateUser response:", json);

      if (!json.data) {
        throw new Error("No data in response");
      }

      const u = json.data;
      return UserSchema.parse({
        id: u.id,
        studentCode: u.studentCode ?? null,
        fullName: u.fullName,
        email: u.email,
        cvUrl: isValidUrl(u.cvUrl) ? u.cvUrl : null,
        avatarUrl: isValidUrl(u.avatarUrl) ? u.avatarUrl : null,
        major: u.major,
        role: u.role,
        isActive: u.isActive ?? true,
      });
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw error;
    }
  },
};

export type { TUpdateUserSchema, TUser };
