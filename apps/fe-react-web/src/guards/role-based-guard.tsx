import { ROUTES } from "@/constants/route.constant";
import type { RootState } from "@/redux/store";
import type { TRole } from "@/schema/common/role.schema";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type RoleBasedGuardProps = {
  allowedRoles: TRole[];
  children: ReactNode;
};

const RoleBasedGuard = ({ children, allowedRoles }: RoleBasedGuardProps) => {
  const { isAuthenticated, role: userRole } = useSelector((state: RootState) => state.user);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    switch (userRole) {
      case "ADMIN":
        return <Navigate to={ROUTES.ADMIN.ACCOUNTS} replace />;
      case "STUDENT":
        return <Navigate to={ROUTES.STUDENT.GROUPS} replace />;
      case "MODERATOR":
        return <Navigate to={ROUTES.MODERATOR.GROUPS} replace />;
      case "LECTURER":
        return <Navigate to={ROUTES.LECTURER.GROUPS} replace />;
      default:
        return <Navigate to="/404" replace />;
    }
  }

  return children;
};

export default RoleBasedGuard;
