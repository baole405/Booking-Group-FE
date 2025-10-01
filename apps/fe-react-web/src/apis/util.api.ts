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
};
