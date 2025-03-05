import IDBModel from "@/lib/interfaces/db-model.interface";
import { Bodega } from "./bodega";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";

export class BodegaModel implements IDBModel<Bodega>{
  sql: MSSQLServer;

  constructor(){
    this.sql = new MSSQLServer();
  }

  async findUnique(criteria: ICriteria<Bodega & { SoloActivos?: boolean }>): Promise<Bodega | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute('[Almacen].[spBuscarBodegas]');
      const data =  result.recordset as Bodega[];

      const parseData = data.map(item => {
        item.empresa = item.empresa && typeof item.empresa === 'string' ? JSON.parse(item.empresa) : undefined;
        item.sucursal = item.sucursal && typeof item.sucursal === 'string' ? JSON.parse(item.sucursal) : undefined;
        item.ubicaciones = item.ubicaciones && typeof item.ubicaciones === 'string' ? JSON.parse(item.ubicaciones) : undefined;
      
        return item;
      });

      return Promise.resolve(parseData[0] || null)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async findMany(criteria: ICriteria<Bodega & {SoloActivos?: boolean }> | undefined): Promise<IResponseModel<Bodega[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if(criteria) criteria.toSql(request);
      const result = await request.execute('[Almacen].[spBuscarBodegas]');

      const data =  result.recordset as Bodega[];
      
      const parseData = data.map(item => {
        item.empresa = item.empresa && typeof item.empresa === 'string' ? JSON.parse(item.empresa) : undefined;
        item.sucursal = item.sucursal && typeof item.sucursal === 'string' ? JSON.parse(item.sucursal) : undefined;
        item.ubicaciones = item.ubicaciones && typeof item.ubicaciones === 'string' ? JSON.parse(item.ubicaciones) : undefined;

        return item;
      });

      return Promise.resolve({
        data: parseData,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findManyPorProducto(criteria: ICriteria<Bodega & {producto_id?: number, SoloActivos?: boolean }> | undefined): Promise<IResponseModel<Bodega[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if(criteria) criteria.toSql(request);
      const result = await request.execute('[Almacen].[spBuscarBodegasPorProductos]');

      const data =  result.recordset as Bodega[];
      
      const parseData = data.map(item => {
        item.empresa = item.empresa && typeof item.empresa === 'string' ? JSON.parse(item.empresa) : undefined;
        item.sucursal = item.sucursal && typeof item.sucursal === 'string' ? JSON.parse(item.sucursal) : undefined;
        item.ubicaciones = item.ubicaciones && typeof item.ubicaciones === 'string' ? JSON.parse(item.ubicaciones) : undefined;

        return item;
      });

      return Promise.resolve({
        data: parseData,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async create(bodega: Bodega): Promise<Bodega> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('descripcion', bodega.descripcion)
        .input('empresa_id', bodega.empresa_id)
        .input('sucursal_id', bodega.sucursal_id)
        .input('estatus', bodega.estatus)
        .input('UserId', bodega.UserId)        
        .execute('[Almacen].[spIUBodega]');

        const data =  result.recordset as Bodega[];
      
        const parseData = data.map(item => {
          item.empresa = item.empresa && typeof item.empresa === 'string' ? JSON.parse(item.empresa) : undefined;
          item.sucursal = item.sucursal && typeof item.sucursal === 'string' ? JSON.parse(item.sucursal) : undefined;
          item.ubicaciones = item.ubicaciones && typeof item.ubicaciones === 'string' ? JSON.parse(item.ubicaciones) : undefined;
          
        return item;
      });

      return Promise.resolve(parseData[0] || null)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async update(bodega: Bodega): Promise<Bodega> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('id', bodega.id)
        .input('descripcion', bodega.descripcion)
        .input('empresa_id', bodega.empresa_id)
        .input('sucursal_id', bodega.sucursal_id)
        .input('estatus', bodega.estatus)
        .input('UserId', bodega.UserId)
      .execute('[Almacen].[spIUBodega]');

      const data =  result.recordset as Bodega[];
      
      const parseData = data.map(item => {
        item.empresa = item.empresa && typeof item.empresa === 'string' ? JSON.parse(item.empresa) : undefined;
        item.sucursal = item.sucursal && typeof item.sucursal === 'string' ? JSON.parse(item.sucursal) : undefined;
        item.ubicaciones = item.ubicaciones && typeof item.ubicaciones === 'string' ? JSON.parse(item.ubicaciones) : undefined;
        
        return item;
      });

      return Promise.resolve(parseData[0] || null)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async delete(bodega: Bodega): Promise<Bodega> {
    try {
      const db = await this.sql.connect();
      const result = await db.request()
        .input('id', this.sql.dataTypes.VarChar, bodega.id)
        .input('UserId', this.sql.dataTypes.VarChar, bodega.UserId)
        .execute(`[Almacen].[sp_borrar_tbl_bodegas]`);

        const data =  result.recordset as Bodega[];
      
        const parseData = data.map(item => {
          item.empresa = item.empresa && typeof item.empresa === 'string' ? JSON.parse(item.empresa) : undefined;
          item.sucursal = item.sucursal && typeof item.sucursal === 'string' ? JSON.parse(item.sucursal) : undefined;
          item.ubicaciones = item.ubicaciones && typeof item.ubicaciones === 'string' ? JSON.parse(item.ubicaciones) : undefined;
          
          return item;
        });

      return Promise.resolve(parseData[0] || null)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  count(criteria?: ICriteria<Bodega> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }

}