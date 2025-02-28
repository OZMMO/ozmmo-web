import { MSSQLServer } from "@/lib/mssqlserver";
import { ObjetoImp } from "./objeto-imp";

export class ObjetoImpModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findMany(): Promise<ObjetoImp[]> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      const result = await request.execute("Sat.spBuscarObjetoImp");
      const data = result.recordset as ObjetoImp[];
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
