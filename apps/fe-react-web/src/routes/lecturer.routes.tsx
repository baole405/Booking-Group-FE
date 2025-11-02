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
const ForumDetail = Loadable(lazy(() => import("@/pages/home/forum/forum-detail")));
const GroupDetailPage = Loadable(lazy(() => import("@/pages/home/group/group-detail/group-detail")));
const IdeaListPage = Loadable(lazy(() => import("@/pages/home/idea/list-idea-page")));
const MyProfile = Loadable(lazy(() => import("@/pages/home/user/my-profile")));
const CheckpointRequestsPage = Loadable(lazy(() => import("@/pages/lecturer/checkpoint-requests/checkpoint-requests-page")));
const IdeaReviewPage = Loadable(lazy(() => import("@/pages/lecturer/idea-review/idea-review-page")));
const lecturerRoutes = {
  path: ROUTES.LECTURER.ROOT,
  element: (
    <RoleBasedGuard allowedRoles={["LECTURER" as TRole]}>
      <RoleBasedLayout />
    </RoleBasedGuard>
  ),
  children: [
    { index: true, element: <GroupPage /> },
    { path: ROUTES.LECTURER.GROUPS, element: <GroupPage /> },
    { path: ROUTES.LECTURER.GROUP_DETAIL, element: <GroupDetailPage /> },
    { path: ROUTES.LECTURER.FORUMS, element: <ForumPage /> },
    { path: ROUTES.LECTURER.FORUM_DETAIL, element: <ForumDetail /> },
    { path: ROUTES.LECTURER.PROFILE, element: <UserProfile /> },
    { path: ROUTES.LECTURER.IDEAS, element: <IdeaListPage /> },
    { path: ROUTES.LECTURER.MY_PROFILE, element: <MyProfile /> },
    { path: ROUTES.LECTURER.CHECKPOINT_REQUESTS, element: <CheckpointRequestsPage /> },
    { path: ROUTES.LECTURER.IDEA_REVIEW, element: <IdeaReviewPage /> },

    // thêm các trang dành cho giảng viên ở đây
  ],
};

export default lecturerRoutes;
