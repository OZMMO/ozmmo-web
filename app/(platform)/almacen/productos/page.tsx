import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import ProductosClientPage from "./page.client";
import { auth } from "@/auth";
import {
  Productos,
  ProductosModel,
  UnidadesMedida,
  UnidadesMedidaModel,
} from "@/lib/db";
import { CriteriaSqlServer } from "@/lib/db";
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: IPageSearchPaginationParams;
}

export default async function ProductosPage({ searchParams }: PageProps) {
  const session = await auth();
  const userId = session?.user.id as string;

  const unidadesMedidaModel = new UnidadesMedidaModel();
  const criteriaUnidadesMedida = new CriteriaSqlServer<UnidadesMedida>();
  criteriaUnidadesMedida.addConditition("UserId", userId);
  const { data: dataUnidadesMedida } = await unidadesMedidaModel.findMany(
    criteriaUnidadesMedida
  );

  const productosModel = new ProductosModel();
  // Crear criteria desde searchParams
  const criteria = new CriteriaSqlServer<Productos>();
  criteria.addConditition("page", Number(searchParams.page) || 1);
  criteria.addConditition("pageSize", Number(searchParams.pageSize) || 10);
  criteria.addConditition("query", searchParams.query || "");
  criteria.addConditition("orderByColumn", searchParams.orderByColumn || "codigo");
  criteria.addConditition("orderDirection", searchParams.orderDirection || "asc");
  criteria.addConditition("UserId", userId);

  const { data, totalCount, totalPages } = await productosModel.findMany(criteria);

  return (
    <ProductosClientPage
      payload={{
        data: data,
        totalCount: totalCount || 0,
        totalPages: totalPages,
      }}
      paginationParams={searchParams}
      catalogoUnidadMedida={dataUnidadesMedida}
    />
  );

  return <div>Bodegas</div>;
}
