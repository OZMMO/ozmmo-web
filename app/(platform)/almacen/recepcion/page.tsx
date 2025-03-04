import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import BodegasClientPage from "./page.client";
import { auth } from "@/auth";
import {
  Bodega,
  BodegaModel,
  Recepcion,
  RecepcionModel,
  Proveedor,
  ProveedoresModel,
} from "@/lib/db";
import { CriteriaSqlServer } from "@/lib/db";
import RecepcionesClientPage from "./page.client";
// import { Empresa } from "@/lib/db/catalogos/empresa.model";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: IPageSearchPaginationParams;
}

export default async function RecepcionesPage({ searchParams }: PageProps) {
  const session = await auth();
  const userId = session?.user.id as string;

  const proveedoresModel = new ProveedoresModel();
  const criteriaProveedores = new CriteriaSqlServer<Proveedor>();
  criteriaProveedores.addConditition("UserId", userId);
  const { data: dataProveedores } = await proveedoresModel.findMany(criteriaProveedores);

  const bodegaModel = new BodegaModel();
  const criteriaBodega = new CriteriaSqlServer<Bodega>();
  criteriaBodega.addConditition("UserId", userId);

  const { data: dataBodegas } = await bodegaModel.findMany(criteriaBodega);

  const recepcionModel = new RecepcionModel();
  // Crear criteria desde searchParams
  const criteria = new CriteriaSqlServer<Recepcion>();
  criteria.addConditition("page", Number(searchParams.page) || 1);
  criteria.addConditition("pageSize", Number(searchParams.pageSize) || 10);
  criteria.addConditition("query", searchParams.query || "");
  criteria.addConditition("orderByColumn",searchParams.orderByColumn || "numero_recepcion");
  criteria.addConditition("orderDirection",searchParams.orderDirection || "desc");
  criteria.addConditition("UserId", userId);

  const { data, totalCount, totalPages } = await recepcionModel.findMany(criteria);

  console.log(dataBodegas[0]?.empresa);
  return (
    <RecepcionesClientPage
      payload={{
        data: data,
        totalCount: totalCount || 0,
        totalPages: totalPages,
      }}
      paginationParams={searchParams}
      catalogoBodegas={dataBodegas}
      catalogoProveedores={dataProveedores}
    />
  );
}
