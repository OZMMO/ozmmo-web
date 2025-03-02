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
  params: {
    empresaId: string;
  };
}
export default async function SucursalesPage({ searchParams, params }: PageProps) {
  const session = await auth();
  const userId = session?.user.id as string;
  const empresaId = params.empresaId;

  const sucursalModel = new SucursalModel();

  // const criteria1 = new CriteriaSqlServer<Sucursal>();
  // criteria1.addConditition("empresa_id", empresaId);
  // criteria1.addConditition("UserId", userId);
  // const { data: dataSucursales } = await sucursalModel.findMany(criteria1);

  const empresaModel = new EmpresaModel();

  const criteriaEmpresa = new CriteriaSqlServer<Empresa>();
  criteriaEmpresa.addConditition("id", empresaId);
  criteriaEmpresa.addConditition("UserId", userId);
  const empresa = await empresaModel.findUnique(criteriaEmpresa);

  // Crear criteria desde searchParams
  const criteria = new CriteriaSqlServer<Sucursal>();
  criteria.addConditition("empresa_id", empresaId);
  criteria.addConditition("page", Number(searchParams.page) || 1);
  criteria.addConditition("pageSize", Number(searchParams.pageSize) || 10);
  criteria.addConditition("query", searchParams.query || "");
  criteria.addConditition("orderByColumn", searchParams.orderByColumn || "codigo");
  criteria.addConditition("orderDirection", searchParams.orderDirection || "asc");
  criteria.addConditition("UserId", userId);

  const { data, totalCount, totalPages } = await sucursalModel.findMany(criteria);
  console.log(data);

  return (
    <SucursalesClientPage
      payload={{
        data: data,
        totalCount: totalCount || 0,
        totalPages: totalPages,
      }}
      paginationParams={searchParams}
      empresa={empresa as Empresa}
    />
  );
}
