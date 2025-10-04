import { authApi } from "@/apis/auth.api";
import { useMutation } from "@tanstack/react-query";

export const useAuth = () => {
  const loginMutation = useMutation({
    mutationFn: authApi.login,
  });

  const loginGoogleMutation = useMutation({
    mutationFn: authApi.loginWithGoogle,
  });
  return {
    loginMutation,
    loginGoogleMutation,
  };
};
