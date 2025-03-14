import { MSSQLServer } from "@/lib/mssqlserver";
import { DetalleSurtido } from "./detalle-surtido";

export class SurtidoModel {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async create({
    orden_id,
    id_estatus_ordenes_instalacion,
    surtidos,
    UserId,
  }: {
    orden_id: number;
    id_estatus_ordenes_instalacion: number | null;
    surtidos: DetalleSurtido[];
    UserId: string;
  }) {
    console.log(JSON.stringify(surtidos));
    try {
      const db = await this.sql.connect();
      const request = await db.request();
      request.input("id", this.sql.dataTypes.Int, orden_id);
      request.input(
        "id_estatus_ordenes_instalacion",
        this.sql.dataTypes.VarChar,
        id_estatus_ordenes_instalacion
      );
      request.input(
        "surtidos",
        this.sql.dataTypes.VarChar,
        JSON.stringify(surtidos)
      );
      request.input("UserId", this.sql.dataTypes.VarChar, UserId);
      const result = await request.execute(
        "[Pedidos].[spSurtirOrdenInstalacion]"
      );
      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
