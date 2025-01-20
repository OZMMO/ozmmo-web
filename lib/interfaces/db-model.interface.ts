import { MSSQLServer } from "../mssqlserver";
import ICriteria from "./criteria.interface";
import {IResponseModel} from "./response-model.interface";

export default interface IDBModel<T> {
  sql: MSSQLServer;
  findUnique(criteria: ICriteria<T>): Promise<T | null>;
  findMany(criteria?: ICriteria<T>): Promise<IResponseModel<T[]>>;
  create(data: T): Promise<T>;
  update(data: T): Promise<T>;
  delete(data: T): Promise<T>;
  count(criteria?: ICriteria<T>): Promise<number>;
}
