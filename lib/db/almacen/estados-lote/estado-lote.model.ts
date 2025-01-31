import { MSSQLServer } from "@/lib/mssqlserver";
import { EstadoLote } from "./estado-lote";

export class EstadoLoteModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findMany(): Promise<EstadoLote[]> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      const result = await request.execute('Almacen.spBuscarEstadosLote');
      const data = result.recordset as EstadoLote[];
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
