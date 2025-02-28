"use client";

import { CRUD, Column } from "@/components/crud";
import { useEffect, useState } from "react";
import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import {
  createOrdenInstalacion,
  updateOrdenInstalacion,
  deleteOrdenInstalacion,
} from "./actions";
import { OrdenInstalacionForm } from "./orden-instalacion-form";
import { OrdenInstalacion, Cliente, Pedido, Productos, User } from "@/lib/db";

const columns: Column<OrdenInstalacion>[] = [
  { key: "cliente_razon_social", label: "Cliente", sortable: true },
  { key: "codigo", label: "codigo", sortable: true },
  { key: "pedido_codigo", label: "Pedido Cliente", sortable: true },
  { key: "FechaHoraInstalacion", label: "Fecha Instalación", sortable: true },
  {
    key: "instalador_nombre_completo",
    label: "Instalador",
    sortable: true,
  },
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
  clientes: Cliente[];
  pedidosClientes: Pedido[];
  productos: Productos[];
  instaladores: User[];
}

export default function OrdenesInstalacionClientPage({
  payload,
  paginationParams,
  clientes,
  pedidosClientes,
  productos,
  instaladores,
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
      title="Ordenes de Instalación"
      columns={columns}
      data={data}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={Number(paginationParams.page) || 1}
      pageSize={Number(paginationParams.pageSize) || 10}
      formComponent={OrdenInstalacionForm}
      formClassName="w-full xs:w-full sm:w-full md:w-[90%] lg:w-[80%] overflow-y-auto"
      actions={{
        create: createOrdenInstalacion,
        update: updateOrdenInstalacion,
        delete: deleteOrdenInstalacion,
      }}
      infoExtra={{ clientes, pedidosClientes, productos, instaladores }}
    />
  );
}
