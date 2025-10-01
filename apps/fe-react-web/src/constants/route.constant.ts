export const ROUTES = {
  // Root paths
  HOME: "/",
  REGISTER: "/register",

  // Auth Routes
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
  },

  // Student Routes
  STUDENT: {
    ROOT: "/student",
    GROUPS: "/student/groups",
    GROUP_DETAIL: "/student/groups/:id",
    PROFILE: "/student/profile",
    DASHBOARD: "/student/dashboard",
    COURSES: "/student/courses",
    ASSIGNMENTS: "/student/assignments",
    RESULTS: "/student/results",
    FORUM: "/student/forum",
    FORUM_DETAIL: "/student/forum/:id",
    IDEAS: "/student/ideas",
    IDEAS_DETAIL: "/student/ideas/:id",
  },

  // Admin Routes
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    ROLES: "/admin/roles",
    SETTINGS: "/admin/settings",
  },

  // Moderator Routes
  MODERATOR: {
    ROOT: "/moderator",
    DASHBOARD: "/moderator/dashboard",
    FORUMS: "/moderator/forums",
    REPORTS: "/moderator/reports",
  },

  // Lecture Routes
  LECTURE: {
    ROOT: "/lecture",
    DASHBOARD: "/lecture/dashboard",
    COURSES: "/lecture/courses",
    ASSIGNMENTS: "/lecture/assignments",
    STUDENTS: "/lecture/students",
  },
};
