import { MSSQLServer } from "@/lib/mssqlserver";
import { ClaveUnidad } from "./clave-unidad";

export class ClaveUnidadModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findMany(): Promise<ClaveUnidad[]> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      const result = await request.execute("Sat.spBuscarClaveUnidad");
      const data = result.recordset as ClaveUnidad[];
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
