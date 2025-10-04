import HeaderMain from "@/components/layout/header/header-main";
import { SiteHeader } from "@/components/layout/header/site-header";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ROUTES } from "@/constants/route.constant";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RoleBasedLayout = () => {
  const role = useSelector((state: RootState) => state.user.role);

  if (!role) return <Navigate to={ROUTES.LOGIN} replace />;

  switch (role) {
    case "ADMIN":
    case "MODERATOR":
      return (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />
            <div>
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
      );

    case "LECTURER":
    case "STUDENT":
      return (
        <div className="flex min-h-screen flex-col">
          <HeaderMain />
          <div>
            <Outlet />
          </div>
        </div>
      );

    default:
      return <Navigate to={ROUTES.LOGIN} replace />;
  }
};

export default RoleBasedLayout;
