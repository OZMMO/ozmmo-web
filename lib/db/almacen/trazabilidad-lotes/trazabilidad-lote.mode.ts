import ICriteria from "@/lib/interfaces/criteria.interface";
import IDBModel from "@/lib/interfaces/db-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";
import { TrazabilidadLote } from "./trazabilidad-lote";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";

export class TrazabilidadLoteModel implements IDBModel<TrazabilidadLote>{
  sql: MSSQLServer;

  constructor(){
    this.sql = new MSSQLServer();
  }

  async findUnique(criteria: ICriteria<TrazabilidadLote>): Promise<TrazabilidadLote | null> {
    return Promise.resolve(null)
  }

  async findMany(criteria: ICriteria<TrazabilidadLote> | undefined): Promise<IResponseModel<TrazabilidadLote[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if(criteria) criteria.toSql(request);
      const result = await request.execute('[Almacen].[spBuscarTrazabilidadLotes]');
      const data =  result.recordset as TrazabilidadLote[];
      return Promise.resolve({
        data: data,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async create(trazabilidadLote: TrazabilidadLote): Promise<TrazabilidadLote> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      request.input('codigo_lote', trazabilidadLote.codigo_lote);
      request.input('cantidad', trazabilidadLote.cantidad);
      request.input('tipo_movimiento_id', trazabilidadLote.tipo_movimiento_id);
      request.input('referencia_movimiento', trazabilidadLote.referencia_movimiento);
      request.input('notas', trazabilidadLote.notas);
      request.input('estatus', trazabilidadLote.estatus);
      request.input('fecha_registro', trazabilidadLote.fecha_registro);
      request.input('cantidad_anterior', trazabilidadLote.cantidad_anterior);
      request.input('cantidad_actual', trazabilidadLote.cantidad_actual);
      const result = await request.execute('[Almacen].[spCrearTrazabilidadLote]');
      const data =  result.recordset as TrazabilidadLote[];
      return Promise.resolve(data[0] || null)
    } catch (error) { 
      return Promise.reject(error)
    }
  }

  async update(trazabilidadLote: TrazabilidadLote): Promise<TrazabilidadLote> {
    return Promise.reject(new Error('Not implemented'))
  }

  async delete(trazabilidadLote: TrazabilidadLote): Promise<TrazabilidadLote> {
    return Promise.reject(new Error('Not implemented'))
  }

  async count(criteria: ICriteria<TrazabilidadLote>): Promise<number> {
    return Promise.resolve(0)
  }
}