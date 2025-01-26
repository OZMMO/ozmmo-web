import IDBModel from "@/lib/interfaces/db-model.interface";
import { UnidadesMedida } from "./unidades_medida";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";

export class UnidadesMedidaModel implements IDBModel<UnidadesMedida> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(
    criteria: ICriteria<UnidadesMedida>
  ): Promise<UnidadesMedida | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute(
        "[Almacen].[spBuscarCatUnidadesMedida]"
      );
      const data = result.recordset as UnidadesMedida[];
      return Promise.resolve(data[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findMany(
    criteria: ICriteria<UnidadesMedida> | undefined
  ): Promise<IResponseModel<UnidadesMedida[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute(
        "[Almacen].[spBuscarCatUnidadesMedida]"
      );

      const data = result.recordset as UnidadesMedida[];

      return Promise.resolve({
        data: data,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async create(unidadMedida: UnidadesMedida): Promise<UnidadesMedida> {
    throw new Error("Method not implemented.");
  }
  async update(unidadMedida: UnidadesMedida): Promise<UnidadesMedida> {
    throw new Error("Method not implemented.");
  }
  async delete(unidadMedida: UnidadesMedida): Promise<UnidadesMedida> {
    throw new Error("Method not implemented.");
  }
  count(criteria?: ICriteria<UnidadesMedida> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
