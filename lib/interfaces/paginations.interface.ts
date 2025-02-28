export interface IPagination {
  page: number;
  pageSize: number;
  totalPages?: number;
  totalCount?: number;
  query?: string;
  orderByColumn?: string;
  orderDirection?: string;
}

export interface IPageSearchPaginationParams {
  page?: string;
  pageSize?: string;
  query?: string;
  orderByColumn?: string;
  orderDirection?: string;
}

