import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import MaterialProductoClientPage from "./page.client";
import { auth } from "@/auth";
import {
  Productos,
  ProductosModel,
  MaterialProducto,
  MaterialProductoModel,
  UnidadesMedida,
  UnidadesMedidaModel,
} from "@/lib/db";
import { CriteriaSqlServer } from "@/lib/db";
import { useParams } from "next/navigation";
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: IPageSearchPaginationParams;
  params: { producto_id: number };
}

export default async function MaterialProductoPage({
  searchParams,
  params,
}: PageProps) {
  const session = await auth();
  const userId = session?.user.id as string;
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
  const parentproductoModel = new ProductosModel();
  const criteriaParentProductos = new CriteriaSqlServer<Productos>();
  criteriaParentProductos.addConditition("UserId", userId);
  criteriaParentProductos.addConditition("id", params.producto_id);
  const dataParentProductos = await parentproductoModel.findUnique(
    criteriaParentProductos
  );

  //material producto
  const materialProductoModel = new MaterialProductoModel();
  // Crear criteria desde searchParams
  const criteria = new CriteriaSqlServer<MaterialProducto>();
  criteria.addConditition("producto_parent_id", params.producto_id);
  criteria.addConditition("page", Number(searchParams.page) || 1);
  criteria.addConditition("pageSize", Number(searchParams.pageSize) || 10);
  criteria.addConditition("query", searchParams.query || "");
  criteria.addConditition("orderByColumn",searchParams.orderByColumn || "Name");
  criteria.addConditition("orderDirection",searchParams.orderDirection || "asc");
  criteria.addConditition("UserId", userId);

  const { data, totalCount, totalPages } = await materialProductoModel.findMany(criteria);

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
      producto_parent_id={params.producto_id}
      producto_parent={dataParentProductos}
    />
  );

  return <div>Bodegas</div>;
}
