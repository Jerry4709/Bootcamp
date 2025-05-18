export interface PaginateParams {
  page: number;
  limit: number;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
}
