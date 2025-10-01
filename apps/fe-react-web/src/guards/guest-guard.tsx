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
      case "Admin":
        return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
      case "Student":
        return <Navigate to={ROUTES.STUDENT.DASHBOARD} replace />;
      case "Moderator":
        return <Navigate to={ROUTES.MODERATOR.DASHBOARD} replace />;
      case "Lecture":
        return <Navigate to={ROUTES.LECTURE.DASHBOARD} replace />;
      default:
        return <Navigate to="/404" replace />;
    }
  }

  return children;
}
