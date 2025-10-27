import googleIcon from "@/assets/google-icon.jpg";
import Loading from "@/assets/loading/loading";
import { useAuth } from "@/hooks/use-auth";
import { handleApiError } from "@/lib/error";
import { cn } from "@/lib/utils";
import { setUser } from "@/redux/User/user-slice";
import type { TGoogleLoginRequest } from "@/schema/auth.schema";
import { loginWithGoogle } from "@/utils/auth-service";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Loader2, Users, Lightbulb, Target, Sparkles, Rocket } from "lucide-react";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const dispatch = useDispatch();
  const { loginGoogleMutation } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Add keyframes for float animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(255, 165, 0, 0.3); }
        50% { box-shadow: 0 0 40px rgba(255, 165, 0, 0.6); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const RandomIllustration = useMemo(() => <Loading className="h-auto w-full max-w-md" />, []);

  const handleLoginGoogle = async () => {
    try {
      setLoading(true);

      const { idToken } = await loginWithGoogle();

      const request: TGoogleLoginRequest = {
        idToken,
      };
      const res = await loginGoogleMutation.mutateAsync(request);
      console.log("Login response:", res.data.data);
      dispatch(setUser(res.data.data));
    } catch (error: unknown) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-center",
        className
      )}
      {...props}
    >

      {/* Left Column - Login Form */}
      <div className="flex flex-col justify-center space-y-4 md:space-y-6">

        {/* FPT Brand Header */}
        <div className="text-center lg:text-left space-y-4 md:space-y-5">
          <div className="inline-flex items-center space-x-2 px-2 py-1 rounded-full bg-orange-500/15 backdrop-blur-sm border border-orange-400/20 text-orange-800 text-xs md:text-sm font-medium">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
            <span className="hidden sm:inline">FPT University - Khởi nghiệp cùng đồng đội</span>
            <span className="sm:hidden">FPT - Khởi nghiệp</span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-700 via-red-600 to-orange-800 bg-clip-text text-transparent leading-tight">
            Tìm kiếm đồng đội
            <br />
            <span className="text-xl md:text-2xl lg:text-3xl">Chinh phục giấc mơ</span>
          </h1>

          <p className="text-sm md:text-base lg:text-lg text-orange-700/80 max-w-sm md:max-w-md lg:max-w-lg leading-relaxed">
            Kết nối với những người bạn cùng chí hướng, xây dựng đội nhóm mạnh mẽ và biến ý tưởng thành hiện thực ngay hôm nay!
          </p>
        </div>

        {/* Startup Features */}
        <div className="grid grid-cols-1 gap-2 md:gap-3 text-orange-700/70">
          <div className="flex items-center space-x-3 p-2 rounded-xl bg-white/30 backdrop-blur-sm border border-orange-300/30 hover:bg-white/40 transition-all duration-300">
            <div className="p-1 rounded-lg bg-orange-500/30">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-orange-700" />
            </div>
            <div>
              <div className="font-semibold text-orange-800 text-sm md:text-base">Kết nối đồng đội</div>
              <div className="text-xs md:text-sm text-orange-700/70">Tìm kiếm những người bạn cùng passion</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2 rounded-xl bg-white/30 backdrop-blur-sm border border-orange-300/30 hover:bg-white/40 transition-all duration-300">
            <div className="p-1 rounded-lg bg-red-500/30">
              <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
            </div>
            <div>
              <div className="font-semibold text-orange-800 text-sm md:text-base">Chia sẻ ý tưởng</div>
              <div className="text-xs md:text-sm text-orange-700/70">Biến ý tưởng táo bạo thành startup thực tế</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2 rounded-xl bg-white/30 backdrop-blur-sm border border-orange-300/30 hover:bg-white/40 transition-all duration-300">
            <div className="p-1 rounded-lg bg-yellow-500/30">
              <Target className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            </div>
            <div>
              <div className="font-semibold text-orange-800 text-sm md:text-base">Thực hiện mục tiêu</div>
              <div className="text-xs md:text-sm text-orange-700/70">Từng bước chinh phục giấc mơ khởi nghiệp</div>
            </div>
          </div>
        </div>

        {/* Login Button */}
        <div className="space-y-4 md:space-y-5">
          <button
            onClick={handleLoginGoogle}
            disabled={loading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
              "group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-red-500 p-2 text-white shadow-2xl transition-all duration-300 hover:shadow-orange-500/30 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed",
              loading && "animate-pulse"
            )}
            style={loading ? {} : { animation: 'glow 2s ease-in-out infinite' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

            <div className="relative flex items-center justify-center space-x-3">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <img src={googleIcon} alt="Google Logo" className="w-6 h-6" />
              )}

              <span className="text-sm md:text-base font-bold">
                {loading ? "Đang kết nối..." : "Bắt đầu hành trình khởi nghiệp"}
              </span>

              {!loading && (
                <Rocket className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isHovered && "translate-x-1 -translate-y-1"
                )} />
              )}
            </div>
          </button>

          {loading && (
            <div className="flex items-center justify-center space-x-2 text-orange-700/80">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-bounce delay-200"></div>
              <span className="ml-2 text-sm font-medium">Đang khởi động hệ thống...</span>
            </div>
          )}
        </div>

        {/* Motivational Quote */}
        <div className="text-center space-y-1.5 md:space-y-2">
          <p className="text-orange-800/80 text-sm md:text-base font-medium italic">
            "Một ý tưởng tốt + Đội nhóm mạnh = Startup thành công"
          </p>
          <p className="text-orange-700/60 text-xs md:text-sm">
            Bắt đầu từ hôm nay, cùng nhau tạo nên những điều kỳ diệu! <span role="img" aria-label="rocket">🚀</span>
          </p>
        </div>
      </div>

      {/* Right Column - Illustration */}
      <div className="hidden lg:flex items-center justify-center">
        <div className="relative">
          {/* FPT Orange Decorative elements */}
          <div className="absolute -top-4 -left-4 w-72 h-72 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-3xl"></div>
          <div className="absolute -bottom-4 -right-4 w-72 h-72 rounded-full bg-gradient-to-r from-red-500/20 to-yellow-500/20 blur-3xl"></div>

          {/* Main illustration container */}
          <div className="relative p-8 rounded-3xl bg-orange-500/10 backdrop-blur-xl border border-orange-400/30 shadow-2xl">
            {RandomIllustration}
          </div>

          {/* Floating startup icons */}
          <div
            className="absolute -top-8 -right-8 p-4 rounded-2xl bg-orange-500/20 backdrop-blur-sm border border-orange-400/30"
            style={{
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            <Rocket className="w-8 h-8 text-orange-300" />
          </div>

          <div
            className="absolute -bottom-8 -left-8 p-4 rounded-2xl bg-red-500/20 backdrop-blur-sm border border-red-400/30"
            style={{
              animation: 'float 3s ease-in-out infinite',
              animationDelay: '1s'
            }}
          >
            <Lightbulb className="w-8 h-8 text-yellow-300" />
          </div>

          <div
            className="absolute top-1/2 -left-12 p-3 rounded-xl bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30"
            style={{
              animation: 'float 3s ease-in-out infinite',
              animationDelay: '2s'
            }}
          >
            <Target className="w-6 h-6 text-red-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
