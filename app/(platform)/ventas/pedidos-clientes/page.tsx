import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import PedidosClientesClientPage from "./page.client";
import { auth } from "@/auth";
import { Canal, Cliente, Pedido, PedidoModel } from "@/lib/db";
import { CriteriaSqlServer } from "@/lib/db";
import { ClienteModel, CanalModel } from "@/lib/db";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: IPageSearchPaginationParams;
}

export default async function PedidosClientesPage({ searchParams }: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

  // Crear criterios de búsqueda
  const criteria = new CriteriaSqlServer<Pedido>();
  criteria.addConditition("page", Number(searchParams.page) || 1);
  criteria.addConditition("pageSize", Number(searchParams.pageSize) || 10);
  criteria.addConditition("query", searchParams.query || "");
  criteria.addConditition(
    "orderByColumn",
    searchParams.orderByColumn || "Name"
  );
  criteria.addConditition(
    "orderDirection",
    searchParams.orderDirection || "asc"
  );
  criteria.addConditition("UserId", userId);

  // Obtener datos de pedidos
  const pedidoModel = new PedidoModel();
  const pedidosResponse = await pedidoModel.findMany(criteria);

  // Obtener lista de clientes

  const criteriaCliente = new CriteriaSqlServer<Cliente>();
  criteriaCliente.addConditition("UserId", userId);
  const clienteModel = new ClienteModel();
  const { data: dataClientes } = await clienteModel.findMany(criteriaCliente);

  const criteriaCanal = new CriteriaSqlServer<Canal>();
  const canalModel = new CanalModel();
  const { data: dataCanales } = await canalModel.findMany(criteriaCanal);

  return (
    <PedidosClientesClientPage
      payload={pedidosResponse}
      paginationParams={searchParams}
      clientes={dataClientes}
      canales={dataCanales}
    />
  );
}
