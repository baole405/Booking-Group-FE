import { ErrorFallback } from "@/components/ui/error-fallback";
import LoadingScreen from "@/components/ui/loading-screen";
import { ROUTES } from "@/constants/route.constant";
import RoleBasedGuard from "@/guards/role-based-guard";
import RoleBasedLayout from "@/layouts/RoleBasedLayout";
import type { TRole } from "@/schema/common/role.schema";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

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

// -------- Lazy pages --------
const HomePage = Loadable(lazy(() => import("@/pages/home/group/list-group-page")));
const ForumPage = Loadable(lazy(() => import("@/pages/home/forum/forum-page")));
const UserProfile = Loadable(lazy(() => import("@/pages/home/user/user-profile")));

const studentRoutes = {
  path: ROUTES.STUDENT.ROOT,
  element: (
    <RoleBasedGuard allowedRoles={["STUDENT" as TRole]}>
      <RoleBasedLayout />
    </RoleBasedGuard>
  ),
  children: [
    { index: true, element: <HomePage /> },
    { path: ROUTES.STUDENT.GROUPS, element: <HomePage /> },
    { path: ROUTES.STUDENT.FORUM, element: <ForumPage /> },
    { path: ROUTES.STUDENT.PROFILE, element: <UserProfile /> },
  ],
};

export default studentRoutes;
