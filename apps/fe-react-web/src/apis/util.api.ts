// api-suffix.ts
export const API_SUFFIX = {
  // ───────────────────── Auth ─────────────────────
  AUTH_API: "/auth/login", // Đăng nhập thường
  GOOGLE_AUTH_API: "/auth/google-login", // Đăng nhập Google OAuth

  // ───────────────────── Users ────────────────────
  USER_API: "/users", // CRUD user (base)
  MY_PROFILE_API: "/users/myInfo", // Lấy thông tin user hiện tại (me)

  // ───────────────────── Majors ───────────────────
  MAJOR_API: "/majors", // Danh mục ngành học

  // ──────────────────── Semesters ─────────────────
  SEMESTER_API: "/semesters", // Kỳ học

  // ───────────────────── Groups ───────────────────
  GROUP_API: "/groups", // CRUD nhóm (base)
  GROUP_MEMBER_API: "/groups/members", // Lấy/Xử lý thành viên nhóm (cấp nhóm)
  GROUPID_BY_USERID_API: "/groups/user", // Lấy group theo user
  MY_GROUP_API: "/groups/my-group", // Group của user hiện tại
  LEAVE_GROUP_API: "/groups/leave", // Rời nhóm
  UPDATE_GROUP_API: "/groups/update", // Cập nhật thông tin nhóm
  TRANSFER_LEADER_API: "/groups/change-leader", // Chuyển quyền trưởng nhóm
  DONE_GROUP_API: "/groups/done", // Finalize team (PATCH)
  CHANGE_TYPE_GROUP_API: "/groups/change-type", // Đổi loại nhóm (PATCH)

  // ───────────────────── Ideas ────────────────────
  IDEA_API: "/ideas", // CRUD ý tưởng (base)
  IDEA_GROUP_API: "/ideas/group", // Lấy ý tưởng theo group

  // ───────────────────── Joins ────────────────────
  JOIN_GROUP_API: "/joins", // Join group (gửi yêu cầu/duyệt)
  MY_JOIN_GROUP_API: "/joins/my-requests", // Yêu cầu tham gia nhóm của tôi

  VOTE_API: "/votes", // Vote cho ý tưởng
  VOTE_BY_GROUP_API: "/votes/group",

  POST_API: "/posts", // Lấy bài viết theo group

  COMMENT_API: "/comments", // Lấy bình luận theo bài viết

  TEACHER_CHECKPOINT_API: "/teacher-checkpoints", // Checkpoint của giảng viên

  INVITE_API: "/invites", // Lời mời tham gia nhóm
  MY_INVITES_API: "/invites/my", // Lời mời của tôi (đã gửi và đã nhận)

  CHAT_API: "/chat", // Chat messages API
  CHATBOT_API: "/chatbot", // AI chatbot assistant

  WHITELIST_API: "/excel", // Email whitelist management
  EXCEL_API: "/excel/whitelist", // Excel export/import
};
