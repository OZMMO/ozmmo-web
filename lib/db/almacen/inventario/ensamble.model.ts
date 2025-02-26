import { MSSQLServer } from "@/lib/mssqlserver";
import { Ensamble, ProductoAEnsamblar } from "./ensamble";

export class EnsambleModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }
  
  async generarEnsamble({producto_id, userId}: {producto_id: number, userId: string}) {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      request.multiple = true;
      request.input("producto_id", producto_id);
      request.input("UserId", userId);
      const result = await request.execute<ProductoAEnsamblar[] & Ensamble[]>("[Almacen].[spGenerarEnsamble]");
      
      if (result.recordsets.length > 0) {
        console.log(result.recordsets[0]);
      }
      const productoAEnsamblar = result.recordsets[0][0] as ProductoAEnsamblar;
      const ensambles = result.recordsets[1] as Ensamble[];

      return Promise.resolve({
        productoAEnsamblar,
        ensambles
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(
      {producto_id, numero_serie, notas, detalle_ensamble, UserId }: 
      {producto_id: number, numero_serie: string, notas: string, detalle_ensamble: Ensamble[], UserId: string}) {

    console.log(JSON.stringify(detalle_ensamble));
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      request.input("producto_id", this.sql.dataTypes.Int, producto_id);
      request.input("numero_serie", this.sql.dataTypes.VarChar, numero_serie);
      request.input("notas", this.sql.dataTypes.VarChar, notas);
      request.input("detalle_ensamble", this.sql.dataTypes.VarCharMAX, JSON.stringify(detalle_ensamble));
      request.input("UserId", this.sql.dataTypes.VarChar, UserId);
      const result = await request.execute("[Almacen].[spIEnsamble]");
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}