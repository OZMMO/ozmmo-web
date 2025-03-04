"use client";
import { CRUD, Column } from "@/components/crud";
import { useEffect, useState } from "react";
import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { createServer, deleteServer, updateServer } from "./actions";
import { MaterialProductoForm } from "./material_producto-form";
import { MaterialProducto, Productos, UnidadesMedida } from "@/lib/db";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BellRing } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const columns: Column<MaterialProducto>[] = [
  // { key: 'id', label: 'ID', sortable: true },
  { key: "producto", label: "Producto", sortable: true },
  { key: "cantidad_necesaria", label: "Cantidad Necesaria", sortable: true },
  { key: "unidad_medida", label: "Unidad de Medida", sortable: true },
  {
    key: "nota",
    label: "Nota",
    sortable: true,
    render: (value) => {
      return <p className="text-sm text-wrap">{value?.toString()}</p>;
    },
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
  { key: "fecha_registro", label: "Fecha de Registro", sortable: true },
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
  catalogoUnidadMedida: UnidadesMedida[];
  catalogoProductos: Productos[];
  producto_parent_id: number;
  producto_parent: Productos | null;
}

export interface MaterialProductoInfoExtra {
  catalogoUnidadMedida: UnidadesMedida[];
  catalogoProductos: Productos[];
  producto_parent_id: number;
  producto_parent: Productos | null;
}

type CardProps = React.ComponentProps<typeof Card>;

export default function MaterialProductoClientPage({
  payload,
  paginationParams,
  catalogoUnidadMedida,
  catalogoProductos,
  producto_parent_id,
  producto_parent,
}: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const { className, ...props }: CardProps = {} as CardProps;

  return (
    <>
      <div className="mb-4">
        <Link href="/almacen/productos">
          <Button variant="outline" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Regresar al Catálogo de Productos
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className={cn("w-[100%]", className)} {...props}>
          <CardHeader>
            <CardTitle>Lista de Materiales</CardTitle>
            <CardDescription>
              Números de parte que incluyen el siguiente producto.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="grid grid-cols-3 gap-2">
              <div className=" flex items-center space-x-2 rounded-md border p-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Codigo</p>
                  <p className="text-sm text-muted-foreground">
                    {producto_parent?.codigo}
                  </p>
                </div>
              </div>
              <div className=" flex items-center space-x-2 rounded-md border p-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Descripción
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {producto_parent?.descripcion}
                  </p>
                </div>
              </div>
              <div className=" flex items-center space-x-2 rounded-md border p-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Codigo Proveedor
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {producto_parent?.codigo_proveedor}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className=" flex items-center space-x-2 rounded-md border p-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Unidad de Medida
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {producto_parent?.unidad_medida}
                  </p>
                </div>
              </div>
              <div className=" flex items-center space-x-2 rounded-md border p-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Peso</p>
                  <p className="text-sm text-muted-foreground">
                    {producto_parent?.peso}
                  </p>
                </div>
              </div>
              <div className=" flex items-center space-x-2 rounded-md border p-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Volumen</p>
                  <p className="text-sm text-muted-foreground">
                    {producto_parent?.volumen}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className=" flex items-center space-x-2 rounded-md border p-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Es Ensamble
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {producto_parent?.es_ensamble ? "Si" : "No"}
                  </p>
                </div>
              </div>
              <div className=" flex items-center space-x-2 rounded-md border p-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Estatus</p>
                  <p className="text-sm text-muted-foreground">
                    {producto_parent?.estatus ? <Badge variant="default">Activo</Badge> : <Badge variant="destructive">Inactivo</Badge>}
                  </p>
                </div>
              </div>
              <div className=" flex items-center space-x-2 rounded-md border p-2">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Fecha de Registro
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {producto_parent?.fecha_registro?.toDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <br></br>
      <div className="grid grid-cols-1 gap-4">
        <CRUD<MaterialProducto, MaterialProductoInfoExtra>
          title="Lista de Materiales"
          columns={columns}
          data={data}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={Number(paginationParams.page) || 1}
          pageSize={Number(paginationParams.pageSize) || 10}
          formComponent={MaterialProductoForm}
          // jsClassName="Empresa"
          actions={{
            create: createServer,
            update: updateServer,
            delete: deleteServer,
          }}
          infoExtra={{
            catalogoUnidadMedida,
            catalogoProductos,
            producto_parent_id,
            producto_parent,
          }}
        />
      </div>
    </>
  );
}
