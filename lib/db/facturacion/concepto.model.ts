import IDBModel from "@/lib/interfaces/db-model.interface";
import { Concepto } from "./concepto";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { MSSQLServer } from "@/lib/mssqlserver";

export class ConceptoModel implements IDBModel<Concepto> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(criteria: ICriteria<Concepto>): Promise<Concepto | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute("[Facturacion].[spBuscarConcepto]");
      const data = result.recordset as Concepto[];

      const parseData = data.map((item) => {
        return item;
      });

      return Promise.resolve(parseData[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findMany(
    criteria: ICriteria<Concepto> | undefined
  ): Promise<IResponseModel<Concepto[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute("[Facturacion].[spBuscarConceptos]");

      const data = result.recordset as Concepto[];

      const parseData = data.map((item) => {
        return item;
      });

      return Promise.resolve({
        data: parseData,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(concepto: Concepto): Promise<Concepto> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", concepto.id)
        .input("codigo", concepto.codigo)
        .input("descripcion", concepto.descripcion)
        .input("uso_cfdi", concepto.uso_cfdi)
        .input("clave_prod_serv", concepto.clave_prod_serv)
        .input("ClaveUnidad", concepto.ClaveUnidad)
        .input("ValorUnitario", concepto.ValorUnitario)
        .input("ObjetoImp", concepto.ObjetoImp)
        .input("Impuesto", concepto.Impuesto)
        .input("TipoFactor", concepto.TipoFactor)
        .input("UserId", concepto.UserId)
        .execute("[Facturacion].[spIUConceptos]");

      const data = ((result.recordset[0] || null) as Concepto) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(concepto: Concepto): Promise<Concepto> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", concepto.id)
        .input("codigo", concepto.codigo)
        .input("descripcion", concepto.descripcion)
        .input("uso_cfdi", concepto.uso_cfdi)
        .input("clave_prod_serv", concepto.clave_prod_serv)
        .input("ClaveUnidad", concepto.ClaveUnidad)
        .input("ValorUnitario", concepto.ValorUnitario)
        .input("ObjetoImp", concepto.ObjetoImp)
        .input("Impuesto", concepto.Impuesto)
        .input("TipoFactor", concepto.TipoFactor)
        .input("UserId", concepto.UserId)
        .execute("[Facturacion].[spIUConceptos]");

      const data = ((result.recordset[0] || null) as Concepto) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(concepto: Concepto): Promise<Concepto> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", concepto.id)
        .input("UserId", concepto.UserId)
        .execute(`[Facturacion].[spBorrarConcepto]`);

      const dataResult = ((result.recordset[0] || null) as Concepto) || null;
      return Promise.resolve(dataResult);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  count(criteria?: ICriteria<Concepto> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
