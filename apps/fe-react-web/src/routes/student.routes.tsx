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
const GroupPage = Loadable(lazy(() => import("@/pages/home/group/list-group/list-group-page")));
const ForumPage = Loadable(lazy(() => import("@/pages/home/forum/forum-page")));
const UserProfile = Loadable(lazy(() => import("@/pages/home/user/user-profile")));
const GroupDetailPage = Loadable(lazy(() => import("@/pages/home/group/group-detail/group-detail")));
const MyGroupPage = Loadable(lazy(() => import("@/pages/home/group/my-group/my-group-page")));
const MyProfile = Loadable(lazy(() => import("@/pages/home/user/my-profile")));
const JoinRequestsPage = Loadable(lazy(() => import("@/pages/home/group/join-request/join-requests")));

const studentRoutes = {
  path: ROUTES.STUDENT.ROOT,
  element: (
    <RoleBasedGuard allowedRoles={["STUDENT" as TRole]}>
      <RoleBasedLayout />
    </RoleBasedGuard>
  ),
  children: [
    { index: true, element: <GroupPage /> },
    { path: ROUTES.STUDENT.GROUPS, element: <GroupPage /> },
    { path: ROUTES.STUDENT.FORUM, element: <ForumPage /> },
    { path: ROUTES.STUDENT.PROFILE, element: <UserProfile /> },
    { path: ROUTES.STUDENT.MY_PROFILE, element: <MyProfile /> },
    { path: ROUTES.STUDENT.MY_GROUP, element: <MyGroupPage /> },
    { path: ROUTES.STUDENT.GROUP_DETAIL, element: <GroupDetailPage /> },
    { path: ROUTES.STUDENT.JOIN_REQUESTS, element: <JoinRequestsPage /> }
  ],
};

export default studentRoutes;
