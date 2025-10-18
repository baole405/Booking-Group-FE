import { ROUTES } from "@/constants/route.constant";
import RoleBasedGuard from "@/guards/role-based-guard";
import RoleBasedLayout from "@/layouts/RoleBasedLayout";
import type { TRole } from "@/schema/common/role.schema";

// -------- Lazy load helper --------
import { ErrorFallback } from "@/components/ui/error-fallback";
import LoadingScreen from "@/components/ui/loading-screen";
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
// const ListStudentScreen = Loadable(lazy(() => import("@/pages/admin/ListStudentScreen")));
const ListAccountScreen = Loadable(lazy(() => import("@/pages/admin/ListAccountScreen")));
const ListSemesterScreen = Loadable(lazy(() => import("@/pages/admin/ListSemesterScreen")));
// const ListLectureScreen = Loadable(lazy(() => import("@/pages/admin/ListLectureScreen")));
// const ListProjectScreen = Loadable(lazy(() => import("@/pages/admin/ListSeScreen")));

const adminRoutes = {
  path: ROUTES.ADMIN.ROOT,
  element: (
    <RoleBasedGuard allowedRoles={["ADMIN" as TRole]}>
      <RoleBasedLayout />
    </RoleBasedGuard>
  ),
  children: [
    { index: true, element: <ListAccountScreen /> },
    { path: ROUTES.ADMIN.ACCOUNTS, element: <ListAccountScreen /> },
    { path: ROUTES.ADMIN.SEMESTERS, element: <ListSemesterScreen /> },
    // { path: ROUTES.ADMIN.LECTURERS, element: <ListLectureScreen /> },
    // { path: ROUTES.ADMIN.PROJECTS, element: <ListProjectScreen /> },
    // { path: ROUTES.ADMIN.STUDENTS, element: <ListStudentScreen /> },
  ],
};

export default adminRoutes;
