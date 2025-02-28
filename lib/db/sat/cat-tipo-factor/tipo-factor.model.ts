import { MSSQLServer } from "@/lib/mssqlserver";
import { TipoFactor } from "./tipo-factor";

export class TipoFactorModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findMany(): Promise<TipoFactor[]> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      const result = await request.execute("Sat.spBuscarTipoFactor");
      const data = result.recordset as TipoFactor[];
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
