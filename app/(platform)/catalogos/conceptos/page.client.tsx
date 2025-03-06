"use client";
import { CRUD, Column } from "@/components/crud";
import { useEffect, useState } from "react";
import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { createConcepto, updateConcepto, deleteConcepto } from "./actions";
import { ConceptoForm, InfoExtraConcepto } from "./concepto-form";
import { Concepto } from "@/lib/db/facturacion/concepto";
import { EmpresaForm } from "../empresas/empresa-form";
import {
  UsoCFDI,
  Impuesto,
  ObjetoImp,
  TipoFactor,
  ClaveProdServ,
  ClaveUnidad,
  Productos,
} from "@/lib/db";
const columns: Column<Concepto>[] = [
  // { key: 'id', label: 'ID', sortable: true },
  { key: "codigo", label: "Código", sortable: true },
  { key: "descripcion", label: "Descripción", sortable: true },
  { key: "uso_cfdi", label: "Uso CFDI", sortable: true },
  { key: "clave_prod_serv", label: "Clave Producto Servicio", sortable: true },
  { key: "ClaveUnidad", label: "Clave Unidad", sortable: true },
  { key: "ValorUnitario", label: "Valor Unitario", sortable: true },
  { key: "ObjetoImp", label: "Objeto Impuesto", sortable: true },
  { key: "Impuesto", label: "Impuesto", sortable: true },
  { key: "TipoFactor", label: "Tipo Factor", sortable: true },
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
  dataUsoCFDI: UsoCFDI[];
  dataImpuesto: Impuesto[];
  dataObjetoImp: ObjetoImp[];
  dataTipoFactor: TipoFactor[];
  dataClaveProdServ: ClaveProdServ[];
  dataClaveUnidad: ClaveUnidad[];
  productos: Productos[];
  // tiposContribuyentes: TipoContribuyente[];
  // regimenesFiscales: RegimenFiscal[];
}

export default function ConceptosClientPage({
  payload,
  paginationParams,
  dataUsoCFDI,
  dataImpuesto,
  dataObjetoImp,
  dataTipoFactor,
  dataClaveProdServ,
  dataClaveUnidad,
  productos,
}: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <CRUD<Concepto, InfoExtraConcepto>
      title="Catálogo de Conceptos"
      columns={columns}
      data={data}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={Number(paginationParams.page) || 1}
      pageSize={Number(paginationParams.pageSize) || 10}
      formComponent={ConceptoForm}
      formClassName="w-[95vw] max-w-[840px] sm:w-[100vw] md:w-[90vw] lg:w-[840px]"
      // jsClassName="Empresa"
      actions={{
        create: createConcepto,
        update: updateConcepto,
        delete: deleteConcepto,
      }}
      infoExtra={{
        dataUsoCFDI,
        dataImpuesto,
        dataObjetoImp,
        dataTipoFactor,
        dataClaveProdServ,
        dataClaveUnidad,
        productos,
      }}
    />
  );
}
