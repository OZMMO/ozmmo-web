'use client';

// Example usage in your page component:
import {SupabaseCRUD, Column} from '@/components/supabase-crud';
import { useEffect, useState } from 'react';
import { IPageSearchPaginationParams } from '@/lib/interfaces/paginations.interface';
import { IResponseModel } from '@/lib/interfaces/response-model.interface';
import { createSucursal, deleteSucursal, updateSucursal } from './actions';
import { Sucursal } from '@/lib/db/catalogos/sucursal.model';
import { SucursalForm } from './sucursal-form';
import { Empresa } from '@/lib/db/catalogos/empresa.model';

const columns: Column<Sucursal>[] = [
  { 
    key: 'catalogos_tbl_empresas', label: 'Empresa', sortable: true, 
    render: (value) => {
      const codigo: string = typeof value === 'object' && value !== null && 'codigo' in value ? value.codigo : '';
      const razon_social: string = typeof value === 'object' && value !== null && 'razon_social' in value ? value.razon_social : '';
      return <div>{codigo} - {razon_social}</div>
    } },
  { key: 'codigo', label: 'Código', sortable: true },
  { key: 'nombre', label: 'Nombre', sortable: true },
  { key: 'responsable', label: 'Responsable', sortable: true },
  // { key: 'correo_electronico', label: 'Correo', sortable: true },
  // { key: 'telefono', label: 'Teléfono', sortable: true },
  { key: 'estatus', label: 'Estatus', sortable: true, render: (value) => value ? 'Activo' : 'Inactivo' }
];

interface PageProps {
  payload: IResponseModel<Sucursal[]>;
  paginationParams: IPageSearchPaginationParams;
  catalogoEmpresas: Empresa[];
}

export interface SucursalInfoExtra {
  catalogoEmpresas: Empresa[]
}

export default function SucursalesClientPage({ payload, paginationParams, catalogoEmpresas }: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null;
  }

  return (
    <SupabaseCRUD<Sucursal, SucursalInfoExtra>
      columns={columns}
      data={data}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={Number(paginationParams.page) || 1}
      pageSize={Number(paginationParams.pageSize) || 10}
      formComponent={SucursalForm}
      actions={{
        create: createSucursal,
        update: updateSucursal,
        delete: deleteSucursal,
      }}
      infoExtra={{ catalogoEmpresas }}
    />
  );
}