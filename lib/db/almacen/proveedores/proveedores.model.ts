import IDBModel from "@/lib/interfaces/db-model.interface";
import { Proveedor } from "./proveedores";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";
import { Direccion } from "../../sat/direcciones/direccion";

export class ProveedoresModel implements IDBModel<Proveedor> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(criteria: ICriteria<Proveedor>): Promise<Proveedor | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarProveedor]");
      const data = result.recordset as Proveedor[];

      const parsedData = data.map((proveedor) => {
        proveedor.direccion = (proveedor.direccion && typeof proveedor.direccion === 'string') ? JSON.parse(proveedor.direccion) as Direccion : undefined;

        return proveedor as Proveedor;
      });

      return Promise.resolve(parsedData[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async findMany(
    criteria: ICriteria<Proveedor> | undefined
  ): Promise<IResponseModel<Proveedor[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute("[Almacen].[spBuscarProveedor]");

      const data = result.recordset as Proveedor[];

      const parsedData = data.map((proveedor) => {
        proveedor.direccion = (proveedor.direccion && typeof proveedor.direccion === 'string') ? JSON.parse(proveedor.direccion) as Direccion : undefined;
        
        return proveedor as Proveedor;
      });

      return Promise.resolve({
        data: parsedData,
        totalCount: parsedData[0]?.totalCount || 0,
        totalPages: parsedData[0]?.totalPages || 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async create(proveedor: Proveedor): Promise<Proveedor> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("nombre", proveedor.nombre)
        .input("contacto", proveedor.contacto)
        .input("telefono", proveedor.telefono)
        .input("email", proveedor.email)
        .input("direccion", proveedor.direccion ? JSON.stringify(proveedor.direccion) : null)
        .input("estatus", proveedor.estatus)
        .input("UserId", proveedor.UserId)
        .execute("[Almacen].[spIUProveedores]");

        const data = result.recordset as Proveedor[];

        const parsedData = data.map((proveedor) => {
          proveedor.direccion = (proveedor.direccion && typeof proveedor.direccion === 'string') ? JSON.parse(proveedor.direccion) as Direccion : undefined;
          
          return proveedor as Proveedor;
        });


      return Promise.resolve(parsedData[0]);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async update(proveedor: Proveedor): Promise<Proveedor> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("nombre", proveedor.nombre)
        .input("contacto", proveedor.contacto)
        .input("telefono", proveedor.telefono)
        .input("email", proveedor.email)
        .input("direccion", proveedor.direccion ? JSON.stringify(proveedor.direccion) : null)
        .input("estatus", proveedor.estatus)
        .input("UserId", proveedor.UserId)
        .input("id", proveedor.id)
        .execute("[Almacen].[spIUProveedores]");

        const data = result.recordset as Proveedor[];

        const parsedData = data.map((proveedor) => {
          proveedor.direccion = (proveedor.direccion && typeof proveedor.direccion === 'string') ? JSON.parse(proveedor.direccion) as Direccion : undefined;
          
          return proveedor as Proveedor;
        });


      return Promise.resolve(parsedData[0]);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async delete(proveedor: Proveedor): Promise<Proveedor> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", this.sql.dataTypes.VarChar, proveedor.id)
        .input("UserId", this.sql.dataTypes.VarChar, proveedor.UserId)
        .execute(`[Catalogos].[spBorrarProveedores]`);

        const data = result.recordset as Proveedor[];

        const parsedData = data.map((proveedor) => {
          proveedor.direccion = (proveedor.direccion && typeof proveedor.direccion === 'string') ? JSON.parse(proveedor.direccion) as Direccion : undefined;
          
          return proveedor as Proveedor;
        });


      return Promise.resolve(parsedData[0]);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  count(criteria?: ICriteria<Proveedor> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
