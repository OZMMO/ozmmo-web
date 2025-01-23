"use client";
import { CRUD, Column } from "@/components/crud";
import { useEffect, useState } from "react";
import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { createServer, deleteServer, updateServer } from "./actions";
import { ProductosForm } from "./producto-form";
import { Productos } from "@/lib/db";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const columns: Column<Productos>[] = [
  // { key: 'id', label: 'ID', sortable: true },
  { key: "codigo", label: "Código", sortable: true },
  { key: "codigo_proveedor", label: "Código Proveedor", sortable: true },
  { key: "descripcion", label: "Descripción", sortable: true },
  { key: "unidad_medida", label: "Unidad de Medida", sortable: true },
  {
    key: "es_ensamble",
    label: "Es Ensamblado",
    sortable: true,
    render: (value) => (value ? "Si" : "No"),
  },
  { key: "peso", label: "Peso", sortable: true },
  { key: "volumen", label: "Volumen", sortable: true },
  {
    key: "estatus",
    label: "Estatus",
    sortable: true,
    render: (value) => (value ? "Activo" : "Inactivo"),
  },
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
  catalogoUnidadMedida: any[];
}

export interface ProductosInfoExtra {
  catalogoUnidadMedida: any[];
}

export default function ProductosClientPage({
  payload,
  paginationParams,
  catalogoUnidadMedida,
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

  const handleViewDetails = (item: Productos) => {
    if (item.es_ensamble) {
      router.push(`/catalogos/productos/${item.id}`);
    } else {
      toast.error("El producto no es ensamble");
    }
    // Implement view details logic here
  };

  return (
    <CRUD<Productos, ProductosInfoExtra>
      columns={columns}
      data={data}
      totalCount={totalCount}
      totalPages={totalPages}
      currentPage={Number(paginationParams.page) || 1}
      pageSize={Number(paginationParams.pageSize) || 10}
      formComponent={ProductosForm}
      // jsClassName="Empresa"
      actions={{
        create: createServer,
        update: updateServer,
        delete: deleteServer,
      }}
      infoExtra={{ catalogoUnidadMedida }}
      extraActions={[
        {
          icon: <MoreHorizontal className="h-4 w-4" />,
          onClick: (item: Productos) => handleViewDetails(item),
          title: "Lista Materiales",
          variant: "link",
          size: "icon",
          showAlert: false,
        },
      ]}
    />
  );
}
