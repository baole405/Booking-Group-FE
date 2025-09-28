import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTES } from "@/constants/route.constant";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import LoginPage from "@/pages/auth/login";
import Dashboard from "@/pages/Dashboard";
import HomePage from "@/pages/home/home-page";
import UserProfile from "@/pages/home/user-profile";

export default function MainRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<HomePage />} path="/" />
      <Route element={<Navigate replace to="/" />} path="/home" />

      {/* User Profile Route */}
      <Route element={<UserProfile />} path={ROUTES.PROFILE} />

      <Route element={<LoginPage />} path="/login" />

      {/* Dashboard Routes */}
      <Route element={<Dashboard />} path={ROUTES.DASHBOARD} />

      {/* Admin Routes */}
      <Route element={<AdminDashboard />} path={ROUTES.ADMIN.DASHBOARD} />
      <Route element={<Navigate replace to={ROUTES.ADMIN.DASHBOARD} />} path={ROUTES.ADMIN.ROOT} />

      {/* Fallback */}
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
