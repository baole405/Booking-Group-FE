import { LoginForm } from "./components/login-form";

const LoginPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-r from-orange-100 via-orange-200 to-red-100">
      {/* FPT Orange Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-32 w-32 md:h-48 md:w-48 lg:h-64 lg:w-64 rounded-full bg-orange-300/15 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 h-40 w-40 md:h-60 md:w-60 lg:h-80 lg:w-80 rounded-full bg-red-300/12 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 h-48 w-48 md:h-72 md:w-72 lg:h-96 lg:w-96 rounded-full bg-yellow-300/8 blur-3xl animate-pulse delay-2000 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,165,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,165,0,0.02)_1px,transparent_1px)] bg-[length:50px_50px]"></div>

      <div className="relative flex min-h-screen items-center justify-center">
        <div className="w-full max-w-4xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
