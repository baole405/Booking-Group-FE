import { ROUTES } from "@/constants/route.constant";
import RoleBasedGuard from "@/guards/role-based-guard";
import RoleBasedLayout from "@/layouts/RoleBasedLayout";
import Dashboard from "@/pages/Dashboard";
import type { TRole } from "@/schema/role.schema";
import { Navigate } from "react-router-dom";

const lecturerRoutes = {
  path: ROUTES.LECTURER.ROOT,
  element: (
    <RoleBasedGuard allowedRoles={["LECTURER" as TRole]}>
      <RoleBasedLayout />
    </RoleBasedGuard>
  ),
  children: [
    { index: true, element: <Navigate to={ROUTES.LECTURER.DASHBOARD} replace /> },
    { path: ROUTES.LECTURER.DASHBOARD, element: <Dashboard /> },
    // thêm các trang dành cho giảng viên ở đây
  ],
};

export default lecturerRoutes;
