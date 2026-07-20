export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
}

