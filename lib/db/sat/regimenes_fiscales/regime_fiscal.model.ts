import { MSSQLServer } from "@/lib/mssqlserver";
import { RegimenFiscal } from "./regimen_fiscal";

export class RegimenFiscalModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findMany(userId: string): Promise<RegimenFiscal[]> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      request.input('UserId', this.sql.dataTypes.VarChar, userId);
      const result = await request.execute('Sat.spBuscarRegimenesFiscales');
      const data = result.recordset as RegimenFiscal[];
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
