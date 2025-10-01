export type BaseResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type PaginationResponse<T> = {
  size: number;
  page: number;
  total: number;
  totalPages: number;
  items: T[];
};

export type ErrorResponse<T> = BaseResponse<T>;
