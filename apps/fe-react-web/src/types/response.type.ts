export type BaseResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type StatusResponse = {
  status: number;
  message: string;
};
export type PaginationResponse<T> = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  sort: string;
  content: T[];
};

export type ErrorResponse<T> = BaseResponse<T>;
