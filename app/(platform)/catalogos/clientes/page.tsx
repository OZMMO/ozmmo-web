import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import ClientesClientPage from "./page.client";
import { auth } from "@/auth";
import { Cliente, ClienteModel, RegimenFiscalModel } from "@/lib/db";
import { CriteriaSqlServer } from "@/lib/db";
import TipoContribuyenteModel from "@/lib/db/sat/tipos_contribuyentes/tipos_contributentes.model";

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: IPageSearchPaginationParams;
}

export default async function ClientesPage({searchParams}: PageProps) {

  const session = await auth();
  const userId = session?.user.id as string;

  const clienteModel = new ClienteModel();

  const criteria = new CriteriaSqlServer<Cliente>();
  criteria.addConditition('page', Number(searchParams.page) || 1);
  criteria.addConditition('pageSize', Number(searchParams.pageSize) || 10);
  criteria.addConditition('query', searchParams.query || '');
  criteria.addConditition('orderByColumn', searchParams.orderByColumn || 'codigo');
  criteria.addConditition('orderDirection', searchParams.orderDirection || 'asc');
  criteria.addConditition('UserId', userId);

  const tiposContribuyentesModel = new TipoContribuyenteModel();
  const regimenFiscalModel = new RegimenFiscalModel();

  const promiseAll = Promise.all([
    clienteModel.findMany(criteria),
    tiposContribuyentesModel.findMany(),
    regimenFiscalModel.findMany(userId)
  ])

  const [dataClientes, tiposContribuyentesResult, regimenFiscalesResult] = await promiseAll; 

  const { data, totalCount, totalPages } = dataClientes;
  const tiposContribuyentes = tiposContribuyentesResult;
  const regimenFiscales = regimenFiscalesResult;

  console.log({ dataClientes });
  return <ClientesClientPage payload={dataClientes} paginationParams={searchParams} tiposContribuyentes={tiposContribuyentes} regimenesFiscales={regimenFiscales} />
}
