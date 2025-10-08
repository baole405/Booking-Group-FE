import { useState } from "react";

type Filter = { id: string; value: unknown };

type UseQueryParamsOptions = {
  defaultSortBy: string;
  defaultIsAsc?: boolean;
  defaultFilter?: Filter[];
};

export const useQueryParams = (options: UseQueryParamsOptions) => {
  const { defaultSortBy, defaultIsAsc = true, defaultFilter = [] } = options;

  const [currentPage, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>(defaultSortBy);
  const [isAsc, setIsAsc] = useState<boolean>(defaultIsAsc);
  const [filter, setFilterState] = useState<Filter[]>(defaultFilter);

  const setFilter = (id: string, value: unknown) => {
    setFilterState((prev) => {
      const existing = prev.find((f) => f.id === id);
      if (existing) {
        return prev.map((f) => (f.id === id ? { ...f, value } : f));
      }
      return [...prev, { id, value }];
    });
  };

  const setSort = (id: string, asc: boolean) => {
    setSortBy(id);
    setIsAsc(asc);
  };

  return {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    filter,
    setFilter,
    setSort,
    setPage: setPage,
    setPageSize,
  };
};
