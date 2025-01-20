import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import EmpresasClientPage from "./page.client";
import { auth } from "@/auth";
import { Empresa } from "@/lib/db";
import { CriteriaSqlServer, EmpresaModel } from "@/lib/db";

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: IPageSearchPaginationParams;
}


export default async function SucursalesPage({searchParams}: PageProps) {
  
  const session = await auth();
  const userId = session?.user.id as string

  const empresaModel = new EmpresaModel();
    
  const criteria1 = new CriteriaSqlServer<Empresa>();    
  criteria1.addConditition('UserId', userId);
  const {data: dataEmpresas } = await empresaModel.findMany(criteria1);


  // Crear criteria desde searchParams
  const criteria = new CriteriaSqlServer<Empresa>();
  criteria.addConditition('page', Number(searchParams.page) || 1);
  criteria.addConditition('pageSize', Number(searchParams.pageSize) || 10);
  criteria.addConditition('query', searchParams.query || '');
  criteria.addConditition('orderByColumn', searchParams.orderByColumn || 'Name');
  criteria.addConditition('orderDirection', searchParams.orderDirection || 'asc');
  criteria.addConditition('UserId', userId);

  const { data, totalCount, totalPages } = await empresaModel.findMany(criteria);

  return <EmpresasClientPage 
    payload={{
      data: data,
      totalCount: totalCount || 0,
      totalPages: totalPages
    }}
    paginationParams={searchParams}
  />;

  return <div>Empresas</div>;
}
