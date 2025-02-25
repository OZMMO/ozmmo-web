import IDBModel from "@/lib/interfaces/db-model.interface";
import { Canal } from "./canal";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";

export class CanalModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(criteria: ICriteria<Canal>): Promise<Canal | null> {
    return Promise.resolve(null);
  }

  async findMany(
    criteria: ICriteria<Canal> | undefined
  ): Promise<IResponseModel<Canal[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute("[Catalogos].[spBuscarCanales]");

      const data = result.recordset as Canal[];
      return Promise.resolve({ data, totalCount: data.length, totalPages: 1 });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
