import IDBModel from "@/lib/interfaces/db-model.interface";
import { MaterialProducto } from "./material_producto";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";

export class MaterialProductoModel implements IDBModel<MaterialProducto> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(
    criteria: ICriteria<MaterialProducto>
  ): Promise<MaterialProducto | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarListaMaterialesProductos]");
      const data = result.recordset as MaterialProducto[];
      return Promise.resolve(data[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findMany(
    criteria: ICriteria<MaterialProducto> | undefined
  ): Promise<IResponseModel<MaterialProducto[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarListaMaterialesProductos]");
      const data = result.recordset as MaterialProducto[];

      return Promise.resolve({
        data: data,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async create(materialProducto: MaterialProducto): Promise<MaterialProducto> {
    try {
      console.log({ materialProducto });
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("producto_id", materialProducto.producto_id)
        .input("producto_parent_id", materialProducto.producto_parent_id)
        .input("cantidad_necesaria", materialProducto.cantidad_necesaria)
        .input("unidad_medida_id", materialProducto.unidad_medida_id)
        .input("nota", materialProducto.nota)
        .input("estatus", materialProducto.estatus)
        .input("UserId", materialProducto.UserId)
        .execute("[Almacen].[spIUListaMaterialesProductos]");

      const data = ((result.recordset[0] || null) as MaterialProducto) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async update(materialProducto: MaterialProducto): Promise<MaterialProducto> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("producto_id", materialProducto.producto_id)
        .input("producto_parent_id", materialProducto.producto_parent_id)
        .input("cantidad_necesaria", materialProducto.cantidad_necesaria)
        .input("unidad_medida_id", materialProducto.unidad_medida_id)
        .input("nota", materialProducto.nota)
        .input("estatus", materialProducto.estatus)
        .input("UserId", materialProducto.UserId)
        .input("id", materialProducto.id)
        .execute("[Almacen].[spIUListaMaterialesProductos]");

      const data = ((result.recordset[0] || null) as MaterialProducto) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async delete(materialProducto: MaterialProducto): Promise<MaterialProducto> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", materialProducto.id)
        .input("UserId", materialProducto.UserId)
        .execute(`[Almacen].[spBorrarListaMaterialesProductos]`);

      const dataResult =
        ((result.recordset[0] || null) as MaterialProducto) || null;
      return Promise.resolve(dataResult);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  count(criteria?: ICriteria<MaterialProducto> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
