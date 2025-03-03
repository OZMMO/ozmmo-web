import IDBModel from "@/lib/interfaces/db-model.interface";
import { Ubicacion } from "./ubicaciones";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";

export class UbicacionesModel implements IDBModel<Ubicacion> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(
    criteria: ICriteria<Ubicacion>
  ): Promise<Ubicacion | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarUbicaciones]");
      const data = result.recordset as Ubicacion[];
      return Promise.resolve(data[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findMany(
    criteria: ICriteria<Ubicacion> | undefined
  ): Promise<IResponseModel<Ubicacion[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarUbicaciones]");

      const data = result.recordset as Ubicacion[];

      return Promise.resolve({
        data: data,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async create(ubicacion: Ubicacion): Promise<Ubicacion> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("descripcion", ubicacion.descripcion)
        .input("capacidad_maxima", ubicacion.capacidad_maxima)
        .input("estado_ubicacion_id", ubicacion.estado_ubicacion_id)
        .input("estatus", ubicacion.estatus)
        .input("bodega_id", ubicacion.bodega_id)
        .input("UserId", ubicacion.UserId)
        .execute("[Almacen].[spIUUbicaciones]");

      const data = ((result.recordset[0] || null) as Ubicacion) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async update(ubicacion: Ubicacion): Promise<Ubicacion> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("descripcion", ubicacion.descripcion)
        .input("capacidad_maxima", ubicacion.capacidad_maxima)
        .input("estado_ubicacion_id", ubicacion.estado_ubicacion_id)
        .input("estatus", ubicacion.estatus)
        .input("bodega_id", ubicacion.bodega_id)
        .input("UserId", ubicacion.UserId)
        .input("id", ubicacion.id)
        .execute("[Almacen].[spIUUbicaciones]");

      const data = ((result.recordset[0] || null) as Ubicacion) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async delete(ubicacion: Ubicacion): Promise<Ubicacion> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", this.sql.dataTypes.VarChar, ubicacion.id)
        .input("UserId", this.sql.dataTypes.VarChar, ubicacion.UserId)
        .execute(`[Catalogos].[spBorrarSucursales]`);

      const dataResult = ((result.recordset[0] || null) as Ubicacion) || null;
      return Promise.resolve(dataResult);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  count(criteria?: ICriteria<Ubicacion> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
