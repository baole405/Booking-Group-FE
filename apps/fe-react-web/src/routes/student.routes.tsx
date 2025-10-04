import { ROUTES } from "@/constants/route.constant";
import RoleBasedGuard from "@/guards/role-based-guard";
import RoleBasedLayout from "@/layouts/RoleBasedLayout";
import ForumPage from "@/pages/home/forum/forum-page";
import HomePage from "@/pages/home/group/list-group-page";
import UserProfile from "@/pages/home/user/user-profile";
import type { TRole } from "@/schema/role.schema";

const studentRoutes = {
  path: ROUTES.STUDENT.ROOT,
  element: (
    <RoleBasedGuard allowedRoles={["STUDENT" as TRole]}>
      <RoleBasedLayout />
    </RoleBasedGuard>
  ),
  children: [
    { index: true, element: <HomePage /> },
    { path: ROUTES.STUDENT.GROUPS, element: <HomePage /> },
    { path: ROUTES.STUDENT.FORUM, element: <ForumPage /> },
    { path: ROUTES.STUDENT.PROFILE, element: <UserProfile /> },
    // thêm nhiều trang student ở đây
  ],
};

export default studentRoutes;
