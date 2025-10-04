import { ErrorFallback } from "@/components/ui/error-fallback";
import LoadingScreen from "@/components/ui/loading-screen";
import { ROUTES } from "@/constants/route.constant";
import GuestGuard from "@/guards/guest-guard";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, useRoutes } from "react-router-dom";
import adminRoutes from "./admin.routes";
import lecturerRoutes from "./lecturer.routes";
import moderatorRoutes from "./moderator.routes";
import studentRoutes from "./student.routes";

const Loadable =
  <P extends object>(Component: React.ComponentType<P>) =>
  (props: P) => {
    return (
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingScreen />}>
              <Component {...props} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    );
  };
const LoginPage = Loadable(lazy(() => import("@/pages/auth/login")));
const Logout = Loadable(lazy(() => import("@/pages/auth/logout")));

export default function MainRoutes() {
  return useRoutes([
    { path: ROUTES.HOME, element: <Navigate to={ROUTES.LOGIN} replace /> },
    {
      path: ROUTES.LOGIN,
      element: (
        <GuestGuard>
          <LoginPage />
        </GuestGuard>
      ),
    },
    { path: ROUTES.LOGOUT, element: <Logout /> },
    adminRoutes,
    studentRoutes,
    lecturerRoutes,
    moderatorRoutes,
    { path: "*", element: <Navigate to={ROUTES.HOME} replace /> },
  ]);
}
