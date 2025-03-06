"use client";

import { CRUD, Column } from "@/components/crud";
import { useEffect, useState } from "react";
import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import {
  createPedidoCliente,
  updatePedidoCliente,
  deletePedidoCliente,
} from "./actions";
import { PedidoClienteForm } from "./pedido-cliente-form";
import { Pedido, Cliente, Canal, Concepto } from "@/lib/db";

const columns: Column<Pedido>[] = [
  { key: "cliente", label: "Cliente", sortable: true },
  { key: "codigo", label: "codigo", sortable: true },
  { key: "FechaHoraExpedicion", label: "Fecha Expedición", sortable: true },
  {
    key: "generar_factura",
    label: "Generar Factura",
    sortable: true,
    render: (value) => (value ? "Si" : "No"),
  },
  {
    key: "generar_instalacion",
    label: "Generar Instalación",
    sortable: true,
    render: (value) => (value ? "Si" : "No"),
  },
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
  clientes: Cliente[];
  canales: Canal[];
  conceptos: Concepto[];
}

export default function PedidosClientesClientPage({
  payload,
  paginationParams,
  clientes,
  canales,
  conceptos,
}: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <CRUD
      title="Pedidos de Clientes"
      columns={columns}
      data={data}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={Number(paginationParams.page) || 1}
      pageSize={Number(paginationParams.pageSize) || 10}
      formComponent={PedidoClienteForm}
      formClassName="w-full xs:w-full sm:w-full md:w-[90%] lg:w-[80%] overflow-y-auto"
      actions={{
        create: createPedidoCliente,
        update: updatePedidoCliente,
        delete: deletePedidoCliente,
      }}
      infoExtra={{ clientes, canales, conceptos }}
    />
  );
}
