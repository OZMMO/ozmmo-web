import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import PedidosClientesClientPage from "./page.client";
import { auth } from "@/auth";
import {
  Cliente,
  Pedido,
  PedidoModel,
  Productos,
  ProductosModel,
  OrdenInstalacion,
  OrdenInstalacionModel,
  User,
  UserModel,
} from "@/lib/db";
import { CriteriaSqlServer } from "@/lib/db";
import { ClienteModel, CanalModel } from "@/lib/db";
import OrdenesInstalacionClientPage from "./page.client";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: IPageSearchPaginationParams;
}

export default async function OrdenesInstalacionPage({
  searchParams,
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Usuario no autenticado");
  }

  // Crear criterios de búsqueda
  const criteria = new CriteriaSqlServer<OrdenInstalacion>();
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
  const ordenInstalacionModel = new OrdenInstalacionModel();
  const { data, totalCount, totalPages } =
    await ordenInstalacionModel.findMany(criteria);
  console.log(data);
  // Obtener lista de clientes

  const criteriaCliente = new CriteriaSqlServer<Cliente>();
  criteriaCliente.addConditition("UserId", userId);
  const clienteModel = new ClienteModel();
  const { data: dataClientes } = await clienteModel.findMany(criteriaCliente);

  const criteriaPedidosClientes = new CriteriaSqlServer<Pedido>();
  criteriaPedidosClientes.addConditition("UserId", userId);
  const pedidoModel = new PedidoModel();
  const { data: dataPedidosClientes } = await pedidoModel.findMany(
    criteriaPedidosClientes
  );

  const criteriaProducto = new CriteriaSqlServer<Productos>();
  criteriaProducto.addConditition("UserId", userId);
  const productoModel = new ProductosModel();
  const { data: dataProductos } =
    await productoModel.findMany(criteriaProducto);

  const criteriaInstalador = new CriteriaSqlServer<User>();
  criteriaInstalador.addConditition("UserId", userId);
  const instaladorModel = new UserModel();
  const usuario = { Email: "", UserId: "" };
  const dataInstaladores = await instaladorModel.findMany(usuario);

  return (
    <OrdenesInstalacionClientPage
      payload={{
        data: data,
        totalCount: totalCount || 0,
        totalPages: totalPages,
      }}
      paginationParams={searchParams}
      clientes={dataClientes}
      pedidosClientes={dataPedidosClientes}
      productos={dataProductos}
      instaladores={dataInstaladores}
    />
  );
}
