import IDBModel from "@/lib/interfaces/db-model.interface";
import { Lote } from "./lote";
import { MSSQLServer } from "@/lib/mssqlserver";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";

export class LoteModel implements IDBModel<Lote> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(criteria: ICriteria<Lote>): Promise<Lote | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarLotes]");
      const data = result.recordset as Lote[];
      return Promise.resolve(data[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findMany(
    criteria: ICriteria<Lote> | undefined
  ): Promise<IResponseModel<Lote[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarLotes]");
      const data = result.recordset as Lote[];
      return Promise.resolve({
        data: data,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(lote: Lote): Promise<Lote> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      // Asegurarse de que los valores sean del tipo correcto
      request.input(
        "codigo_lote",
        this.sql.dataTypes.VarChar,
        lote.codigo_lote || ""
      );
      request.input("producto_id", this.sql.dataTypes.Int, lote.producto_id);
      request.input(
        "fecha_fabricacion",
        this.sql.dataTypes.DateTime,
        lote.fecha_fabricacion
      );
      request.input(
        "fecha_expiracion",
        this.sql.dataTypes.DateTime,
        lote.fecha_expiracion
      );
      request.input("cantidad_inicial", lote.cantidad_inicial);
      request.input("cantidad_disponible", lote.cantidad_disponible);
      request.input(
        "estado_lote_id",
        this.sql.dataTypes.Int,
        lote.estado_lote_id
      );
      request.input("recepcion_id", this.sql.dataTypes.Int, lote.recepcion_id);
      request.input("estatus", this.sql.dataTypes.Bit, lote.estatus ? 1 : 0);
      request.input("ubicacion_id", this.sql.dataTypes.Int, lote.ubicacion_id);
      request.input(
        "trazabilidad_lotes",
        this.sql.dataTypes.VarCharMAX,
        typeof lote.trazabilidad_lotes === "string"
          ? lote.trazabilidad_lotes
          : JSON.stringify(lote.trazabilidad_lotes)
      );
      request.input("UserId", this.sql.dataTypes.VarChar, lote.UserId || "");

      const result = await request.execute("[Almacen].[spIULote]");
      const data = (result.recordset[0] || null) as Lote;

      return data;
    } catch (error) {
      console.error("Error in LoteModel.create:", error);
      return Promise.reject(error);
    }
  }

  async update(lote: Lote): Promise<Lote> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      request.input("id", lote.id);
      request.input("codigo_lote", lote.codigo_lote);
      request.input("producto_id", lote.producto_id);
      request.input("fecha_fabricacion", lote.fecha_fabricacion);
      request.input("fecha_expiracion", lote.fecha_expiracion);
      request.input("cantidad_inicial", lote.cantidad_inicial);
      request.input("cantidad_disponible", lote.cantidad_disponible);
      request.input("estado_lote_id", lote.estado_lote_id);
      request.input("recepcion_id", lote.recepcion_id);
      request.input("estatus", lote.estatus);
      request.input("ubicacion_id", lote.ubicacion_id);
      request.input(
        "trazabilidad_lotes",
        JSON.stringify(lote.trazabilidad_lotes)
      );
      request.input("UserId", lote.UserId);
      const result = await request.execute("[Almacen].[spIULote]");
      console.log("data-return", "asdf");
      const data = result.recordset as Lote[];
      return Promise.resolve(data[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(lote: Lote): Promise<Lote> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      request.input("id", lote.id);
      const result = await request.execute("[Almacen].[spEliminarLote]");
      const data = result.recordset as Lote[];
      return Promise.resolve(data[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async count(criteria: ICriteria<Lote>): Promise<number> {
    return Promise.resolve(0);
  }
}
