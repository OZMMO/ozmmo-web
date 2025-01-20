'use client';
import {CRUD, Column} from '@/components/crud';
import { useEffect, useState } from 'react';
import { IPageSearchPaginationParams } from '@/lib/interfaces/paginations.interface';
import { IResponseModel } from '@/lib/interfaces/response-model.interface';
import { createServer, deleteServer, updateServer } from './actions';
import { EmpresaForm } from './empresa-form';
import { Empresa } from '@/lib/db';
// import { Empresa } from '@/lib/db/catalogos/empresa.model';

const columns: Column<Empresa>[] = [
  // { key: 'id', label: 'ID', sortable: true },
  { key: 'codigo', label: 'Código', sortable: true },
  { key: 'razon_social', label: 'Razón Social', sortable: true },
  { key: 'nombre_comercial', label: 'Nombre Comercial', sortable: true }, 
  { key: 'rfc', label: 'RFC', sortable: true },
  { key: 'correo_electronico', label: 'Correo', sortable: true },
  // { key: 'telefono', label: 'Teléfono', sortable: true },
  // { 
  //   key: 'fecha_registro',
  //   label: 'Fecha Registro', 
  //   sortable: true,
  //   render: (value: string | number | boolean | null) => 
  //     value && typeof value !== 'boolean' ? new Date(value.toString()).toLocaleDateString() : ''
  // },
  { key: 'estatus', label: 'Estatus', sortable: true,
    render: (value: string | number | boolean | Date | undefined) => 
      value ? 'Activo' : 'Inactivo'
   }
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
}


export default function EmpresasClientPage({ payload, paginationParams }: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null;
  }

  return (
    <CRUD<Empresa, null>
      columns={columns}
      data={data}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={Number(paginationParams.page) || 1}
      pageSize={Number(paginationParams.pageSize) || 10}
      formComponent={EmpresaForm}
      // jsClassName="Empresa"
      actions={{
        create: createServer,
        update: updateServer,
        delete: deleteServer,
      }}
    />
  );
}
