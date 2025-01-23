import IDBModel from '@/lib/interfaces/db-model.interface';
import { MSSQLServer } from '@/lib/mssqlserver';
import ICriteria from '@/lib/interfaces/criteria.interface';
import { IResponseModel } from '@/lib/interfaces/response-model.interface';
import { TipoContribuyente } from './tipo_contribuyente';

class TipoContribuyenteModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findMany(): Promise<TipoContribuyente[]> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      const result = await request.execute('Sat.spBuscarTiposContributentes');
      const data = result.recordset;
      
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

}

export default TipoContribuyenteModel;
