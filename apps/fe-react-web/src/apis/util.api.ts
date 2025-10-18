export const normalizeParams = (filters: any) => {
  const normalized = { ...filters };
  const sort = filters.sort?.split(",");

  if (Array.isArray(sort) && sort.length) {
    normalized.sortBy = sort[0];
    normalized.sortDirection = sort[1];
  }

  const removeEmptyValueParams = Object.fromEntries(Object.entries(normalized).filter(([_, v]) => v != null));
  return removeEmptyValueParams;
};

export const API_SUFFIX = {
  // Auth
  AUTH_API: "/auth/login",
  GOOGLE_AUTH_API: "/auth/google-login",
  USER_API: "/users",
  GROUPID_BY_USERID_API: "/groups/user",
  MY_PROFILE_API: "/users/myInfo",
  MAJOR_API: "/majors",
  GROUP_API: "/groups",
  IDEA_API: "/ideas",
  IDEA_GROUP_API: "/ideas/group",
  SEMESTER_API: "/semesters",
  MY_GROUP_API: "/groups/my-group",
  LEAVE_GROUP_API: "/groups/leave",
  UPDATE_GROUP_API: "/groups/update",
  JOIN_GROUP_API: "/joins",
};
