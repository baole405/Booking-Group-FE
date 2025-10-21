import { majorApi } from "@/apis/major.api";
import type { TMajor } from "@/schema/major.schema";
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
      mutationFn: (data: TMajor) => majorApi.createMajor(data),
    });

  const useUpdateMajor = (id: number) =>
    useMutation({
      mutationFn: (data: TMajor) => majorApi.updateMajor(id, data),
    });

  const useDeleteMajor = (id: number) =>
    useMutation({
      mutationFn: () => majorApi.deleteMajor(id),
    });

  return {
    useMajor,
    useMajorList,
    useCreateMajor,
    useUpdateMajor,
    useDeleteMajor,
  };
};
