import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar /> {/* Có thể custom sidebar riêng cho Admin */}
      <SidebarInset>
        <SiteHeader />

        <div className="bg-gray-50 p-6">
          {" "}
          {/* VD padding hoặc background khác */}
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
