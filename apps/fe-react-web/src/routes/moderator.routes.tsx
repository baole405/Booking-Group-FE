import { ROUTES } from "@/constants/route.constant";
import RoleBasedGuard from "@/guards/role-based-guard";
import RoleBasedLayout from "@/layouts/RoleBasedLayout";
import Dashboard from "@/pages/Dashboard";
import type { TRole } from "@/schema/role.schema";
import { Navigate } from "react-router-dom";

const moderatorRoutes = {
  path: ROUTES.MODERATOR.ROOT,
  element: (
    <RoleBasedGuard allowedRoles={["MODERATOR" as TRole]}>
      <RoleBasedLayout />
    </RoleBasedGuard>
  ),
  children: [
    { index: true, element: <Navigate to={ROUTES.MODERATOR.GROUPS} replace /> },
    { path: ROUTES.MODERATOR.GROUPS, element: <Dashboard /> },
    // thêm các trang dành cho moderator ở đây
  ],
};

export default moderatorRoutes;
