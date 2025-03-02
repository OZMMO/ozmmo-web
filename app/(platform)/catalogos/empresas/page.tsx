import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import EmpresasClientPage from "./page.client";
import { auth } from "@/auth";
import { Empresa, RegimenFiscalModel } from "@/lib/db";
import { CriteriaSqlServer, EmpresaModel } from "@/lib/db";
import TipoContribuyenteModel from "@/lib/db/sat/tipos_contribuyentes/tipos_contributentes.model";

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

  // Crear criteria desde searchParams
  const criteria = new CriteriaSqlServer<Empresa>();
  criteria.addConditition('page', Number(searchParams.page) || 1);
  criteria.addConditition('pageSize', Number(searchParams.pageSize) || 10);
  criteria.addConditition('query', searchParams.query || '');
  criteria.addConditition('orderByColumn', searchParams.orderByColumn || 'codigo');
  criteria.addConditition('orderDirection', searchParams.orderDirection || 'asc');
  criteria.addConditition('UserId', userId);

  
  const tipoContribuyenteModel = new TipoContribuyenteModel();
  const regimenFiscalModel = new RegimenFiscalModel();
  
  const promiseAll = Promise.all([
    empresaModel.findMany(criteria),
    tipoContribuyenteModel.findMany(),
    regimenFiscalModel.findMany(userId)
  ])

  const [dataEmpresas, tiposContribuyentesResult, regimenesFiscalesResult] = await promiseAll;

  const { data, totalCount, totalPages } = dataEmpresas;
  const tiposContribuyentes = tiposContribuyentesResult;
  const regimenesFiscales = regimenesFiscalesResult;

  return <EmpresasClientPage 
    payload={{
      data: data,
      totalCount: totalCount || 0,
      totalPages: totalPages
    }}
    paginationParams={searchParams}
    tiposContribuyentes={tiposContribuyentes}
    regimenesFiscales={regimenesFiscales}
  />;

  return <div>Empresas</div>;
}
