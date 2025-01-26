import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import BodegasClientPage from "./page.client";
import { auth } from "@/auth";
import { Bodega, Empresa } from "@/lib/db";
import { CriteriaSqlServer, BodegaModel, EmpresaModel } from "@/lib/db";
// import { Empresa } from "@/lib/db/catalogos/empresa.model";
export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: IPageSearchPaginationParams;
}


export default async function BodegasPage({searchParams}: PageProps) {
  
  const session = await auth();
  const userId = session?.user.id as string

  const bodegaModel = new BodegaModel();
    
  const criteria1 = new CriteriaSqlServer<Bodega>();    
  criteria1.addConditition('UserId', userId);
  const {data: dataBodegas } = await bodegaModel.findMany(criteria1);

  const empresaModel = new EmpresaModel();
    
  const criteriaEmpresa = new CriteriaSqlServer<Empresa>();    
  criteriaEmpresa.addConditition('UserId', userId);
  const {data: dataEmpresas } = await empresaModel.findMany(criteriaEmpresa);

  // Crear criteria desde searchParams
  const criteria = new CriteriaSqlServer<Bodega>();
  criteria.addConditition('page', Number(searchParams.page) || 1);
  criteria.addConditition('pageSize', Number(searchParams.pageSize) || 10);
  criteria.addConditition('query', searchParams.query || '');
  criteria.addConditition('orderByColumn', searchParams.orderByColumn || 'Name');
  criteria.addConditition('orderDirection', searchParams.orderDirection || 'asc');
  criteria.addConditition('UserId', userId);

  const { data, totalCount, totalPages } = await bodegaModel.findMany(criteria);

  return <BodegasClientPage 
    payload={{
      data: data,
      totalCount: totalCount || 0,
      totalPages: totalPages
    }}
    paginationParams={searchParams}
    catalogoEmpresas={dataEmpresas}
  />;

  return <div>Bodegas</div>;
}
