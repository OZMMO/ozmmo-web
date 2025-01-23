'use client';
import {CRUD, Column} from '@/components/crud';
import { useEffect, useState } from 'react';
import { IPageSearchPaginationParams } from '@/lib/interfaces/paginations.interface';
import { IResponseModel } from '@/lib/interfaces/response-model.interface';
import { createServer, deleteServer, updateServer } from './actions';
import { UbicacionForm } from './ubicacion-form';
import { Ubicacion } from '@/lib/db';
  // import { Bodega } from '@/lib/db/catalogos/bodega.model';
  // import { Empresa } from '@/lib/db/catalogos/empresa.model';

const columns: Column<Ubicacion>[] = [
  // { key: 'id', label: 'ID', sortable: true },
  { key: 'codigo', label: 'Código', sortable: true },
  { key: 'descripcion', label: 'Descripción', sortable: true },
  { key: 'bodega', label: 'Bodega', sortable: true },
  { key: 'estado_ubicacion', label: 'Estado de Ubicación', sortable: true },
  { key: 'capacidad_maxima', label: 'Capacidad Máxima', sortable: true },
  { key: 'estatus', label: 'Estatus', sortable: true, render: (value) => value ? 'Activo' : 'Inactivo' }
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
  catalogoBodegas: any[];
  catalogoEstadosUbicacion: any[];
}

export interface UbicacionInfoExtra {
    catalogoBodegas: any[]
    catalogoEstadosUbicacion: any[]
  }

export default function BodegasClientPage({ payload, paginationParams, catalogoBodegas, catalogoEstadosUbicacion }: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null;
  }

  return (
    <CRUD<Ubicacion, UbicacionInfoExtra>
      columns={columns}
      data={data}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={Number(paginationParams.page) || 1}
      pageSize={Number(paginationParams.pageSize) || 10}
      formComponent={UbicacionForm}
      // jsClassName="Empresa"
      actions={{
        create: createServer,
        update: updateServer,
        delete: deleteServer,
      }}
      infoExtra={{ catalogoBodegas, catalogoEstadosUbicacion }}
    />
  );
}
