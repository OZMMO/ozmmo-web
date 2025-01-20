import IDBModel from "@/lib/interfaces/db-model.interface";
import { Empresa } from "./empresa";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";

export class EmpresaModel implements IDBModel<Empresa>{
  sql: MSSQLServer;

  constructor(){
    this.sql = new MSSQLServer();
  }

  async findUnique(criteria: ICriteria<Empresa>): Promise<Empresa | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute('[Catalogos].[sp_buscar_empresas]');
      const data =  result.recordset as Empresa[];
      return Promise.resolve(data[0] || null)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async findMany(criteria: ICriteria<Empresa> | undefined): Promise<IResponseModel<Empresa[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if(criteria) criteria.toSql(request);
      const result = await request.execute('[Catalogos].[sp_buscar_empresas]');

      const data =  result.recordset as Empresa[];
      
      return Promise.resolve({
        data: data,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async create(empresa: Empresa): Promise<Empresa> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('codigo', empresa.codigo)
        .input('rfc', empresa.rfc)
        .input('razon_social', empresa.razon_social)
        .input('nombre_comercial', empresa.nombre_comercial)
        .input('curp', empresa.curp)
        .input('correo_electronico', empresa.correo_electronico)
        .input('telefono', empresa.telefono)
        .input('representante_legal', empresa.representante_legal)
        .input('certificado_csd', empresa.certificado_csd)
        .input('llave_privada_csd', empresa.llave_privada_csd)
        .input('contrasena_csd', empresa.contrasena_csd)
        .input('estatus', empresa.estatus)
        .input('regimen_fiscal_id', 1 /*empresa.regimen_fiscal_id*/)
        .input('UserId', empresa.UserId)
        .execute('[Catalogos].[sp_iu_tbl_empresas]');

      const data = (result.recordset[0] || null) as Empresa || null;
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async update(empresa: Empresa): Promise<Empresa> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
      .input('codigo', empresa.codigo)
      .input('rfc', empresa.rfc)
      .input('razon_social', empresa.razon_social)
      .input('nombre_comercial', empresa.nombre_comercial)
      .input('curp', empresa.curp)
      .input('correo_electronico', empresa.correo_electronico)
      .input('telefono', empresa.telefono)
      .input('representante_legal', empresa.representante_legal)
      .input('certificado_csd', empresa.certificado_csd)
      .input('llave_privada_csd', empresa.llave_privada_csd)
      .input('contrasena_csd', empresa.contrasena_csd)
      .input('estatus', empresa.estatus)
      .input('regimen_fiscal_id', empresa.regimen_fiscal_id)  
      .input('UserId', empresa.UserId)
      .execute('[Catalogos].[sp_iu_tbl_empresas]');

      const data = (result.recordset[0] || null) as Empresa || null;
    return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async delete(empresa: Empresa): Promise<Empresa> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('id', this.sql.dataTypes.VarChar, empresa.id)
        .input('UserId', this.sql.dataTypes.VarChar, empresa.UserId)
        .execute(`[Catalogos].[sp_borrar_tbl_empresas]`);

      const dataResult = (result.recordset[0] || null) as Empresa || null;
      return Promise.resolve(dataResult)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  count(criteria?: ICriteria<Empresa> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }

}