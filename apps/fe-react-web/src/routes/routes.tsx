import { ErrorFallback } from "@/components/error-fallback";
import LoadingScreen from "@/components/loading-screen";
import { ROUTES } from "@/constants/route.constant";
import GuestGuard from "@/guards/guest-guard";
import RoleBasedGuard from "@/guards/role-based-guard";
import AdminLayout from "@/layouts/AdminLayout";
import LectureLayout from "@/layouts/LectureLayout";
import ModeratorLayout from "@/layouts/ModeratorLayout";
import StudentLayout from "@/layouts/StudentLayout";
import Logout from "@/pages/auth/logout";

import type { TRole } from "@/schema/role.schema";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navigate, useRoutes } from "react-router-dom";

// -------- Lazy load helper --------
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
const LoginPage = Loadable(lazy(() => import("@/pages/auth/login")));
const ForumPage = Loadable(lazy(() => import("@/pages/home/forum/forum-page")));
const HomePage = Loadable(lazy(() => import("@/pages/home/group/list-group-page")));
const UserProfile = Loadable(lazy(() => import("@/pages/home/user/user-profile")));
const Dashboard = Loadable(lazy(() => import("@/pages/Dashboard")));

export default function MainRoutes() {
  return useRoutes([
    {
      path: ROUTES.HOME,
      element: <Navigate to={ROUTES.AUTH.LOGIN} replace />,
    },
    {
      path: ROUTES.AUTH.ROOT,
      children: [
        {
          element: <Navigate to={ROUTES.AUTH.LOGIN} replace />,
          index: true,
        },
        {
          path: ROUTES.AUTH.LOGIN.replace(`${ROUTES.AUTH.ROOT}/`, ""),
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: ROUTES.AUTH.LOGOUT.replace(`${ROUTES.AUTH.ROOT}/`, ""),
          element: <Logout />,
        },
      ],
    },

    // ---------- Admin ----------
    {
      path: ROUTES.ADMIN.ROOT,
      element: (
        <RoleBasedGuard allowedRoles={["ADMIN" as TRole]}>
          <AdminLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          element: <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />,
          index: true,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
      ],
    },

    // ---------- Student ----------
    {
      path: ROUTES.STUDENT.ROOT,
      element: (
        <RoleBasedGuard allowedRoles={["STUDENT" as TRole]}>
          <StudentLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "dashboard",
          element: <HomePage />,
        },
        {
          path: "forum",
          element: <ForumPage />,
        },
        {
          path: "profile",
          element: <UserProfile />,
        },
      ],
    },

    // ---------- Lecture ----------
    {
      path: ROUTES.LECTURER.ROOT,
      element: (
        <RoleBasedGuard allowedRoles={["LECTURER" as TRole]}>
          <LectureLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          element: <Navigate to={ROUTES.LECTURER.DASHBOARD} replace />,
          index: true,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
      ],
    },

    // ---------- Moderator ----------
    {
      path: ROUTES.MODERATOR.ROOT,
      element: (
        <RoleBasedGuard allowedRoles={["MODERATOR" as TRole]}>
          <ModeratorLayout />
        </RoleBasedGuard>
      ),
      children: [
        {
          element: <Navigate to={ROUTES.MODERATOR.DASHBOARD} replace />,
          index: true,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
      ],
    },

    // ---------- Fallback ----------
    {
      path: "*",
      element: <Navigate to={ROUTES.HOME} replace />,
    },
  ]);
}
