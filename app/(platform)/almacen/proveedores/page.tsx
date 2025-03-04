import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import BodegasClientPage from "./page.client";
import { auth } from "@/auth";
import { Proveedor, ProveedoresModel } from "@/lib/db";
import { CriteriaSqlServer } from "@/lib/db";
import ProveedoresClientPage from "./page.client";
// import { Empresa } from "@/lib/db/catalogos/empresa.model";
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: IPageSearchPaginationParams;
}

export default async function ProveedoresPage({ searchParams }: PageProps) {
  const session = await auth();
  const userId = session?.user.id as string;

  const proveedoresModel = new ProveedoresModel();
  // Crear criteria desde searchParams
  const criteria = new CriteriaSqlServer<Proveedor>();
  criteria.addConditition("page", Number(searchParams.page) || 1);
  criteria.addConditition("pageSize", Number(searchParams.pageSize) || 10);
  criteria.addConditition("query", searchParams.query || "");
  criteria.addConditition("orderByColumn",  searchParams.orderByColumn || "codigo");
  criteria.addConditition("orderDirection", searchParams.orderDirection || "asc");
  criteria.addConditition("UserId", userId);

  const { data, totalCount, totalPages } = await proveedoresModel.findMany(criteria);

  return (
    <ProveedoresClientPage
      payload={{
        data: data,
        totalCount: totalCount || 0,
        totalPages: totalPages,
      }}
      paginationParams={searchParams}
    />
  );
}
