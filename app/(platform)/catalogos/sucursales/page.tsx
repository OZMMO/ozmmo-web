import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import SucursalesClientPage from "./page.client";
import {
  CriteriaSqlServer,
  Empresa,
  EmpresaModel,
  Sucursal,
  SucursalModel,
} from "@/lib/db";
import { auth } from "@/auth";
// import { Empresa } from "@/lib/db/catalogos/empresa.model";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: IPageSearchPaginationParams;
}
export default async function SucursalesPage({ searchParams }: PageProps) {
  const session = await auth();
  const userId = session?.user.id as string;

  const sucursalModel = new SucursalModel();

  const criteria1 = new CriteriaSqlServer<Sucursal>();
  criteria1.addConditition("UserId", userId);
  const { data: dataSucursales } = await sucursalModel.findMany(criteria1);

  const empresaModel = new EmpresaModel();

  const criteriaEmpresa = new CriteriaSqlServer<Empresa>();
  criteriaEmpresa.addConditition("UserId", userId);
  const { data: dataEmpresas } = await empresaModel.findMany(criteriaEmpresa);

  // Crear criteria desde searchParams
  const criteria = new CriteriaSqlServer<Sucursal>();
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

  const { data, totalCount, totalPages } =
    await sucursalModel.findMany(criteria);

  return (
    <SucursalesClientPage
      payload={{
        data: data,
        totalCount: totalCount || 0,
        totalPages: totalPages,
      }}
      paginationParams={searchParams}
      catalogoEmpresas={dataEmpresas}
    />
  );

  return <div>Bodegas</div>;
}
