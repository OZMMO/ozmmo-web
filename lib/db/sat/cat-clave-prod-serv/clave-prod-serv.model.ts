import { MSSQLServer } from "@/lib/mssqlserver";
import { ClaveProdServ } from "./clave-prod-serv";

export class ClaveProdServModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findMany(): Promise<ClaveProdServ[]> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      const result = await request.execute("Sat.spBuscarClaveProdServ");
      const data = result.recordset as ClaveProdServ[];
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
