import IDBModel from "@/lib/interfaces/db-model.interface";
import { Recepcion } from "./recepcion";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";

export class RecepcionModel implements IDBModel<Recepcion> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(criteria: ICriteria<Recepcion>): Promise<Recepcion | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarRecepciones]");
      const data = result.recordset as Recepcion[];
      return Promise.resolve(data[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findMany(
    criteria: ICriteria<Recepcion> | undefined
  ): Promise<IResponseModel<Recepcion[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarRecepciones]");

      const data = result.recordset as Recepcion[];

      return Promise.resolve({
        data: data,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async create(recepcion: Recepcion): Promise<Recepcion> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("fecha_recepcion", recepcion.fecha_recepcion)
        .input("proveedor_id", recepcion.proveedor_id)
        .input("bodega_id", recepcion.bodega_id)
        .input("completado", recepcion.completado)
        .input("estatus", recepcion.estatus)
        .input("UserId", recepcion.UserId)
        .execute("[Almacen].[spIURecepciones]");

      const data = ((result.recordset[0] || null) as Recepcion) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async update(recepcion: Recepcion): Promise<Recepcion> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("fecha_recepcion", recepcion.fecha_recepcion)
        .input("proveedor_id", recepcion.proveedor_id)
        .input("bodega_id", recepcion.bodega_id)
        .input("completado", recepcion.completado)
        .input("estatus", recepcion.estatus)
        .input("UserId", recepcion.UserId)
        .input("id", recepcion.id)
        .execute("[Almacen].[spIURecepciones]");

      const data = ((result.recordset[0] || null) as Recepcion) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async delete(recepcion: Recepcion): Promise<Recepcion> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", this.sql.dataTypes.VarChar, recepcion.id)
        .input("UserId", this.sql.dataTypes.VarChar, recepcion.UserId)
        .execute(`[Almacen].[spBorrarRecepciones]`);

      const dataResult = ((result.recordset[0] || null) as Recepcion) || null;
      return Promise.resolve(dataResult);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  count(criteria?: ICriteria<Recepcion> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
