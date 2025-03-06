'use client';
import {CRUD, Column} from '@/components/crud';
import { useEffect, useState } from 'react';
import { IPageSearchPaginationParams } from '@/lib/interfaces/paginations.interface';
import { IResponseModel } from '@/lib/interfaces/response-model.interface';
import { createServer, deleteServer, updateServer } from './actions';
import { UbicacionForm } from './ubicacion-form';
import { Bodega, Ubicacion } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Warehouse } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
  // import { Bodega } from '@/lib/db/catalogos/bodega.model';
  // import { Empresa } from '@/lib/db/catalogos/empresa.model';

const columns: Column<Ubicacion>[] = [
  // { key: 'id', label: 'ID', sortable: true },
  { key: 'codigo', label: 'Código', sortable: true },
  { key: 'descripcion', label: 'Descripción', sortable: true },
  { key: 'bodega', label: 'Bodega', sortable: true },
  { key: 'estado_ubicacion', label: 'Estado de Ubicación', sortable: true },
  { key: 'capacidad_maxima', label: 'Capacidad Máxima', sortable: true },
  { key: 'ocupado', label: 'Ocupado', sortable: true },
  { 
    key: 'porcentaje_ocupado', 
    label: 'Porcentaje ocupado', 
    sortable: true,
    render: (value: any) => {
      const porcentaje = (typeof value === 'object' && value !== null && 'porcentaje_ocupado' in value)
        ? value.porcentaje_ocupado
        : value;
      return (
        <div className="w-full">
          <Progress value={porcentaje} className="h-2" />
          <span className="text-xs text-muted-foreground">{Math.round(porcentaje)}%</span>
        </div>
      );
    }
  },
  { key: 'estatus', label: 'Estatus', sortable: true,
    render: (value: any) => {
      const status = (typeof value === 'object' && value !== null && 'estatus' in value) 
        ? value.estatus 
        : value;

      return (
        <Badge variant={status ? "default" : "destructive"}>
          {status ? "Activo" : "Inactivo"}
        </Badge>
      );
    }
   },
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
  bodega: Bodega;
  catalogoEstadosUbicacion: any[];
}

export interface UbicacionInfoExtra {
    bodega: Bodega;
    catalogoEstadosUbicacion: any[]
  }

export default function UbicacionesClientPage({ payload, paginationParams, bodega, catalogoEstadosUbicacion }: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col space-y-1.5 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Warehouse className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-medium">Bodega seleccionada</h4>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">{bodega.codigo}</Badge>
            <span className="text-sm text-muted-foreground">{bodega.descripcion}</span>
          </div>
        </div>
      </div>
      <CRUD<Ubicacion, UbicacionInfoExtra>
        title="Catálogo de Ubicaciones"
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
        infoExtra={{ bodega, catalogoEstadosUbicacion }}
      />
    </>
  );
}
