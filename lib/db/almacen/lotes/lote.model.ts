
import IDBModel from "@/lib/interfaces/db-model.interface";
import { Lote } from "./lote";
import { MSSQLServer } from "@/lib/mssqlserver";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";

export class LoteModel implements IDBModel<Lote>{
  sql: MSSQLServer;

  constructor(){
    this.sql = new MSSQLServer();
  }

  async findUnique(criteria: ICriteria<Lote>): Promise<Lote | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute('[Almacen].[spBuscarLotes]');
      const data =  result.recordset as Lote[];
      return Promise.resolve(data[0] || null)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findMany(criteria: ICriteria<Lote> | undefined): Promise<IResponseModel<Lote[]>> {    
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if(criteria) criteria.toSql(request);
      const result = await request.execute('[Almacen].[spBuscarLotes]');
      const data =  result.recordset as Lote[];
      return Promise.resolve({
        data: data,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async create(lote: Lote): Promise<Lote> { 
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      request.input('codigo_lote', lote.codigo_lote);
      request.input('producto_id', lote.producto_id);
      request.input('fecha_fabricacion', lote.fecha_fabricacion);
      request.input('fecha_expiracion', lote.fecha_expiracion);
      request.input('cantidad_inicial', lote.cantidad_inicial);
      request.input('cantidad_disponible', lote.cantidad_disponible);
      request.input('estado_lote_id', lote.estado_lote_id);
      request.input('recepcion_id', lote.recepcion_id);
      request.input('estatus', lote.estatus);
      request.input('ubicacion_id', lote.ubicacion_id);
      request.input('UserId', lote.UserId); 
      const result = await request.execute('[Almacen].[spIULote]');
      const data =  result.recordset as Lote[];

      return Promise.resolve(data[0] || null)

    } catch (error) {
      return Promise.reject(error)
    }
  }

  async update(lote: Lote): Promise<Lote> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      request.input('id', lote.id);
      request.input('codigo_lote', lote.codigo_lote);
      request.input('producto_id', lote.producto_id);
      request.input('fecha_fabricacion', lote.fecha_fabricacion);
      request.input('fecha_expiracion', lote.fecha_expiracion);
      request.input('cantidad_inicial', lote.cantidad_inicial);
      request.input('cantidad_disponible', lote.cantidad_disponible);
      request.input('estado_lote_id', lote.estado_lote_id);
      request.input('recepcion_id', lote.recepcion_id);
      request.input('estatus', lote.estatus);
      request.input('ubicacion_id', lote.ubicacion_id);
      request.input('UserId', lote.UserId); 
      const result = await request.execute('[Almacen].[spIULote]');
      const data =  result.recordset as Lote[];

      return Promise.resolve(data[0] || null)

    } catch (error) {
      return Promise.reject(error)
    }
  }

  async delete(lote: Lote): Promise<Lote> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      request.input('id', lote.id);
      const result = await request.execute('[Almacen].[spEliminarLote]');
      const data =  result.recordset as Lote[];
      return Promise.resolve(data[0] || null)
    } catch (error) {
      return Promise.reject(error)
    }
  }
} 