"use client";
import { Action, CRUD, Column } from "@/components/crud";
import { useEffect, useState } from "react";
import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import { createServer, deleteServer, updateServer } from "./actions";
import { DetalleRecepcionForm } from "./detalle_recepcion-form";
import {
  DetalleRecepcion,
  Lote,
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
import { Badge, BellRing, Loader2, PackageCheck, PackageOpen, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import LoteForm from "./lotes/lote-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { EstadoLote } from "@/lib/db/almacen/estados-lote/estado-lote";
import { EstadoLoteModel } from "@/lib/db/almacen/estados-lote/estado-lote.model";
import { TipoMovimiento } from "@/lib/db/almacen/tipos-movimientos/tipo-movimiento";
import { Table, TableCell } from "@/components/ui/table";
import { TableBody } from "@/components/ui/table";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge as CustomBadge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic'

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
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loadingLotes, setLoadingLotes] = useState(false);

  const [isOpenVerLoteForm, setIsOpenVerLoteForm] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const fetchEstadosLote = async () => {
      const response = await fetch('/api/almacen/estados-lotes');
      const data = await response.json();
      setEstadosLote(data);
    };

    const fetchUbicaciones = async () => {
      const response = await fetch(`/api/almacen/ubicaciones?bodega_id=${recepcion?.bodega_id}`);
      const dataJson = await response.json();
      const data = dataJson.data;
      setUbicaciones(data);
    };

    const fetchTiposMovimientos = async () => {
      const response = await fetch(`/api/almacen/tipos-movimientos?SoloActivos=true&Categorias=Entrada`);
      const data = await response.json();
      setTiposMovimientos(data);
    };

    fetchEstadosLote();
    fetchUbicaciones();
    fetchTiposMovimientos();
  }, []);

  if (!isClient) {
    return null;
  }

  const columns: Column<DetalleRecepcion>[] = [
    // { key: 'id', label: 'ID', sortable: true },
    { key: "id", label: "Ver Lotes", render: (value) => {
      return (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={async () => {
            const item = data.find(d => d.id === value); // Assuming 'data' is accessible and contains the items
            if (item) {
              setDetalleRecepcion(item);
              setIsOpenVerLoteForm(true);
              try { 
                setLoadingLotes(true);
                await fetchLotes(item.producto_id);
                setLoadingLotes(false);
              } catch (error) {
                setLoadingLotes(false);
                console.error('Error fetching lotes:', error);
              }
            }
          }}
        >
          <PackageOpen className="h-4 w-4" />
          Ver Lotes
        </Button>
      );
    }},
    { key: "producto", label: "Producto", sortable: true },
    { key: "unidad_medida", label: "Unidad de Medida", sortable: true },
    { key: "cantidad", label: "Cantidad", sortable: true },
    { key: "cantidad_recibida", label: "Cantidad Recibida", sortable: true },
    { key: "cantidad_restante", label: "Cantidad Restante", sortable: true, render: (value) => {
      return (
        <span className={`${Number(value) < 0 ? "text-red-500" : ""}`}>
          {Number(value).toLocaleString('es-MX')}
        </span>
      );
    }},
    { key: "cantidad_restante", label: "Estatus", sortable: true, render: (value) => {
      return (
        <span className={`${
          Number(value) < 0 
            ? "text-red-500" 
            : Number(value) === 0 
              ? "text-green-500"
              : "text-yellow-500"
        }`}>
          {Number(value) < 0 
            ? "Excedido"
            : Number(value) === 0
              ? "Completo" 
              : "Pendiente"}
        </span>
      );
    }},
  ];

  const fetchLotes = async (producto_id: number) => {
    const response = await fetch(`/api/almacen/lotes?recepcion_id=${recepcion_id.toString()}&producto_id=${producto_id.toString()}`);
    const data = await response.json();
    setLotes(data.data);
  };

  const extraActions: Action<DetalleRecepcion>[] = [
    {
      icon: <PackageCheck className="h-4 w-4" />,
      onClick: (item: DetalleRecepcion) => {
        setDetalleRecepcion(item);
        setIsOpenLoteForm(true);
      },
      title: "Recibir",
      variant: "default", 
      size: "default",
    },
  ];

  const { className, ...props }: CardProps = {} as CardProps;

  const handleCloseLoteForm = () => {
    setIsOpenLoteForm(false);
    setDetalleRecepcion(null);
  }

  return (
    <>
      <Sheet open={isOpenLoteForm} onOpenChange={setIsOpenLoteForm}>
        <SheetContent className="w-full xs:w-full sm:w-full md:w-[90%] lg:w-[80%] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Nuevo Lote</SheetTitle>
          </SheetHeader>
          {detalleRecepcion && <LoteForm setClose={handleCloseLoteForm} detalleRecepcion={detalleRecepcion} estadosLote={estadosLote} bodega={{ id: recepcion?.bodega_id || 0, nombre: recepcion?.bodega || 'SIN BODEGA SELECCIONADA' }} ubicaciones={ubicaciones} tiposMovimientos={tiposMovimientos} />}
        </SheetContent>
      </Sheet>

      <Sheet open={isOpenVerLoteForm} onOpenChange={setIsOpenVerLoteForm}>
        <SheetContent className="w-full xs:w-full sm:w-full md:w-[90%] lg:w-[80%] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Lotes</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {loadingLotes ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Fabricación</TableHead>
                    <TableHead>Expiración</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Disponible</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Ubicación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lotes.map((lote) => (
                    <TableRow key={lote.id}>
                      <TableCell className="font-medium">{lote.codigo_lote}</TableCell>
                      <TableCell>{lote.producto}</TableCell>
                      <TableCell>{lote.fecha_fabricacion ? new Date(lote.fecha_fabricacion).toLocaleDateString() : ''}</TableCell>
                      <TableCell>{lote.fecha_expiracion ? new Date(lote.fecha_expiracion).toLocaleDateString() : ''}</TableCell>
                      <TableCell>{lote.cantidad_inicial}</TableCell>
                      <TableCell>{lote.cantidad_disponible}</TableCell>
                      <TableCell>
                        <CustomBadge variant={lote.estatus ? "default" : "secondary"}>
                          {lote.estado_lote}
                        </CustomBadge>
                      </TableCell>
                      <TableCell>{lote.ubicacion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>
            )}
          </div>
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
          title="Detalles de la Recepcion"
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
