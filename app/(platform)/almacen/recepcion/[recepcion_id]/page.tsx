import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import MaterialProductoClientPage from "./page.client";
import { auth } from "@/auth";
import {
  Productos,
  ProductosModel,
  UnidadesMedida,
  UnidadesMedidaModel,
  DetalleRecepcion,
  DetalleRecepcionModel,
  RecepcionModel,
  Recepcion,
} from "@/lib/db";
import { CriteriaSqlServer } from "@/lib/db";
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: IPageSearchPaginationParams;
  params: { recepcion_id: number };
}

export default async function DetalleRecepcionPage({
  searchParams,
  params,
}: PageProps) {
  const session = await auth();
  const userId = session?.user.id as string;
  console.log(params.recepcion_id, searchParams);
  //unidades de medida
  const unidadesMedidaModel = new UnidadesMedidaModel();
  const criteriaUnidadesMedida = new CriteriaSqlServer<UnidadesMedida>();
  criteriaUnidadesMedida.addConditition("UserId", userId);
  const { data: dataUnidadesMedida } = await unidadesMedidaModel.findMany(
    criteriaUnidadesMedida
  );

  //productos
  const productosModel = new ProductosModel();
  const criteriaProductos = new CriteriaSqlServer<Productos>();
  criteriaProductos.addConditition("UserId", userId);
  const { data: dataProductos } =
    await productosModel.findMany(criteriaProductos);

  //parent_producto
  const recepcionModel = new RecepcionModel();
  const criteriaRecepcion = new CriteriaSqlServer<Recepcion>();
  criteriaRecepcion.addConditition("UserId", userId);
  criteriaRecepcion.addConditition("id", params.recepcion_id);
  const dataRecepcion = await recepcionModel.findUnique(criteriaRecepcion);

  //material producto
  const detalleRecepcionModel = new DetalleRecepcionModel();
  // Crear criteria desde searchParams
  const criteria = new CriteriaSqlServer<DetalleRecepcion>();
  criteria.addConditition("recepcion_id", params.recepcion_id);
  criteria.addConditition("page", Number(searchParams.page) || 1);
  criteria.addConditition("pageSize", Number(searchParams.pageSize) || 10);
  criteria.addConditition("query", searchParams.query || "");
  criteria.addConditition("orderByColumn",searchParams.orderByColumn || "Name");
  criteria.addConditition("orderDirection",searchParams.orderDirection || "asc");
  criteria.addConditition("UserId", userId);

  const { data, totalCount, totalPages } = await detalleRecepcionModel.findMany(criteria);

  return (
    <MaterialProductoClientPage
      payload={{
        data: data,
        totalCount: totalCount || 0,
        totalPages: totalPages,
      }}
      paginationParams={searchParams}
      catalogoUnidadMedida={dataUnidadesMedida}
      catalogoProductos={dataProductos}
      recepcion_id={params.recepcion_id}
      recepcion={dataRecepcion}
    />
  );
}
