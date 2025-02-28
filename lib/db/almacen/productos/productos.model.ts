import IDBModel from "@/lib/interfaces/db-model.interface";
import { Productos } from "./productos";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";
import { Lote } from "../lotes/lote";

export class ProductosModel implements IDBModel<Productos> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

async findUnique(criteria: ICriteria<Productos & { SoloEnsambles?: boolean, SoloActivos?: boolean }>): Promise<Productos | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarProductos]");
      const data = result.recordset as Productos[];

      const parseData = data.map((item) => {
        item.materiales = item.materiales && typeof item.materiales === "string" ? JSON.parse(item.materiales) : item.materiales;
        item.fecha_registro = item.fecha_registro
          ? new Date(item.fecha_registro)
          : undefined;
        return item;
      });
      
      return Promise.resolve(parseData[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findMany(
    criteria: ICriteria<Productos & { SoloEnsambles?: boolean, SoloActivos?: boolean }> | undefined
  ): Promise<IResponseModel<Productos[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarProductos]");

      const data = result.recordset as Productos[];

      const parseData = data.map((item) => {
        item.materiales = item.materiales && typeof item.materiales === "string" ? JSON.parse(item.materiales) : item.materiales;
        item.fecha_registro = item.fecha_registro
          ? new Date(item.fecha_registro)
          : undefined;
        return item;
      });

      return Promise.resolve({
        data: parseData,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(producto: Productos): Promise<Productos> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("codigo", producto.codigo)
        .input("codigo_proveedor", producto.codigo_proveedor)
        .input("descripcion", producto.descripcion)
        .input("unidad_medida_id", producto.unidad_medida_id)
        .input("peso", producto.peso)
        .input("volumen", producto.volumen)
        .input("estatus", producto.estatus)
        .input("es_ensamble", producto.es_ensamble)
        .input("UserId", producto.UserId)
        .execute("[Almacen].[spIUProductos]");

      const data = ((result.recordset[0] || null) as Productos) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(producto: Productos): Promise<Productos> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("codigo", producto.codigo)
        .input("codigo_proveedor", producto.codigo_proveedor)
        .input("descripcion", producto.descripcion)
        .input("unidad_medida_id", producto.unidad_medida_id)
        .input("peso", producto.peso)
        .input("volumen", producto.volumen)
        .input("estatus", producto.estatus)
        .input("es_ensamble", producto.es_ensamble)
        .input("UserId", producto.UserId)
        .input("id", producto.id)
        .execute("[Almacen].[spIUProductos]");

      const data = ((result.recordset[0] || null) as Productos) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(producto: Productos): Promise<Productos> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", producto.id)
        .input("UserId", producto.UserId)
        .execute(`[Catalogos].[spBorrarProductos]`);

      const dataResult = ((result.recordset[0] || null) as Productos) || null;
      return Promise.resolve(dataResult);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  count(criteria?: ICriteria<Productos> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async getProductosDisponibles({ bodega_id, producto_id, cantidad_minima, UserId }: { bodega_id: number, producto_id: number, cantidad_minima: number, UserId: string }): Promise<Lote[]> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input("bodega_id", bodega_id)
        .input("producto_id", producto_id)
        .input("cantidad_minima", cantidad_minima)
        .input("UserId", UserId)
        .execute("[Almacen].[spBuscarProductosDisponibles]");

      const data = result.recordset as Lote[];

      const parsedData = data.map(lote => {
        lote.ubicacion = lote.ubicacion && typeof lote.ubicacion === "string" ? JSON.parse(lote.ubicacion) : lote.ubicacion;

        return lote;
      });

      return Promise.resolve(parsedData);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
