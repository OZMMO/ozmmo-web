import IDBModel from "@/lib/interfaces/db-model.interface";
import { Productos } from "./productos";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";

export class ProductosModel implements IDBModel<Productos> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(criteria: ICriteria<Productos>): Promise<Productos | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarProductos]");
      const data = result.recordset as Productos[];
      return Promise.resolve(data[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findMany(
    criteria: ICriteria<Productos> | undefined
  ): Promise<IResponseModel<Productos[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarProductos]");

      const data = result.recordset as Productos[];

      return Promise.resolve({
        data: data,
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
}
