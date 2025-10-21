import { apiRequest } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";

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
