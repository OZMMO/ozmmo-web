import { MSSQLServer } from "@/lib/mssqlserver";
import { Impuesto } from "./impuesto";

export class ImpuestoModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findMany(): Promise<Impuesto[]> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      const result = await request.execute("Sat.spBuscarImpuesto");
      const data = result.recordset as Impuesto[];
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
