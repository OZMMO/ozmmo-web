import { type Request } from "mssql"
import CriteriaParameter from "./criteria-parameter.model";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { SQLDataTypes } from "../data-types";

export class CriteriaSqlServer<T> implements ICriteria<T> {
  parameters: CriteriaParameter[] = [];
  addConditition(name: keyof T, value: any): this {
    this.parameters.push({ Name: String(name), Value: value });
    return this; // Permite el encadenamiento
  }
  toSql(request: Request): void {
    for (const { Name, Value } of this.parameters) {
      if (typeof Value === 'number') {
        if (Number.isInteger(Value)) {
          request.input(Name, SQLDataTypes.Int, Value); // Números enteros
        } else {
          request.input(Name, SQLDataTypes.Float, Value); // Números decimales
        }
      } else if (typeof Value === 'string') {
        request.input(Name, SQLDataTypes.VarChar(SQLDataTypes.MAX), Value); // Cadenas de texto
      } else if (typeof Value === 'boolean') {
        request.input(Name, SQLDataTypes.Bit, Value); // Booleanos
      } else if (Value instanceof Date) {
        request.input(Name, SQLDataTypes.DateTime, Value); // Fechas
      } else if (Value instanceof Buffer) {
        request.input(Name, SQLDataTypes.VarBinary(SQLDataTypes.MAX), Value); // Binarios
      } else if (typeof Value === 'bigint') {
        request.input(Name, SQLDataTypes.BigInt, Value); // BigInt
      } else if (typeof Value === 'object' && Value !== null) {
        request.input(Name, SQLDataTypes.NVarChar(SQLDataTypes.MAX), JSON.stringify(Value)); // JSON como cadena
      } else if (Value === null || Value === undefined) {
        request.input(Name, SQLDataTypes.Null); // Nulos
      } else {
        throw new Error(`Unsupported data type for SQL Server input: ${typeof Value}`);
      }
    }
  }
}

/*
private parameters: CriteriaParameter[] = [];
  addConditition(parameter: CriteriaParameter): this {
    this.parameters.push(parameter);
    return this; // Permite el encadenamiento
  }
  toSql(request: Request) {
    for (const {Name, Value} of this.parameters) {
        if (typeof Value === 'number') {
          request.input(Name, sql.Int, value); // Por ejemplo, si el valor es un número, usa sql.Int
        } else if (typeof value === 'string') {
          request.input(key, sql.VarChar, value);
        } else if (value instanceof Date) {
          request.input(key, sql.DateTime, value);
        }
    }
    // for (const [key, value] of Object.entries(parameters)) {
    // }
  }




private parameters: Partial<T> = {};

  addCondition(parameter: keyof T, value: any): this {
    this.parameters[parameter] = value;
    return this; // Permite el encadenamiento
  }

  toSql(request: Request): Partial<T> {
    return this.parameters;
  }
*/