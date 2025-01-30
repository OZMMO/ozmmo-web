import { MSSQLServer } from "@/lib/mssqlserver";
import { TipoMovimiento } from "./tipo-movimiento";

export class TipoMovimientoModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findMany({ SoloActivos = false, Categorias = undefined }: { SoloActivos?: boolean, Categorias?: string }): Promise<TipoMovimiento[]> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      request.input('SoloActivos', SoloActivos);
      request.input('Categorias', Categorias);
      const result = await request.execute('Almacen.spBuscarCatTiposMovimientos');
      const data = result.recordset as TipoMovimiento[];
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
