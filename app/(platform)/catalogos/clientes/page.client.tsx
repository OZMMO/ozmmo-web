'use client';

import { CRUD, Column } from '@/components/crud';
import { useEffect, useState } from 'react';
import { IPageSearchPaginationParams } from '@/lib/interfaces/paginations.interface';
import { IResponseModel } from '@/lib/interfaces/response-model.interface';
import { createCliente, updateCliente, deleteCliente } from './actions';
import { ClienteForm, InfoExtraCliente } from './cliente-form';
import { Cliente } from '@/lib/db/catalogos/clientes/cliente';
import { RegimenFiscal } from '@/lib/db/sat/regimenes_fiscales/regimen_fiscal';
import { TipoContribuyente } from '@/lib/db/sat/tipos_contribuyentes/tipo_contribuyente';

const columns: Column<Cliente>[] = [
  { key: 'codigo', label: 'Código', sortable: true },
  { key: 'razon_social', label: 'Razón Social', sortable: true },
  { key: 'rfc', label: 'RFC', sortable: true },
  { key: 'correo_electronico', label: 'Correo', sortable: true },
  { key: 'estatus', label: 'Estatus', sortable: true,
    render: (value: any) => {
      if (typeof value === 'object' && value !== null && 'estatus' in value) {
        return value.estatus ? 'Activo' : 'Inactivo';
      }
      return value ? 'Activo' : 'Inactivo';
    }
   }
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
  tiposContribuyentes: TipoContribuyente[]; 
  regimenesFiscales: RegimenFiscal[];
}

export default function ClientesClientPage({ payload, paginationParams, tiposContribuyentes, regimenesFiscales }: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null;
  }

  return (
    <CRUD<Cliente, InfoExtraCliente>
      columns={columns}
      data={data}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={Number(paginationParams.page) || 1}
      pageSize={Number(paginationParams.pageSize) || 10}
      formComponent={ClienteForm}
      formClassName='w-[95vw] max-w-[840px] sm:w-[100vw] md:w-[90vw] lg:w-[840px]'
      actions={{
        create: createCliente,
        update: updateCliente,
        delete: deleteCliente,
      }}
      infoExtra={{ tiposContribuyentes, regimenesFiscales }}
    />
  );
}