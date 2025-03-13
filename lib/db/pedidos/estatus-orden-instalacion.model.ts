import IDBModel from "@/lib/interfaces/db-model.interface";
import { EstatusOrdenInstalacion } from "./estatatus-orden-instalacion";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";

export class EstatusOrdenInstalacionModel
  implements IDBModel<EstatusOrdenInstalacion>
{
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(
    criteria: ICriteria<EstatusOrdenInstalacion>
  ): Promise<EstatusOrdenInstalacion | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute(
        "[Pedidos].[spBuscarEstatusOrdenInstalacionClientes]"
      );
      const data = result.recordset as EstatusOrdenInstalacion[];
      return Promise.resolve(data[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findMany(
    criteria: ICriteria<EstatusOrdenInstalacion> | undefined
  ): Promise<IResponseModel<EstatusOrdenInstalacion[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute(
        "[Pedidos].[spBuscarEstatusOrdenInstalacionClientes]"
      );

      const data = result.recordset as EstatusOrdenInstalacion[];

      return Promise.resolve({
        data: data,
        totalCount: data.length,
        totalPages: 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async create(
    estatusOrdenInstalacion: EstatusOrdenInstalacion
  ): Promise<EstatusOrdenInstalacion> {
    throw new Error("Method not implemented.");
  }
  async update(
    estatusOrdenInstalacion: EstatusOrdenInstalacion
  ): Promise<EstatusOrdenInstalacion> {
    throw new Error("Method not implemented.");
  }
  async delete(
    estatusOrdenInstalacion: EstatusOrdenInstalacion
  ): Promise<EstatusOrdenInstalacion> {
    throw new Error("Method not implemented.");
  }
  count(
    criteria?: ICriteria<EstatusOrdenInstalacion> | undefined
  ): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
