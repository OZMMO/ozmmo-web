"use client";
import { Action, CRUD, Column } from "@/components/crud";
import { useEffect, useState } from "react";
import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { createServer, deleteServer, updateServer } from "./actions";
import { DetalleRecepcionForm } from "./detalle_recepcion-form";
import {
  DetalleRecepcion,
  Productos,
  Recepcion,
  Ubicacion,
  UnidadesMedida,
} from "@/lib/db";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BellRing, PackageCheck, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import LoteForm from "./lotes/lote-form";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { EstadoLote } from "@/lib/db/almacen/estados-lote/estado-lote";
import { EstadoLoteModel } from "@/lib/db/almacen/estados-lote/estado-lote.model";
import { TipoMovimiento } from "@/lib/db/almacen/tipos-movimientos/tipo-movimiento";

const columns: Column<DetalleRecepcion>[] = [
  // { key: 'id', label: 'ID', sortable: true },
  { key: "producto", label: "Producto", sortable: true },
  { key: "unidad_medida", label: "Unidad de Medida", sortable: true },
  { key: "cantidad", label: "Cantidad", sortable: true },
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
  catalogoUnidadMedida: UnidadesMedida[];
  catalogoProductos: Productos[];
  recepcion_id: number;
  recepcion: Recepcion | null;
}

export interface DetalleRecepcionInfoExtra {
  catalogoUnidadMedida: UnidadesMedida[];
  catalogoProductos: Productos[];
  recepcion_id: number;
  recepcion: Recepcion | null;
}

type CardProps = React.ComponentProps<typeof Card>;

export default function DetalleRecepcionClientPage({
  payload,
  paginationParams,
  catalogoUnidadMedida,
  catalogoProductos,
  recepcion_id,
  recepcion,
}: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false);
  const [isOpenLoteForm, setIsOpenLoteForm] = useState(false);
  const [detalleRecepcion, setDetalleRecepcion] = useState<DetalleRecepcion | null>(null);
  const [estadosLote, setEstadosLote] = useState<EstadoLote[]>([]);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [tiposMovimientos, setTiposMovimientos] = useState<TipoMovimiento[]>([]);

  useEffect(() => {
    setIsClient(true);

    const fetchEstadosLote = async () => {
      const response = await fetch('/api/almancen/estados-lotes');
      const data = await response.json();
      setEstadosLote(data);
    };

    const fetchUbicaciones = async () => {
      const response = await fetch(`/api/almancen/ubicaciones?bodega_id=${recepcion?.bodega_id}`);
      const dataJson = await response.json();
      const data = dataJson.data;
      console.log('ubicaciones', data);
      setUbicaciones(data);
    };

    const fetchTiposMovimientos = async () => {
      const response = await fetch(`/api/almancen/tipos-movimientos?SoloActivos=true&Categorias=Entrada`);
      const data = await response.json();
      console.log('tiposMovimientos', data);
      setTiposMovimientos(data);
    };

    fetchEstadosLote();
    fetchUbicaciones();
    fetchTiposMovimientos();
  }, []);

  if (!isClient) {
    return null;
  }

  const extraActions: Action<DetalleRecepcion>[] = [
    {
      icon: <PackageCheck className="h-4 w-4" />,
      onClick: (item: DetalleRecepcion) => {
        console.log(item);
        setDetalleRecepcion(item);
        setIsOpenLoteForm(true);
      },
      title: "Recibir",
      variant: "default", 
      size: "default",
    },
  ];
  const { className, ...props }: CardProps = {} as CardProps;

  return (
    <>
      <Sheet open={isOpenLoteForm} onOpenChange={setIsOpenLoteForm} >
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          {detalleRecepcion && <LoteForm detalleRecepcion={detalleRecepcion} estadosLote={estadosLote} bodega={{ id: recepcion?.bodega_id || 0, nombre: recepcion?.bodega || 'SIN BODEGA SELECCIONADA' }} ubicaciones={ubicaciones} tiposMovimientos={tiposMovimientos} />}
        </SheetContent>
      </Sheet>
      <div className="mb-4">
        <Link href="/almacen/recepcion">
          <Button variant="outline" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Regresar al módulo de Recepciones
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className={cn("w-[100%]", className)} {...props}>
          <CardHeader>
            <CardTitle>Detalles de la Recepcion</CardTitle>
            <CardDescription>Detalles de la Recepcion.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div className=" flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Fecha de Recepción</p>
                  <p className="text-sm text-muted-foreground">
                    {recepcion?.fecha_recepcion?.toDateString()}
                  </p>
                </div>
              </div>
              <div className=" flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Proveedor</p>
                  <p className="text-sm text-muted-foreground">
                    {recepcion?.proveedor}
                  </p>
                </div>
              </div>
              <div className=" flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Bodega</p>
                  <p className="text-sm text-muted-foreground">
                    {recepcion?.bodega}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className=" flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Completado</p>
                  <p className="text-sm text-muted-foreground">
                    {recepcion?.completado ? "Si" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <br></br>
      <div className="grid grid-cols-1 gap-4">
        <CRUD<DetalleRecepcion, DetalleRecepcionInfoExtra>
          columns={columns}
          data={data}
          totalCount={totalCount}
          totalPages={totalPages}
          currentPage={Number(paginationParams.page) || 1}
          pageSize={Number(paginationParams.pageSize) || 10}
          formComponent={DetalleRecepcionForm}
          // jsClassName="Empresa"
          actions={{
            create: createServer,
            update: updateServer,
            delete: deleteServer,
          }}
          infoExtra={{
            catalogoUnidadMedida,
            catalogoProductos,
            recepcion_id,
            recepcion,
          }}
          extraActions={extraActions}
        />
      </div>
    </>
  );
}
