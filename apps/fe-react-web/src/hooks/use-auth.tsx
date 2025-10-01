import { authApi } from "@/apis/auth.api";
import { useMutation } from "@tanstack/react-query";

export const useAuth = () => {
  const loginMutation = useMutation({
    mutationFn: authApi.login,
  });
  return {
    loginMutation,
  };
};
