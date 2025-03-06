import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import ConceptosClientPage from "./page.client";
import { auth } from "@/auth";
import {
  ClaveProdServModel,
  ImpuestoModel,
  ConceptoModel,
  TipoFactorModel,
  ObjetoImpModel,
  UsoCFDIModel,
  ClaveUnidadModel,
  Concepto,
  ProductosModel,
  Productos,
} from "@/lib/db";
import { CriteriaSqlServer } from "@/lib/db";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: IPageSearchPaginationParams;
}

export default async function SucursalesPage({ searchParams }: PageProps) {
  const session = await auth();
  const userId = session?.user.id as string;

  const conceptoModel = new ConceptoModel();
  // Crear criteria desde searchParams
  const criteria = new CriteriaSqlServer<Concepto>();
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

  const usoCFDIModel = new UsoCFDIModel();
  const impuestoModel = new ImpuestoModel();
  const objetoImpModel = new ObjetoImpModel();
  const tipoFactorModel = new TipoFactorModel();
  const claveProdServModel = new ClaveProdServModel();
  const claveUnidadModel = new ClaveUnidadModel();
  const productosModel = new ProductosModel();

  const criteriaProductos = new CriteriaSqlServer<Productos>();
  criteriaProductos.addConditition("UserId", userId);

  const promiseAll = Promise.all([
    conceptoModel.findMany(criteria),
    usoCFDIModel.findMany(),
    impuestoModel.findMany(),
    objetoImpModel.findMany(),
    tipoFactorModel.findMany(),
    claveProdServModel.findMany(),
    claveUnidadModel.findMany(),
    productosModel.findMany(criteriaProductos),
  ]);

  const [
    dataConceptos,
    dataUsoCFDI,
    dataImpuesto,
    dataObjetoImp,
    dataTipoFactor,
    dataClaveProdServ,
    dataClaveUnidad,
    dataProductos,
  ] = await promiseAll;
  console.log(dataConceptos.data[1].detalles);
  const { data, totalCount, totalPages } = dataConceptos;

  return (
    <ConceptosClientPage
      payload={{
        data: data,
        totalCount: totalCount || 0,
        totalPages: totalPages,
      }}
      paginationParams={searchParams}
      dataUsoCFDI={dataUsoCFDI}
      dataImpuesto={dataImpuesto}
      dataObjetoImp={dataObjetoImp}
      dataTipoFactor={dataTipoFactor}
      dataClaveProdServ={dataClaveProdServ}
      dataClaveUnidad={dataClaveUnidad}
      productos={dataProductos.data}
    />
  );

  return <div>Conceptos</div>;
}
