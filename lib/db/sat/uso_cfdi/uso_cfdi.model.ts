import { MSSQLServer } from "@/lib/mssqlserver";
import { UsoCFDI } from "./uso_cfdi";

export class UsoCFDIModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findMany(): Promise<UsoCFDI[]> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      const result = await request.execute("Sat.spBuscarUsoCFDI");
      const data = result.recordset as UsoCFDI[];
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
