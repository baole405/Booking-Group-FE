import { apiRequest } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";

export interface UserProfile {
  id: number;
  studentCode: string;
  fullName: string;
  email: string;
  cvUrl: string;
  avatarUrl: string;
  major: {
    id: number;
    name: string;
  };
  role: string;
  isActive: boolean;
}

export interface MyProfileResponse {
  status: number;
  message: string;
  data: UserProfile;
}

export function useMyProfile() {
  return useQuery<MyProfileResponse>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const res = await apiRequest.get("/users/myInfo");
      return res.data;
    },
  });
}
