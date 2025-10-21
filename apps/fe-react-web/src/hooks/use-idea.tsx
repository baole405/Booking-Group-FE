import { ideaApi } from "@/apis/idea.api";
import type { TCreateIdea, TUpdateIdea } from "@/schema/ideas.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useIdeaHook = () => {
  const useIdeaListByGroupId = (id: number) =>
    useQuery({
      queryKey: ["ideaList", id],
      queryFn: () => ideaApi.getIdeaList(id),
    });
  const useCreateIdea = () =>
    useMutation({
      mutationFn: (data: TCreateIdea) => ideaApi.createIdea(data),
    });
  const useUpdateIdea = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number, data: TUpdateIdea }) => ideaApi.updateIdea(id, data),
    });
  const useDeleteIdea = () =>
    useMutation({
      mutationFn: (id: number) => ideaApi.deleteIdea(id),
    });
  const useGetAllIdeas = () =>
    useQuery({
      queryKey: ["allIdeas"],
      queryFn: () => ideaApi.getAllIdeas(),
    });

  return {
    useIdeaListByGroupId,
    useCreateIdea,
    useUpdateIdea,
    useDeleteIdea,
    useGetAllIdeas
  };
};
