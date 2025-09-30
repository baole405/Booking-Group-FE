export const ROUTES = {
  // Root paths
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",

  GROUP: "/group",

  // Admin Routes
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    MOVIE: "/admin/movie",
    GENRES: "/admin/genres",
    CINEMA_ROOM: "/admin/cinema-room",
    SEAT_TYPES: "/admin/seat-types",
    BOOKING: "/admin/booking",
    PROMOTION: "/admin/promotion",
    MEMBERS: "/admin/members",
    SHOWTIME: "/admin/showtime",
    SHOWTIME_TABLE: "/admin/showtime-table",
    STAFFS: "/admin/staffs",
    COMBO: "/admin/combo",
    SNACKS: "/admin/snacks",
    SPOTLIGHT: "/admin/spotlight",
  },

  // Staff Routes
  STAFF: {
    ROOT: "/staff",
    TICKET_SALES: "/staff/ticket-sales",
    BOOKING: "/staff/booking",
  },

  // Auth Routes
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    // eslint-disable-next-line sonarjs/no-hardcoded-passwords
    FORGOT_PASSWORD: "/auth/forgot-password",
  },

  // User Account Routes
  ACCOUNT: "/account",

  //tự thêm
};
