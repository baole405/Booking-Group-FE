import { groupApi } from "@/apis/group.api";
import type { UseGroupParams } from "@/schema/group.schema";
import { useQuery } from "@tanstack/react-query";

export const useGroupHook = () => {
  const useGroupList = (params: UseGroupParams) => {
    const {
      page = params.page || 1,
      size = params.size || 10,
      sort = params.sort || "id",
      dir = params.dir || "asc",
      status = params.status || null,
      type = params.type || null,
      q = params.q || "",
    } = params;
    return useQuery({
      queryKey: [
        "groupList",
        {
          page,
          size,
          sort,
          dir,
          status,
          type,
          q,
        },
      ],
      queryFn: () =>
        groupApi.getGroupList({
          page: page,
          size: size,
          sort: sort,
          dir: dir,
          status: status,
          type: type,
          q: q,
        }),
    });
  };

  const useGroupById = (id: number) =>
    useQuery({
      queryKey: ["groupdetail", id],
      queryFn: () => groupApi.getGroup(id),
    });

  return {
    useGroupList,
    useGroupById,
  };
};
