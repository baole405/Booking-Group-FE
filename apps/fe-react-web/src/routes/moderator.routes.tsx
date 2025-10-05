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
const Forum = Loadable(lazy(() => import("@/pages/moderator/Forum")));
const GroupList = Loadable(lazy(() => import("@/pages/moderator/GroupList")));
const LecturersList = Loadable(lazy(() => import("@/pages/moderator/LecturersList")));
const StudentsList = Loadable(lazy(() => import("@/pages/moderator/StudentsList")));

const moderatorRoutes = {
  path: ROUTES.MODERATOR.ROOT,
  element: (
    <RoleBasedGuard allowedRoles={["MODERATOR" as TRole]}>
      <RoleBasedLayout />
    </RoleBasedGuard>
  ),
  children: [
    { index: true, element: <GroupList /> },
    { path: ROUTES.MODERATOR.GROUPS, element: <GroupList /> },
    { path: ROUTES.MODERATOR.FORUMS, element: <Forum /> },
    { path: ROUTES.MODERATOR.STUDENTS, element: <StudentsList /> },
    { path: ROUTES.MODERATOR.LECTURERS, element: <LecturersList /> },

    // thêm các trang dành cho moderator ở đây
  ],
};

export default moderatorRoutes;
