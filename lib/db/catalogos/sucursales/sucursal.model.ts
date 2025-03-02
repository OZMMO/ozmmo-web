import IDBModel from "@/lib/interfaces/db-model.interface";
import { Sucursal } from "./sucursal";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";
import { Direccion } from "../../sat/direcciones/direccion";

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
      
      const parsedData = data.map((sucursal) => {
        sucursal.direccion = (sucursal.direccion && typeof sucursal.direccion === 'string') ? JSON.parse(sucursal.direccion) as Direccion : undefined;
        return sucursal as Sucursal;
      });
      
      return Promise.resolve(parsedData[0])
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

      const parsedData = data.map((sucursal) => {
        sucursal.direccion = (sucursal.direccion && typeof sucursal.direccion === 'string') ? JSON.parse(sucursal.direccion) as Direccion : undefined;
        return sucursal as Sucursal;
      });

      return Promise.resolve({
        data: parsedData,
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
        .input("id", this.sql.dataTypes.Int, sucursal.id)
        // .input("codigo", this.sql.dataTypes.VarChar, sucursal.codigo)
        .input("nombre", this.sql.dataTypes.VarChar, sucursal.nombre)
        .input("empresa_id", this.sql.dataTypes.Int, sucursal.empresa_id)
        .input("correo_electronico", this.sql.dataTypes.VarChar, sucursal.correo_electronico)
        .input("telefono", this.sql.dataTypes.VarChar, sucursal.telefono)
        .input("responsable", this.sql.dataTypes.VarChar, sucursal.responsable)
        .input("estatus", this.sql.dataTypes.Bit, sucursal.estatus)
        .input('direccion', this.sql.dataTypes.VarChar, sucursal.direccion ? JSON.stringify(sucursal.direccion) : null)
        .input("UserId", this.sql.dataTypes.VarChar,  sucursal.UserId)
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
        .input("id", this.sql.dataTypes.Int, sucursal.id)
        // .input("codigo", this.sql.dataTypes.VarChar, sucursal.codigo)
        .input("nombre", this.sql.dataTypes.VarChar, sucursal.nombre)
        .input("empresa_id", this.sql.dataTypes.Int, sucursal.empresa_id)
        .input("correo_electronico", this.sql.dataTypes.VarChar, sucursal.correo_electronico)
        .input("telefono", this.sql.dataTypes.VarChar, sucursal.telefono)
        .input("responsable", this.sql.dataTypes.VarChar, sucursal.responsable)
        .input("estatus", this.sql.dataTypes.Bit, sucursal.estatus)
        .input('direccion', this.sql.dataTypes.VarChar, sucursal.direccion ? JSON.stringify(sucursal.direccion) : null)
        .input("UserId", this.sql.dataTypes.VarChar, sucursal.UserId)
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
        .input("id", this.sql.dataTypes.Int, sucursal.id)
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
