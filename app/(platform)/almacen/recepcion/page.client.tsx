"use client";
import { CRUD, Column } from "@/components/crud";
import { useEffect, useState } from "react";
import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { createServer, deleteServer, updateServer } from "./actions";
import { RecepcionForm } from "./recepcion-form";
import { Recepcion } from "@/lib/db";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
// import { Bodega } from '@/lib/db/catalogos/bodega.model';
// import { Empresa } from '@/lib/db/catalogos/empresa.model';

const columns: Column<Recepcion>[] = [
  // { key: 'id', label: 'ID', sortable: true },
  { key: "numero_recepcion", label: "Número de Recepción", sortable: true },
  { key: "fecha_recepcion", label: "Fecha de Recepcion", sortable: true },
  { key: "proveedor", label: "Proveedor", sortable: true },
  { key: "bodega", label: "Bodega", sortable: true },
  {
    key: "completado",
    label: "Completado",
    sortable: true,
    render: (value) => (
      <Badge variant={value ? "default" : "secondary"}>
        {value ? "Sí" : "No"}
      </Badge>
    ),
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
  catalogoBodegas: any[];
  catalogoProveedores: any[];
}

export interface RecepcionInfoExtra {
  catalogoBodegas: any[];
  catalogoProveedores: any[];
}

export default function RecepcionesClientPage({
  payload,
  paginationParams,
  catalogoBodegas,
  catalogoProveedores,
}: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleViewDetails = (item: Recepcion) => {
    router.push(`/almacen/recepcion/${item.id}`);
    // Implement view details logic here
  };

  return (
    <CRUD<Recepcion, RecepcionInfoExtra>
      title="Recepciones de Productos"
      columns={columns}
      data={data}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={Number(paginationParams.page) || 1}
      pageSize={Number(paginationParams.pageSize) || 10}
      formComponent={RecepcionForm}
      // jsClassName="Empresa"
      actions={{
        create: createServer,
        update: updateServer,
        delete: deleteServer,
      }}
      infoExtra={{ catalogoBodegas, catalogoProveedores }}
      extraActions={[
        {
          icon: <MoreHorizontal className="h-4 w-4" />,
          onClick: (item: Recepcion) => handleViewDetails(item),
          title: "Detalle de Recepción",
          variant: "link",
          size: "icon",
          showAlert: false,
        },
      ]}
    />
  );
}
