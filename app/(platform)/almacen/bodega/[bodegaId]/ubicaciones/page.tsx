import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import BodegasClientPage from "./page.client";
import { auth } from "@/auth";
import {
  EstadosUbicacion,
  Ubicacion,
  Bodega,
  EstadosUbicacionModel,
  UbicacionesModel,
  BodegaModel,
} from "@/lib/db";
import { CriteriaSqlServer } from "@/lib/db";
// import { Empresa } from "@/lib/db/catalogos/empresa.model";
export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    bodegaId: string;
  };
  searchParams: IPageSearchPaginationParams;
}

export default async function UbicacionesPage({ params, searchParams }: PageProps) {
  const session = await auth();
  const userId = session?.user.id as string;

  const bodegaId = Number(params.bodegaId);

  const estadosUbicacionModel = new EstadosUbicacionModel();
  const criteriaEstadoUbicacion = new CriteriaSqlServer<EstadosUbicacion>();
  criteriaEstadoUbicacion.addConditition("UserId", userId);
  const { data: dataEstadosUbicacion } = await estadosUbicacionModel.findMany(criteriaEstadoUbicacion);

  const bodegaModel = new BodegaModel();
  const criteriaBodega = new CriteriaSqlServer<Bodega>();
  criteriaBodega.addConditition("id", bodegaId);
  criteriaBodega.addConditition("UserId", userId);
  const dataBodega = await bodegaModel.findUnique(criteriaBodega) || { id: 0, codigo: '', descripcion: '' };

  const ubicacionesModel = new UbicacionesModel();
  // Crear criteria desde searchParams
  const criteria = new CriteriaSqlServer<Ubicacion>();
  criteria.addConditition("bodega_id", bodegaId);
  criteria.addConditition("page", Number(searchParams.page) || 1);
  criteria.addConditition("pageSize", Number(searchParams.pageSize) || 10);
  criteria.addConditition("query", searchParams.query || "");
  criteria.addConditition("orderByColumn", searchParams.orderByColumn || "codigo");
  criteria.addConditition("orderDirection", searchParams.orderDirection || "asc");
  criteria.addConditition("UserId", userId);

  const { data, totalCount, totalPages } = await ubicacionesModel.findMany(criteria);

  return (
    <BodegasClientPage
      payload={{
        data: data,
        totalCount: totalCount || 0,
        totalPages: totalPages,
      }}
      paginationParams={searchParams}
      bodega={dataBodega as Bodega}
      catalogoEstadosUbicacion={dataEstadosUbicacion}
    />
  );
}
