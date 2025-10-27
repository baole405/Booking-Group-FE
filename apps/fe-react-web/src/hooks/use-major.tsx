import { majorApi } from "@/apis/major.api";
import type { TCreateMajor, TUpdateMajor } from "@/schema/major.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useMajorHook = () => {
  const useMajor = (id: number) =>
    useQuery({
      queryKey: ["major", id],
      queryFn: () => majorApi.getMajor(id),
    });

  const useMajorList = () =>
    useQuery({
      queryKey: ["majorList"],
      queryFn: () => majorApi.getMajorList(),
    });

  const useCreateMajor = () =>
    useMutation({
      mutationFn: (data: TCreateMajor) => majorApi.createMajor(data),
    });

  const useUpdateMajor = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: TUpdateMajor }) => majorApi.updateMajor(id, data),
    });

  const useDeleteMajor = () =>
    useMutation({
      mutationFn: (id: number) => majorApi.deleteMajor(id),
    });

  return {
    useMajor,
    useMajorList,
    useCreateMajor,
    useUpdateMajor,
    useDeleteMajor,
  };
};
