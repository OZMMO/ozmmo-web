import { Pedido } from "./pedidos";
import { MSSQLServer } from "@/lib/mssqlserver";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import ICriteria from "@/lib/interfaces/criteria.interface";
import IDBModel from "@/lib/interfaces/db-model.interface";

export class PedidoModel implements IDBModel<Pedido> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(criteria: ICriteria<Pedido>): Promise<Pedido | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute("[Pedidos].[sp_get_pedido_cliente]");
      const data = result.recordset as Pedido[];

      const parseData = data.map((item) => {
        item.detalles =
          item.detalles && typeof item.detalles === "string"
            ? JSON.parse(item.detalles)
            : item.detalles;
        item.direccion =
          item.direccion && typeof item.direccion === "string"
            ? JSON.parse(item.direccion)
            : item.direccion;
        item.FechaHoraExpedicion = item.FechaHoraExpedicion
          ? new Date(item.FechaHoraExpedicion)
          : undefined;
        return item;
      });

      return Promise.resolve(parseData[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findMany(
    criteria: ICriteria<Pedido> | undefined
  ): Promise<IResponseModel<Pedido[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute("[Pedidos].[sp_get_pedido_cliente]");

      const data = result.recordset as Pedido[];

      const parseData = data.map((item) => {
        item.detalles =
          item.detalles && typeof item.detalles === "string"
            ? JSON.parse(item.detalles)
            : item.detalles;
        item.direccion =
          item.direccion && typeof item.direccion === "string"
            ? JSON.parse(item.direccion)
            : item.direccion;
        item.FechaHoraExpedicion = item.FechaHoraExpedicion
          ? new Date(item.FechaHoraExpedicion)
          : undefined;
        return item;
      });
      console.log(parseData);
      return Promise.resolve({
        data: parseData,
        totalCount: data.length,
        totalPages: data[0]?.totalPages || 1,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async create(pedido: Pedido): Promise<Pedido> {
    try {
      console.log(pedido);
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", pedido.id)
        .input("codigo", pedido.codigo)
        .input("id_cliente", pedido.id_cliente)
        .input("generar_factura", pedido.generar_factura)
        .input("generar_instalacion", pedido.generar_instalacion)
        .input("Notas", pedido.Notas)
        .input("id_canal_venta", pedido.id_canal_venta)
        .input("detalles", JSON.stringify(pedido.detalles))
        .input("direccion", JSON.stringify(pedido.direccion))
        .input("UserId", pedido.UserId)
        .execute("[Pedidos].[spIUPedidoCliente]");

      const data = ((result.recordset[0] || null) as Pedido) || null;
      return Promise.resolve(data);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async update(pedido: Pedido): Promise<Pedido> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", pedido.id)
        .input("codigo", pedido.codigo)
        .input("id_cliente", pedido.id_cliente)
        .input("generar_factura", pedido.generar_factura)
        .input("generar_instalacion", pedido.generar_instalacion)
        .input("Notas", pedido.Notas)
        .input("id_canal_venta", pedido.id_canal_venta)
        .input("detalles", JSON.stringify(pedido.detalles))
        .input("direccion", JSON.stringify(pedido.direccion))
        .input("UserId", pedido.UserId)
        .execute("[Pedidos].[spIUPedidoCliente]");

      const data = ((result.recordset[0] || null) as Pedido) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(pedido: Pedido): Promise<Pedido> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", pedido.id)
        .input("UserId", pedido.UserId)
        .execute("[Pedidos].[sp_borrar_tbl_pedidos_clientes]");

      const data = ((result.recordset[0] || null) as Pedido) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  count(criteria?: ICriteria<Pedido> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
