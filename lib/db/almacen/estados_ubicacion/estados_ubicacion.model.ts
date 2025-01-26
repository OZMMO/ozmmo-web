import IDBModel from "@/lib/interfaces/db-model.interface";
import { EstadosUbicacion } from "./estados_ubicacion";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";

export class EstadosUbicacionModel implements IDBModel<EstadosUbicacion> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(
    criteria: ICriteria<EstadosUbicacion>
  ): Promise<EstadosUbicacion | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute(
        "[Almacen].[spBuscarCatEstadosUbicacion]"
      );
      const data = result.recordset as EstadosUbicacion[];
      return Promise.resolve(data[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findMany(
    criteria: ICriteria<EstadosUbicacion> | undefined
  ): Promise<IResponseModel<EstadosUbicacion[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute(
        "[Almacen].[spBuscarCatEstadosUbicacion]"
      );

      const data = result.recordset as EstadosUbicacion[];

      return Promise.resolve({
        data: data,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async create(estadosUbicacion: EstadosUbicacion): Promise<EstadosUbicacion> {
    throw new Error("Method not implemented.");
  }
  async update(estadosUbicacion: EstadosUbicacion): Promise<EstadosUbicacion> {
    throw new Error("Method not implemented.");
  }
  async delete(estadosUbicacion: EstadosUbicacion): Promise<EstadosUbicacion> {
    throw new Error("Method not implemented.");
  }
  count(criteria?: ICriteria<EstadosUbicacion> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
