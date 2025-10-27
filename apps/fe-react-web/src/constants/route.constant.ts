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
    FORUM_EDIT: "/student/forum/edit/:id/",
    IDEAS: "/student/ideas",
    IDEAS_DETAIL: "/student/ideas/:id",
    MY_GROUP: "/student/mygroup",
    MY_PROFILE: "/student/myprofile",
    JOIN_REQUESTS: "/student/joinrequests",
    IDEA_LIST: "/student/ideas",
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
    MAJORS: "/admin/majors",
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
    GROUP_DETAIL: "/lecturer/groups/:id",
    FORUMS: "/lecturer/forum",
    IDEAS: "/lecturer/ideas",
    FORUM_DETAIL: "/lecturer/forum/:id",
    IDEAS_DETAIL: "/lecturer/ideas/:id",
    MY_PROFILE: "/lecturer/myprofile",
    PROFILE: "/lecturer/profile/:id",
    CHECKPOINT_REQUESTS: "/lecturer/checkpoint-requests",
  },
};
