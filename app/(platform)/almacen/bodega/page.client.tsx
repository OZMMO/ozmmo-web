'use client';
import {Action, CRUD, Column} from '@/components/crud';
import React, { useEffect, useState } from 'react';
import { IPageSearchPaginationParams } from '@/lib/interfaces/paginations.interface';
import { IResponseModel } from '@/lib/interfaces/response-model.interface';
import { createServer, deleteServer, updateServer } from './actions';
import { BodegaForm } from './bodega-form';
import { Bodega, Empresa } from '@/lib/db';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
  // import { Bodega } from '@/lib/db/catalogos/bodega.model';
  // import { Empresa } from '@/lib/db/catalogos/empresa.model';

const columns: Column<Bodega>[] = [
  // { key: 'id', label: 'ID', sortable: true },
  { key: 'codigo', label: 'Código', sortable: true },
  { key: 'descripcion', label: 'Descripción', sortable: true },
  { key: 'empresa', label: 'Empresa', sortable: true, render: (value: Bodega[keyof Bodega]): React.ReactNode => {
    const empresa = value as Empresa;
    return (
      empresa 
      ? <span>{empresa.rfc}-{empresa.razon_social}</span>
      : <span>Sin empresa</span>
    )
  } },
  { key: 'estatus', label: 'Estatus', sortable: true,
    render: (value: any) => {
      if (typeof value === 'object' && value !== null && 'estatus' in value) {
        return value.estatus ? <Badge variant="default">Activo</Badge> : <Badge variant="destructive">Inactivo</Badge>;
      }
      return value ? <Badge variant="default">Activo</Badge> : <Badge variant="destructive">Inactivo</Badge>;
    }
   },
   { key: 'ubicaciones', label: 'Ubicaciones', sortable: true, render: (value: any) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? (
        <span>{value.length} ubicación(es)</span>
      ) : (
        <span>Sin ubicaciones</span>  
      )
    }
    return <span>Sin ubicaciones</span>
   }  
  }
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams & { empresaId?: string };
  catalogoEmpresas: any[];
}

export interface BodegaInfoExtra {
    catalogoEmpresas: any[]
  }

export default function BodegasClientPage({ payload, paginationParams, catalogoEmpresas }: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleEmpresaChange = (empresaId: string) => {
    const params = new URLSearchParams(searchParams);
    if (empresaId) {
      params.set('empresaId', empresaId);
    } else {
      params.delete('empresaId');
    }
    router.push(`/almacen/bodega?${params.toString()}`);
  };

  if (!isClient) {
    return null;
  }

  
const extraActions: Action<Bodega>[] = [
  {
    title: 'Ver Ubicaciones',
    icon: <MapPin />,
    onClick: (row: Bodega) => {
      router.push(`/almacen/bodega/${row.id}/ubicaciones`);
    },
    variant: 'default',
    size: 'icon'
  }
]


  return (
    <>
      <div className="mb-6">
        <Select
          value={paginationParams.empresaId || ''}
          onValueChange={handleEmpresaChange}
        >
          <SelectTrigger className="w-full max-w-2xl h-20">
            <SelectValue placeholder="Seleccionar empresa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0" className="py-2">Todas las empresas</SelectItem>
            {catalogoEmpresas
              .sort((a, b) => (b.bodegas?.length || 0) - (a.bodegas?.length || 0))
              .map((empresa: Empresa) => (
                <SelectItem key={empresa.id} value={empresa.id.toString()} className="py-3">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-sm">RFC: {empresa.rfc}</span>
                    <span className="font-medium">Razón Social: {empresa.razon_social}</span>
                    <span className="text-sm text-muted-foreground">Bodegas: {empresa.bodegas?.length || 0}</span>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <CRUD<Bodega, BodegaInfoExtra>
        title="Catálogo de Bodegas"
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
        extraActions={extraActions}
      />
    </>
  );
}
