import { semesterApi } from "@/apis/semester.api";
import { apiRequest } from "@/lib/http";
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
export interface Semester {
  id: number;
  name: string;
  active: boolean;
}

export function useSemesterList() {
  return useQuery<Semester[]>({
    queryKey: ["semesters"],
    queryFn: async () => {
      const res = await apiRequest.get("/semesters");
      // API trả về { status, message, data: Semester[] }
      return res.data.data;
    },
  });
}
