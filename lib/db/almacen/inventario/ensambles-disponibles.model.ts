import IDBModel from "@/lib/interfaces/db-model.interface";
import { EnsambleDisponible } from "./ensambles-disponibles";
import { MSSQLServer } from "@/lib/mssqlserver";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";

export class EnsambleDisponibleModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(
    criteria: ICriteria<EnsambleDisponible>
  ): Promise<EnsambleDisponible | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute(
        "[Almacen].[spBuscarEnsamblesDisponibles]"
      );
      const data = result.recordset as EnsambleDisponible[];

      return Promise.resolve(data[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findMany(
    criteria: ICriteria<EnsambleDisponible> | undefined
  ): Promise<IResponseModel<EnsambleDisponible[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute(
        "[Almacen].[spBuscarEnsamblesDisponibles]"
      );
      const data = result.recordset as EnsambleDisponible[];

      return Promise.resolve({
        data: data,
        totalCount: data.length,
        totalPages: 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
