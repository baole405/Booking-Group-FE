export const ROUTES = {
  // Root paths
  HOME: "/",
  LOGIN: "/login",
  LOGOUT: "/logout",

  // Student Routes
  STUDENT: {
    ROOT: "/student",
    GROUPS: "/student/groups",
    GROUP_DETAIL: "/student/groups/:id",
    PROFILE: "/student/profile/:id",
    DASHBOARD: "/student/groups",
    // COURSES: "/student/courses",
    // ASSIGNMENTS: "/student/assignments",
    // RESULTS: "/student/results",
    FORUM: "/student/forum",
    FORUM_DETAIL: "/student/forum/:id",
    IDEAS: "/student/ideas",
    IDEAS_DETAIL: "/student/ideas/:id",
    MY_GROUP: "/student/mygroup",
    MY_PROFILE: "/student/myprofile",
  },

  // Admin Routes
  ADMIN: {
    ROOT: "/admin",
    // DASHBOARD: "/admin/dashboard",
    // USERS: "/admin/users",
    // ROLES: "/admin/roles",
    // SETTINGS: "/admin/settings",
    ACCOUNTS: "/admin/accounts",
    GROUPS: "/admin/groups",
    LECTURERS: "/admin/lecturers",
    PROJECTS: "/admin/projects",
    STUDENTS: "/admin/students",
    SEMESTERS: "/admin/semesters",
  },

  // Moderator Routes
  MODERATOR: {
    ROOT: "/moderator",
    // DASHBOARD: "/moderator/dashboard",
    FORUMS: "/moderator/forums",
    // REPORTS: "/moderator/reports",
    GROUPS: "/moderator/groups",
    STUDENTS: "/moderator/students",
    LECTURERS: "/moderator/lecturers",
  },

  // Lecturer Routes
  LECTURER: {
    ROOT: "/lecturer",
    GROUPS: "/lecturer/groups",
    FORUMS: "/lecturer/forums",
    PROFILE: "/lecturer/profile",
    IDEAS: "/lecturer/ideas",
  },
};
