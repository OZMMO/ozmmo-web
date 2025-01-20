export interface IResponseModel<T> {
  data: T,
  totalCount: number,
  totalPages: number
}