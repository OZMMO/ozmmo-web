import { type Request } from "mssql"
import CriteriaParameter from "../db/criteria/criteria-parameter.model";

export default interface ICriteria<T> {
  // parameters: T[];
  addConditition(name: keyof T, value: any) : this;
  toSql(request: Request): void;
}
