import { majorApi } from "@/apis/major.api";
import type { TMajor } from "@/schema/major.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useMajorHook = () => {
  const useMajor = (code: string) =>
    useQuery({
      queryKey: ["major", code],
      queryFn: () => majorApi.getMajor(code),
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

  const useUpdateMajor = (code: string) =>
    useMutation({
      mutationFn: (data: TMajor) => majorApi.updateMajor(code, data),
    });

  const useDeleteMajor = (code: string) =>
    useMutation({
      mutationFn: () => majorApi.deleteMajor(code),
    });

  return {
    useMajor,
    useMajorList,
    useCreateMajor,
    useUpdateMajor,
    useDeleteMajor,
  };
};
