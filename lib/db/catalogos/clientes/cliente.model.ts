import IDBModel from "@/lib/interfaces/db-model.interface";
import { Cliente } from "./cliente";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";
import { Direccion } from "../../sat/direcciones/direccion";

export class ClienteModel implements IDBModel<Cliente>{
  sql: MSSQLServer;

  constructor(){
    this.sql = new MSSQLServer();
  }

  async findUnique(criteria: ICriteria<Cliente>): Promise<Cliente | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute('[Catalogos].[spBuscarClientes]');
      let data =  result.recordset as Cliente[];

      const parsedData = data.map((cliente) => {
        cliente.direccion = (cliente.direccion && typeof cliente.direccion === 'string') ? JSON.parse(cliente.direccion) as Direccion : undefined;
        return cliente as Cliente;
      });

      return Promise.resolve(parsedData[0])
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findMany(criteria: ICriteria<Cliente> | undefined): Promise<IResponseModel<Cliente[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if(criteria) criteria.toSql(request);
      const result = await request.execute('[Catalogos].[spBuscarClientes]');

      let data =  result.recordset as Cliente[];

      const parsedData = data.map((cliente) => {
        cliente.direccion = (cliente.direccion && typeof cliente.direccion === 'string') ? JSON.parse(cliente.direccion) as Direccion : undefined;
        return cliente as Cliente;
      });

      return Promise.resolve({
        data: parsedData,
        totalCount: parsedData.length,
        totalPages: parsedData[0]?.totalPages || 1
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async create(cliente: Cliente): Promise<Cliente> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('id', this.sql.dataTypes.Int, cliente.id)
        // .input('codigo',this.sql.dataTypes.VarChar, cliente.codigo)
        .input('razon_social', this.sql.dataTypes.VarChar, cliente.razon_social)
        .input('rfc', this.sql.dataTypes.VarChar, cliente.rfc)
        .input('tipo_contribuyente_id', this.sql.dataTypes.VarChar, cliente.tipo_contribuyente_id)
        .input('curp', this.sql.dataTypes.VarChar, cliente.curp)
        .input('regimen_fiscal_id', this.sql.dataTypes.Int, cliente.regimen_fiscal_id)
        .input('fecha_nacimiento', this.sql.dataTypes.DateTime, cliente.fecha_nacimiento)
        .input('correo_electronico', this.sql.dataTypes.VarChar, cliente.correo_electronico)
        .input('telefono', this.sql.dataTypes.VarChar, cliente.telefono)
        .input('estatus', this.sql.dataTypes.Bit, cliente.estatus)
        .input('direccion', this.sql.dataTypes.VarChar, cliente.direccion ? JSON.stringify(cliente.direccion) : null)
        .input('UserId', this.sql.dataTypes.VarChar, cliente.UserId)
        .execute('[Catalogos].[spIUClientes]');

      const data = (result.recordset[0] || null) as Cliente || null;
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async update(cliente: Cliente): Promise<Cliente> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('id', this.sql.dataTypes.Int, cliente.id)
        // .input('codigo',this.sql.dataTypes.VarChar, cliente.codigo)
        .input('razon_social', this.sql.dataTypes.VarChar, cliente.razon_social)
        .input('rfc', this.sql.dataTypes.VarChar, cliente.rfc)
        .input('tipo_contribuyente_id', this.sql.dataTypes.VarChar, cliente.tipo_contribuyente_id)
        .input('curp', this.sql.dataTypes.VarChar, cliente.curp)
        .input('regimen_fiscal_id', this.sql.dataTypes.Int, cliente.regimen_fiscal_id)
        .input('fecha_nacimiento', this.sql.dataTypes.DateTime, cliente.fecha_nacimiento)
        .input('correo_electronico', this.sql.dataTypes.VarChar, cliente.correo_electronico)
        .input('telefono', this.sql.dataTypes.VarChar, cliente.telefono)
        .input('estatus', this.sql.dataTypes.Bit, cliente.estatus)
        .input('direccion', this.sql.dataTypes.VarChar, cliente.direccion ? JSON.stringify(cliente.direccion) : null)
        .input('UserId', this.sql.dataTypes.VarChar, cliente.UserId)
        .execute('[Catalogos].[spIUClientes]');

      const data = (result.recordset[0] || null) as Cliente || null;
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async delete(cliente: Cliente): Promise<Cliente> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('id', this.sql.dataTypes.VarChar, cliente.id)
        .input('UserId', this.sql.dataTypes.VarChar, cliente.UserId)
        .execute(`[Catalogos].[spBorrarCliente]`);

      const data = (result.recordset[0] || null) as Cliente || null;
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async count(criteria: ICriteria<Cliente> | undefined): Promise<number> {
    return Promise.resolve(0);
  }
}