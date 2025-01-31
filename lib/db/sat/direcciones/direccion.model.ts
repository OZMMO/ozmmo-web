
import { Direccion } from "./direccion";
import { MSSQLServer } from "@/lib/mssqlserver";

export class DireccionModel {
  sql: MSSQLServer;

  constructor(){
    this.sql = new MSSQLServer();
  }

  async findMany(direccion: string): Promise<Direccion[]> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      request.input('Direccion', direccion);
      const result = await request.execute('[Sat].[spBuscarDireccion]');

      return result.recordset as Direccion[];
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
