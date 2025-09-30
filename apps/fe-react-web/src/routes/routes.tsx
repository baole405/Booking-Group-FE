import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTES } from "@/constants/route.constant";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import LoginPage from "@/pages/auth/login";
import Dashboard from "@/pages/Dashboard";
import HomePage from "@/pages/home/home-page";
import UserProfile from "@/pages/home/user-profile";
import Forum from "@/pages/moderator/Forum";
import GroupDetail from "@/pages/moderator/GroupDetail";
import GroupList from "@/pages/moderator/GroupList";
import ModeratorHomePage from "@/pages/moderator/home-page";

import GroupPage from "@/pages/group/GroupPage";

export default function MainRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<HomePage />} path="/" />
      <Route element={<Navigate replace to="/" />} path="/home" />

      {/* Moderator Home Page Route */}
      {/* Moderator Layout & Nested Routes */}
      <Route path="/moderator/home" element={<ModeratorHomePage />}>
        <Route path="forum" element={<Forum />} />
        <Route path="groups" element={<GroupList />} />
        <Route path="groups/:id" element={<GroupDetail />} />
        {/* Có thể thêm các chức năng khác ở đây */}
      </Route>

      {/* User Profile Route */}
      <Route element={<UserProfile />} path={ROUTES.PROFILE} />

      <Route element={<LoginPage />} path="/login" />

      {/* Dashboard Routes */}
      <Route element={<Dashboard />} path={ROUTES.DASHBOARD} />

      {/* Group Routes */}
      <Route element={<GroupPage />} path={ROUTES.GROUP} />

      {/* Admin Routes */}
      <Route element={<AdminDashboard />} path={ROUTES.ADMIN.DASHBOARD} />
      <Route element={<Navigate replace to={ROUTES.ADMIN.DASHBOARD} />} path={ROUTES.ADMIN.ROOT} />

      {/* Fallback */}
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
