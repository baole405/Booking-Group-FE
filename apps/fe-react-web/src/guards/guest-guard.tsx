import { ROUTES } from "@/constants/route.constant";
import type { RootState } from "@/redux/store";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.user);

  if (isAuthenticated) {
    switch (role) {
      case "ADMIN":
        return <Navigate to={ROUTES.ADMIN.ACCOUNTS} replace />;
      case "STUDENT":
        return <Navigate to={ROUTES.STUDENT.DASHBOARD} replace />;
      case "MODERATOR":
        return <Navigate to={ROUTES.MODERATOR.GROUPS} replace />;
      case "LECTURER":
        return <Navigate to={ROUTES.LECTURER.DASHBOARD} replace />;
      default:
        return <Navigate to="/404" replace />;
    }
  }

  return children;
}
