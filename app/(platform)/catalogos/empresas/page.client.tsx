'use client';
import {Action, CRUD, Column} from '@/components/crud';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IPageSearchPaginationParams } from '@/lib/interfaces/paginations.interface';
import { IResponseModel } from '@/lib/interfaces/response-model.interface';
import { createEmpresa, updateEmpresa, deleteEmpresa } from './actions';
import { EmpresaForm, InfoExtraEmpresa } from './empresa-form';
import { Empresa } from '@/lib/db/catalogos/empresas/empresa';
import { TipoContribuyente } from '@/lib/db/sat/tipos_contribuyentes/tipo_contribuyente';
import { RegimenFiscal } from '@/lib/db/sat/regimenes_fiscales/regimen_fiscal';
import { Badge } from '@/components/ui/badge';
import { Building2, PlusIcon } from 'lucide-react';

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
   { key: 'sucursales', label: 'Sucursales', sortable: true, 
    render: (value: any) => {
      return <div className="text-center">{value?.length || 0}</div>;
    }
   }
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
  tiposContribuyentes: TipoContribuyente[]; 
  regimenesFiscales: RegimenFiscal[];
}

export default function EmpresasClientPage({ payload, paginationParams, tiposContribuyentes, regimenesFiscales }: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const router = useRouter();
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null;
  }

  const extraActions: Action<Empresa>[] = [
    {
      title: 'Sucursales',
      icon: <Building2 />,
      onClick: (empresa: Empresa) => {
        console.log(empresa);
        router.push(`/catalogos/empresas/${empresa.id}/sucursales`);
      },
      variant: 'default',
      size: 'icon'
    }
  ]

  return (
    <CRUD<Empresa, InfoExtraEmpresa>
      title="Catálogo de Empresas"
      columns={columns}
      data={data}
      extraActions={extraActions}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={Number(paginationParams.page) || 1}
      pageSize={Number(paginationParams.pageSize) || 10}
      formComponent={EmpresaForm}
      formClassName='w-[95vw] max-w-[840px] sm:w-[100vw] md:w-[90vw] lg:w-[840px]'
      // jsClassName="Empresa"
      actions={{
        create: createEmpresa,
        update: updateEmpresa,
        delete: deleteEmpresa,
      }}
      infoExtra={{
        tiposContribuyentes,
        regimenesFiscales
      }}
    />
  );
}
