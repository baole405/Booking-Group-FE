import googleIcon from "@/assets/google-icon.jpg";
import Loading from "@/assets/loading/loading";
import { useAuth } from "@/hooks/use-auth";
import { handleApiError } from "@/lib/error";
import { cn } from "@/lib/utils";
import { setUser } from "@/redux/User/user-slice";
import { loginWithGoogle } from "@/utils/auth-service";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const dispatch = useDispatch();
  const { loginGoogleMutation } = useAuth();
  const [loading, setLoading] = useState(false);

  const RandomIllustration = useMemo(() => <Loading className="h-auto w-full" />, []);

  const handleLoginGoogle = async () => {
    try {
      setLoading(true);

      const { idToken } = await loginWithGoogle();
      const res = await loginGoogleMutation.mutateAsync({ idToken });
      console.log("Login response:", res.data.data);
      dispatch(setUser(res.data.data));
    } catch (error: any) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("flex min-h-screen items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500", className)}
      {...props}
    >
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
        {/* Cột login */}
        <div className="flex flex-col justify-center gap-6 p-10 md:w-1/2">
          <h1 className="text-4xl font-extrabold text-gray-800">Chào mừng trở lại!</h1>
          <p className="text-gray-500">Đăng nhập bằng tài khoản Google để tiếp tục</p>

          <button
            onClick={handleLoginGoogle}
            disabled={loading}
            className="flex items-center justify-center gap-3 rounded-lg bg-red-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-red-600"
          >
            <img src={googleIcon} alt="Google Logo" className="h-5 w-5" />
            {loading ? "Đang đăng nhập..." : "Đăng nhập với Google"}
          </button>

          {loading && <p className="mt-2 text-sm text-gray-400">Vui lòng đợi...</p>}
        </div>

        {/* Cột minh họa */}
        <div className="flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-600 p-6 md:w-1/2">{RandomIllustration}</div>
      </div>
    </div>
  );
}
