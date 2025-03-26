import { OrdenInstalacion } from "./orden-instalacion";
import { MSSQLServer } from "@/lib/mssqlserver";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import ICriteria from "@/lib/interfaces/criteria.interface";
import IDBModel from "@/lib/interfaces/db-model.interface";

export class OrdenInstalacionModel implements IDBModel<OrdenInstalacion> {
  sql: MSSQLServer;

  constructor() {
    this.sql = new MSSQLServer();
  }

  async findUnique(
    criteria: ICriteria<OrdenInstalacion>
  ): Promise<OrdenInstalacion | null> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      criteria.toSql(request);
      const result = await request.execute(
        "[Pedidos].[spGetOrdenInstalacionCliente]"
      );
      const data = result.recordset as OrdenInstalacion[];

      const parseData = data.map((item) => {
        item.detalles =
          item.detalles && typeof item.detalles === "string"
            ? JSON.parse(item.detalles)
            : item.detalles;
        item.direccion =
          item.direccion && typeof item.direccion === "string"
            ? JSON.parse(item.direccion)
            : item.direccion;
        item.FechaHoraInstalacion = item.FechaHoraInstalacion
          ? new Date(item.FechaHoraInstalacion)
          : undefined;
        return item;
      });

      return Promise.resolve(parseData[0] || null);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findMany(
    criteria: ICriteria<OrdenInstalacion> | undefined
  ): Promise<IResponseModel<OrdenInstalacion[]>> {
    try {
      const db = await this.sql.connect();
      const request = await db.request();

      if (criteria) criteria.toSql(request);
      const result = await request.execute(
        "[Pedidos].[spGetOrdenInstalacionCliente]"
      );

      const data = result.recordset as OrdenInstalacion[];

      const parseData = data.map((item) => {
        item.detalles =
          item.detalles && typeof item.detalles === "string"
            ? JSON.parse(item.detalles)
            : item.detalles;
        item.direccion =
          item.direccion && typeof item.direccion === "string"
            ? JSON.parse(item.direccion)
            : item.direccion;
        item.FechaHoraInstalacion = item.FechaHoraInstalacion
          ? new Date(item.FechaHoraInstalacion)
          : undefined;
        item.surtidos =
          item.surtidos && typeof item.surtidos === "string"
            ? JSON.parse(item.surtidos)
            : item.surtidos;
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

  async create(ordenInstalacion: OrdenInstalacion): Promise<OrdenInstalacion> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", ordenInstalacion.id)
        .input("codigo", ordenInstalacion.codigo)
        .input("id_pedido_cliente", ordenInstalacion.id_pedido_cliente)
        .input("Notas", ordenInstalacion.Notas)
        .input("FechaHoraInstalacion", ordenInstalacion.FechaHoraInstalacion)
        .input("UserIdInstalador", ordenInstalacion.instalador_id)
        .input(
          "id_estatus_ordenes_instalacion",
          ordenInstalacion.id_estatus_ordenes_instalacion
        )
        .input("detalles", JSON.stringify(ordenInstalacion.detalles))
        .input("direccion", JSON.stringify(ordenInstalacion.direccion))
        .input("UserId", ordenInstalacion.UserId)
        .execute("[Pedidos].[spIUOrdenInstalacionCliente]");

      const data = ((result.recordset[0] || null) as OrdenInstalacion) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(ordenInstalacion: OrdenInstalacion): Promise<OrdenInstalacion> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id", ordenInstalacion.id)
        .input("codigo", ordenInstalacion.codigo)
        .input("id_pedido_cliente", ordenInstalacion.id_pedido_cliente)
        .input("Notas", ordenInstalacion.Notas)
        .input("FechaHoraInstalacion", ordenInstalacion.FechaHoraInstalacion)
        .input("UserIdInstalador", ordenInstalacion.instalador_id)
        .input(
          "id_estatus_ordenes_instalacion",
          ordenInstalacion.id_estatus_ordenes_instalacion
        )
        .input("detalles", JSON.stringify(ordenInstalacion.detalles))
        .input("direccion", JSON.stringify(ordenInstalacion.direccion))
        .input("UserId", ordenInstalacion.UserId)
        .execute("[Pedidos].[spIUOrdenInstalacionCliente]");

      const data = ((result.recordset[0] || null) as OrdenInstalacion) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async delete(ordenInstalacion: OrdenInstalacion): Promise<OrdenInstalacion> {
    throw new Error("Method not implemented.");
  }

  async surtirDetalle(
    ordenInstalacion: OrdenInstalacion
  ): Promise<OrdenInstalacion> {
    try {
      const db = await this.sql.connect();
      const result = await db
        .request()
        .input("id_orden_instalacion_cliente", ordenInstalacion.id)
        .input("detalles", JSON.stringify(ordenInstalacion.detalles))
        .input("UserId", ordenInstalacion.UserId)
        .execute("[Pedidos].[spSurtirDetalleOrdenInstalacion]");

      const data = ((result.recordset[0] || null) as OrdenInstalacion) || null;
      return Promise.resolve(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  count(criteria?: ICriteria<OrdenInstalacion> | undefined): Promise<number> {
    throw new Error("Method not implemented.");
  }
}
