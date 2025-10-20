export interface PaginationDTO<T, R> {
  page: string;
  limit: string;
  option?: T;
  sort?: R;
}
