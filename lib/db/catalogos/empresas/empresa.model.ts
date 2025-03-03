import IDBModel from "@/lib/interfaces/db-model.interface";
import { Empresa } from "./empresa";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";
import { Direccion } from "../../sat/direcciones/direccion";
import { Sucursal } from "../sucursales/sucursal";
import { Bodega } from "../../almacen/bodegas/bodega";

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
      const result = await request.execute('[Catalogos].[spBuscarEmpresas]');
      let data =  result.recordset as Empresa[];

      const parsedData = data.map((empresa) => {
        empresa.direccion = (empresa.direccion && typeof empresa.direccion === 'string') ? JSON.parse(empresa.direccion) as Direccion : undefined;
        empresa.sucursales = (empresa.sucursales && typeof empresa.sucursales === 'string') ? JSON.parse(empresa.sucursales) as Sucursal[] : undefined;
        empresa.bodegas = (empresa.bodegas && typeof empresa.bodegas === 'string') ? JSON.parse(empresa.bodegas) as Bodega[] : undefined;

        return empresa as Empresa;
      });
      
      return Promise.resolve(parsedData[0])
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async findMany(criteria: ICriteria<Empresa> | undefined): Promise<IResponseModel<Empresa[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if(criteria) criteria.toSql(request);
      const result = await request.execute('[Catalogos].[spBuscarEmpresas]');

      let data =  result.recordset as Empresa[];

      const parsedData = data.map((empresa) => {
        empresa.direccion = (empresa.direccion && typeof empresa.direccion === 'string') ? JSON.parse(empresa.direccion) as Direccion : undefined;
        empresa.sucursales = (empresa.sucursales && typeof empresa.sucursales === 'string') ? JSON.parse(empresa.sucursales) as Sucursal[] : undefined;
        empresa.bodegas = (empresa.bodegas && typeof empresa.bodegas === 'string') ? JSON.parse(empresa.bodegas) as Bodega[] : undefined;

        return empresa as Empresa;
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
  async create(empresa: Empresa): Promise<Empresa> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('id', this.sql.dataTypes.Int, empresa.id)
        // .input('codigo',this.sql.dataTypes.VarChar, empresa.codigo)
        .input('rfc', this.sql.dataTypes.VarChar, empresa.rfc)
        .input('razon_social', this.sql.dataTypes.VarChar, empresa.razon_social)
        .input('nombre_comercial', this.sql.dataTypes.VarChar, empresa.nombre_comercial)
        .input('tipo_contribuyente_id', this.sql.dataTypes.VarChar, empresa.tipo_contribuyente_id)
        .input('curp', this.sql.dataTypes.VarChar, empresa.curp)
        .input('correo_electronico', this.sql.dataTypes.VarChar, empresa.correo_electronico)
        .input('telefono', this.sql.dataTypes.VarChar, empresa.telefono)
        .input('representante_legal', this.sql.dataTypes.VarChar, empresa.representante_legal)
        .input('certificado_csd', this.sql.dataTypes.VarChar, empresa.certificado_csd)
        .input('llave_privada_csd', this.sql.dataTypes.VarChar, empresa.llave_privada_csd)
        .input('contrasena_csd', this.sql.dataTypes.VarChar, empresa.contrasena_csd)
        .input('estatus', this.sql.dataTypes.Bit, empresa.estatus)
        .input('regimen_fiscal_id', this.sql.dataTypes.Int, empresa.regimen_fiscal_id)
        .input('direccion', this.sql.dataTypes.VarChar, empresa.direccion ? JSON.stringify(empresa.direccion) : null)
        .input('UserId', this.sql.dataTypes.VarChar, empresa.UserId)
        .execute('[Catalogos].[spIUEmpresa]');

      let data =  result.recordset as Empresa[];

      const parsedData = data.map((empresa) => {
        empresa.direccion = (empresa.direccion && typeof empresa.direccion === 'string') ? JSON.parse(empresa.direccion) as Direccion : undefined;
        empresa.sucursales = (empresa.sucursales && typeof empresa.sucursales === 'string') ? JSON.parse(empresa.sucursales) as Sucursal[] : undefined;
        empresa.bodegas = (empresa.bodegas && typeof empresa.bodegas === 'string') ? JSON.parse(empresa.bodegas) as Bodega[] : undefined;

        return empresa as Empresa;
      });

      return Promise.resolve(parsedData[0])
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async update(empresa: Empresa): Promise<Empresa> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('id', this.sql.dataTypes.Int, empresa.id)
        // .input('codigo',this.sql.dataTypes.VarChar, empresa.codigo)
        .input('rfc', this.sql.dataTypes.VarChar, empresa.rfc)
        .input('razon_social', this.sql.dataTypes.VarChar, empresa.razon_social)
        .input('nombre_comercial', this.sql.dataTypes.VarChar, empresa.nombre_comercial)
        .input('tipo_contribuyente_id', this.sql.dataTypes.VarChar, empresa.tipo_contribuyente_id)
        .input('curp', this.sql.dataTypes.VarChar, empresa.curp)
        .input('correo_electronico', this.sql.dataTypes.VarChar, empresa.correo_electronico)
        .input('telefono', this.sql.dataTypes.VarChar, empresa.telefono)
        .input('representante_legal', this.sql.dataTypes.VarChar, empresa.representante_legal)
        .input('certificado_csd', this.sql.dataTypes.VarChar, empresa.certificado_csd)
        .input('llave_privada_csd', this.sql.dataTypes.VarChar, empresa.llave_privada_csd)
        .input('contrasena_csd', this.sql.dataTypes.VarChar, empresa.contrasena_csd)
        .input('estatus', this.sql.dataTypes.Bit, empresa.estatus)
        .input('regimen_fiscal_id', this.sql.dataTypes.Int, empresa.regimen_fiscal_id)
        .input('direccion', this.sql.dataTypes.VarChar, empresa.direccion ? JSON.stringify(empresa.direccion) : null)
        .input('UserId', this.sql.dataTypes.VarChar, empresa.UserId)
        .execute('[Catalogos].[spIUEmpresa]');

        let data =  result.recordset as Empresa[];

        const parsedData = data.map((empresa) => {
          empresa.direccion = (empresa.direccion && typeof empresa.direccion === 'string') ? JSON.parse(empresa.direccion) as Direccion : undefined;
          empresa.sucursales = (empresa.sucursales && typeof empresa.sucursales === 'string') ? JSON.parse(empresa.sucursales) as Sucursal[] : undefined;
          empresa.bodegas = (empresa.bodegas && typeof empresa.bodegas === 'string') ? JSON.parse(empresa.bodegas) as Bodega[] : undefined;

          return empresa as Empresa;
        });
  
        return Promise.resolve(parsedData[0])
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

        let data =  result.recordset as Empresa[];

        const parsedData = data.map((empresa) => {
          empresa.direccion = (empresa.direccion && typeof empresa.direccion === 'string') ? JSON.parse(empresa.direccion) as Direccion : undefined;
          empresa.sucursales = (empresa.sucursales && typeof empresa.sucursales === 'string') ? JSON.parse(empresa.sucursales) as Sucursal[] : undefined;
          empresa.bodegas = (empresa.bodegas && typeof empresa.bodegas === 'string') ? JSON.parse(empresa.bodegas) as Bodega[] : undefined;
          
          return empresa as Empresa;
        });
  
        return Promise.resolve(parsedData[0])
    } catch (error) {
      return Promise.reject(error)
    }
  }

  count(criteria?: ICriteria<Empresa> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
}