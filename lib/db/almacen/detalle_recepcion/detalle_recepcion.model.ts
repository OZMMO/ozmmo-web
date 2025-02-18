import IDBModel from "@/lib/interfaces/db-model.interface";
import { DetalleRecepcion } from "./detalle_recepcion";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";

export class DetalleRecepcionModel implements IDBModel<DetalleRecepcion> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(
    criteria: ICriteria<DetalleRecepcion>
  ): Promise<DetalleRecepcion | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute(
        "[Almacen].[spBuscarDetalleRecepcion]"
      );
      const data = result.recordset as DetalleRecepcion[];
      return Promise.resolve(data[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findMany(
    criteria: ICriteria<DetalleRecepcion> | undefined
  ): Promise<IResponseModel<DetalleRecepcion[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarDetalleRecepcion]");

      const data = result.recordset as DetalleRecepcion[];

      return Promise.resolve({
        data: data,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async create(detalleRecepcion: DetalleRecepcion): Promise<DetalleRecepcion> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("recepcion_id", detalleRecepcion.recepcion_id)
        .input("producto_id", detalleRecepcion.producto_id)
        .input("cantidad", detalleRecepcion.cantidad)
        .input("unidad_medida_id", detalleRecepcion.unidad_medida_id)
        .input("UserId", detalleRecepcion.UserId)
        .execute("[Almacen].[spIUDetalleRecepcion]");

      const data = ((result.recordset[0] || null) as DetalleRecepcion) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async update(detalleRecepcion: DetalleRecepcion): Promise<DetalleRecepcion> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("recepcion_id", detalleRecepcion.recepcion_id)
        .input("producto_id", detalleRecepcion.producto_id)
        .input("cantidad", detalleRecepcion.cantidad)
        .input("unidad_medida_id", detalleRecepcion.unidad_medida_id)
        .input("UserId", detalleRecepcion.UserId)
        .input("id", detalleRecepcion.id)
        .execute("[Almacen].[spIUDetalleRecepcion]");

      const data = ((result.recordset[0] || null) as DetalleRecepcion) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async delete(detalleRecepcion: DetalleRecepcion): Promise<DetalleRecepcion> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", this.sql.dataTypes.Int, detalleRecepcion.id)
        .input("UserId", this.sql.dataTypes.VarChar, detalleRecepcion.UserId)
        .execute(`[Almacen].[spBorrarDetalleRecepcion]`);

      const dataResult =
        ((result.recordset[0] || null) as DetalleRecepcion) || null;
      return Promise.resolve(dataResult);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  count(criteria?: ICriteria<DetalleRecepcion> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
