import type { RootState } from "@/redux/store";
import { ArrowUpCircleIcon, ClipboardListIcon, DatabaseIcon, LayoutDashboardIcon, ListIcon, MailCheckIcon, UsersIcon } from "lucide-react";
import * as React from "react";
import { useSelector } from "react-redux";

import { NavDocuments } from "@/components/layout/sidebar/nav-documents";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ROUTES } from "@/constants/route.constant";

// Chỉ chứa menu theo role, không chứa user
const menuData = {
  ADMIN: [
    {
      title: "Tài khoản",
      url: ROUTES.ADMIN.ACCOUNTS,
      icon: LayoutDashboardIcon,
    },
    {
      title: "Kỳ học",
      url: ROUTES.ADMIN.SEMESTERS,
      icon: ListIcon,
    },
    {
      title: "Chuyên ngành",
      url: ROUTES.ADMIN.MAJORS,
      icon: UsersIcon,
    },
    {
      title: "Whitelist Email",
      url: ROUTES.ADMIN.WHITELIST,
      icon: MailCheckIcon,
    },
  ],
  MODERATOR: [
    {
      title: "Nhóm sinh viên",
      url: ROUTES.MODERATOR.GROUPS,
      icon: LayoutDashboardIcon,
    },
    {
      title: "Diễn đàn",
      url: ROUTES.MODERATOR.FORUMS,
      icon: ListIcon,
    },
    {
      title: "Danh sách sinh viên",
      url: ROUTES.MODERATOR.STUDENTS,
      icon: DatabaseIcon,
    },
    {
      title: "Danh sách giảng viên",
      url: ROUTES.MODERATOR.LECTURERS,
      icon: ClipboardListIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Lấy user & role từ Redux state
  const { user, role } = useSelector((state: RootState) => state.user);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="dashboard">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">CoFound</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content: Hiển thị menu theo role */}
      <SidebarContent>
        <NavDocuments items={menuData[role as keyof typeof menuData] || []} />
      </SidebarContent>

      {/* Footer: Hiển thị user info */}
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
