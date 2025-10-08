import { ideaApi } from "@/apis/idea.api";
import { useQuery } from "@tanstack/react-query";

export const useIdeaHook = () => {
  const useIdeaListByGroupId = (id: number) =>
    useQuery({
      queryKey: ["ideaList", id],
      queryFn: () => ideaApi.getIdeaList(id),
    });

  return {
    useIdeaListByGroupId,
  };
};
