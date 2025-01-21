import IDBModel from "@/lib/interfaces/db-model.interface";
import { Sucursal } from "./sucursal";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";

export class SucursalModel implements IDBModel<Sucursal> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(criteria: ICriteria<Sucursal>): Promise<Sucursal | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute("[Catalogos].[spBuscarSucursales]");
      const data = result.recordset as Sucursal[];
      return Promise.resolve(data[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findMany(
    criteria: ICriteria<Sucursal> | undefined
  ): Promise<IResponseModel<Sucursal[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute("[Catalogos].[spBuscarSucursales]");

      const data = result.recordset as Sucursal[];

      return Promise.resolve({
        data: data,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async create(sucursal: Sucursal): Promise<Sucursal> {
    try {
      console.log(sucursal);
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("codigo", sucursal.codigo)
        .input("nombre", sucursal.nombre)
        .input("empresa_id", sucursal.empresa_id)
        .input("correo_electronico", sucursal.correo_electronico)
        .input("telefono", sucursal.telefono)
        .input("responsable", sucursal.responsable)
        .input("estatus", sucursal.estatus)
        .input("UserId", sucursal.UserId)
        .execute("[Catalogos].[spIUSucursales]");

      const data = ((result.recordset[0] || null) as Sucursal) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async update(sucursal: Sucursal): Promise<Sucursal> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("codigo", sucursal.codigo)
        .input("nombre", sucursal.nombre)
        .input("empresa_id", sucursal.empresa_id)
        .input("correo_electronico", sucursal.correo_electronico)
        .input("telefono", sucursal.telefono)
        .input("responsable", sucursal.responsable)
        .input("estatus", sucursal.estatus)
        .input("UserId", sucursal.UserId)
        .input("id", sucursal.id)
        .execute("[Catalogos].[spIUSucursales]");

      const data = ((result.recordset[0] || null) as Sucursal) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async delete(sucursal: Sucursal): Promise<Sucursal> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", this.sql.dataTypes.VarChar, sucursal.id)
        .input("UserId", this.sql.dataTypes.VarChar, sucursal.UserId)
        .execute(`[Catalogos].[spBorrarSucursales]`);

      const dataResult = ((result.recordset[0] || null) as Sucursal) || null;
      return Promise.resolve(dataResult);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  count(criteria?: ICriteria<Sucursal> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
