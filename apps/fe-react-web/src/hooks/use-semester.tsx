import { semesterApi } from "@/apis/semester.api";
import type { TSemester, TUpdateSemester } from "@/schema/semester.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSemesterHook = () => {
  const useSemesterList = () =>
    useQuery({
      queryKey: ["semesterList"],
      queryFn: () => semesterApi.getSemesterList(),
    });

  const useCreateSemester = () =>
    useMutation({
      mutationFn: (data: Pick<TSemester, "name">) => semesterApi.createSemester({ ...data, active: true }),
    });
  const useUpdateStatusSemester = () =>
    useMutation({
      mutationFn: (id: number) => semesterApi.updateStatusSemester(id),
    });
  const useUpdateSemester = () =>
    useMutation({
      mutationFn: ({ id, data }: { id: number; data: TUpdateSemester }) => semesterApi.updateSemester(id, data),
    });
  return {
    useSemesterList,
    useCreateSemester,
    useUpdateStatusSemester,
    useUpdateSemester,
  };
};
