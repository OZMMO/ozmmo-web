'use client';
import {CRUD, Column} from '@/components/crud';
import { useEffect, useState } from 'react';
import { IPageSearchPaginationParams } from '@/lib/interfaces/paginations.interface';
import { IResponseModel } from '@/lib/interfaces/response-model.interface';
import { createServer, deleteServer, updateServer } from './actions';
import { BodegaForm } from './bodega-form';
  // import { Bodega } from '@/lib/db/catalogos/bodega.model';
  // import { Empresa } from '@/lib/db/catalogos/empresa.model';

const columns: Column<any>[] = [
  // { key: 'id', label: 'ID', sortable: true },
  { key: 'codigo', label: 'Código', sortable: true },
  { key: 'descripcion', label: 'Descripción', sortable: true },
  { 
    key: 'tbl_empresas', label: 'Empresa', sortable: true, 
        render: (value) => {
        const codigo: string = typeof value === 'object' && value !== null && 'codigo' in value ? value.codigo : '';
        const razon_social: string = typeof value === 'object' && value !== null && 'razon_social' in value ? value.razon_social : '';
        return <div>{codigo} - {razon_social}</div>
        } 
    },
    { key: 'esta_activo', label: 'Estatus', sortable: true, render: (value) => value ? 'Activo' : 'Inactivo' }
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
  catalogoEmpresas: any[];
}

export interface BodegaInfoExtra {
    catalogoEmpresas: any[]
  }

export default function BodegasClientPage({ payload, paginationParams, catalogoEmpresas }: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null;
  }

  return (
    <CRUD<any, BodegaInfoExtra>
      columns={columns}
      data={data}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={Number(paginationParams.page) || 1}
      pageSize={Number(paginationParams.pageSize) || 10}
      formComponent={BodegaForm}
      // jsClassName="Empresa"
      actions={{
        create: createServer,
        update: updateServer,
        delete: deleteServer,
      }}
      infoExtra={{ catalogoEmpresas }}
    />
  );
}
