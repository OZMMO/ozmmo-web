"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Building,
  Warehouse,
} from "lucide-react";
import {
  OrdenInstalacion,
  Ensamble,
  ProductoAEnsamblar,
  DetalleSurtido,
  Bodega,
  Lote,
  Empresa,
} from "@/lib/db";

export default function SurtirOrdenInstalacionPage() {
  const params = useParams();
  const router = useRouter();
  const [orden, setOrden] = useState<OrdenInstalacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [ensambles, setEnsambles] = useState<Ensamble[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [detallesSurtido, setDetallesSurtido] = useState<DetalleSurtido[]>([]);

  // Estados para las selecciones generales
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<number | null>(
    null
  );
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<number | null>(
    null
  );

  // Estado para controlar la carga de lotes
  const [cargandoLotes, setCargandoLotes] = useState(false);
  const [lotesCargados, setLotesCargados] = useState(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [exitoDialogOpen, setExitoDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // En un caso real, estas serían llamadas a API
        // Simulamos datos para el ejemplo
        await Promise.all([
          fetchOrden(Number(params.id)),
          // fetchEnsambles(),
          fetchEmpresas(),
          //fetchBodegas(),
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (orden?.surtidos) {
      console.log("orden?.surtidos", orden?.surtidos);
      // Inicializar el estado de detallesSurtido basado en los detalles de la orden
      setDetallesSurtido(orden?.surtidos);
    }
  }, [orden]);

  // Cuando cambia la empresa, resetear la bodega y los detalles surtidos
  useEffect(() => {
    const fetchData = async () => {
      if (empresaSeleccionada) {
        setBodegaSeleccionada(null);
        //setLotesCargados(false);
        //setLotes([]);
        await Promise.all([fetchBodegas()]);

        // Resetear todos los detalles surtidos
        setDetallesSurtido((prev) =>
          prev.map((item) => ({
            ...item,
            id_ensamble: undefined,
            id_lote: undefined,
            surtido: false,
            lotes_disponibles: [],
            ensambles_disponibles: [],
          }))
        );
      }
    };
    fetchData();
  }, [empresaSeleccionada]);

  // Cuando cambia la bodega, cargar los lotes correspondientes
  useEffect(() => {
    if (bodegaSeleccionada) {
      // Resetear todos los detalles surtidos
      setDetallesSurtido((prev) =>
        prev.map((item) => ({
          ...item,
          id_ensamble: undefined,
          id_lote: undefined,
          surtido: false,
          lotes_disponibles: [],
          ensambles_disponibles: [],
        }))
      );
      console.log("actualizarDetallesSurtido");
      actualizarDetallesSurtido();
      // Cargar los lotes de la bodega seleccionada
      //cargarLotesPorBodega(bodegaSeleccionada, orden?.id_producto);
    } else {
      setLotesCargados(false);
      setLotes([]);
    }
  }, [bodegaSeleccionada]);

  // Simulación de llamadas a API
  const fetchOrden = async (id: number) => {
    // Simular llamada a API
    const orden = await fetch(`/api/ventas/ordenes-instalacion?id=${id}`).then(
      (res) => res.json()
    );
    setOrden(orden.data[0]);
  };

  const fetchEmpresas = async () => {
    // Simular llamada a API
    const empresas = await fetch("/api/catalogos/empresas").then((res) =>
      res.json()
    );

    setEmpresas(empresas.data);
  };

  const fetchBodegas = async () => {
    // Simular llamada a API
    const bodegas = await fetch(
      `/api/almacen/bodegas?empresaId=${empresaSeleccionada}`
    ).then((res) => res.json());
    console.log(bodegas);
    setBodegas(bodegas);
  };

  const actualizarDetallesSurtido = async () => {
    try {
      // Obtener los datos de lotes y ensambles para cada item en paralelo
      console.log("actualizarDetallesSurtido", detallesSurtido);
      setCargandoLotes(true);
      setLotesCargados(false);
      const nuevosDetalles = await Promise.all(
        detallesSurtido.map(async (item) => {
          // Llamadas a la API con el producto específico de cada item
          const [lotes, ensambles] = await Promise.all([
            fetch(
              `/api/almacen/lotes?producto_id=${item.id_producto}&bodega_id=${bodegaSeleccionada}`
            ).then((res) => res.json()),
            fetch(
              `/api/almacen/ensambles-disponibles?producto_id=${item.id_producto}&bodega_id=${bodegaSeleccionada}`
            ).then((res) => res.json()),
          ]);
          console.log("lotes", lotes);
          console.log("ensambles", ensambles);
          // Retornar el objeto actualizado con los datos obtenidos
          return {
            ...item,
            id_ensamble: undefined,
            id_lote: undefined,
            surtido: false,
            lotes_disponibles: lotes.data, // Datos de la API
            ensambles_disponibles: ensambles.data, //ensambles, // Datos de la API
          };
        })
      );
      console.log("nuevosDetalles", nuevosDetalles);
      // Actualizar el estado con los nuevos detalles
      setDetallesSurtido(nuevosDetalles);
      setCargandoLotes(false);
      setLotesCargados(true);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setCargandoLotes(false);
      setLotesCargados(false);
    }
  };

  const cargarLotesPorBodega = async (
    producto_id: number,
    cantidad: number
  ) => {
    setCargandoLotes(true);
    setLotesCargados(false);

    try {
      // Simular llamada a API
      const lots = await fetch(
        `/api/almacen/lotes?producto_id=${producto_id}&bodega_id=${bodegaSeleccionada}`
      ).then((res) => res.json());
      //return lots;

      // Filtrar lotes por bodega seleccionada
      /* const lotesFiltrados = lots.filter(
        (lote: Lote) => lote?.cantidad_disponible >= cantidad
      );

      setLotes(lotesFiltrados);
      setLotesCargados(true);*/
    } catch (error) {
      console.error("Error al cargar lotes:", error);
    } finally {
      setCargandoLotes(false);
    }
  };

  const fetchEnsambles = async () => {
    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 600));

    const ensamblesMock: Ensamble[] = [];

    setEnsambles(ensamblesMock);
  };

  const handleEnsambleChange = (detalleId: number, ensambleId: number) => {
    setDetallesSurtido((prev) =>
      prev.map((item) =>
        item.id === detalleId
          ? {
              ...item,
              id_ensamble: ensambleId,
              surtido: true,
            }
          : item
      )
    );
  };

  const handleLoteChange = (detalleId: number, loteId: number) => {
    setDetallesSurtido((prev) =>
      prev.map((item) =>
        item.id === detalleId
          ? {
              ...item,
              id_lote: loteId,
              surtido: true,
            }
          : item
      )
    );
  };

  const handleEmpresaChange = (empresaId: number) => {
    setEmpresaSeleccionada(empresaId);
  };

  const handleBodegaChange = (bodegaId: number) => {
    setBodegaSeleccionada(bodegaId);
  };

  const handleSubmit = async () => {
    setProcesando(true);

    try {
      // Simular envío a API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Cerrar diálogo de confirmación y mostrar éxito
      setConfirmDialogOpen(false);
      setExitoDialogOpen(true);
    } catch (error) {
      console.error("Error al procesar:", error);
    } finally {
      setProcesando(false);
    }
  };

  const handleConfirm = () => {
    setConfirmDialogOpen(true);
  };

  const handleFinish = () => {
    setExitoDialogOpen(false);
    router.push("/ordenes-instalacion");
  };

  const todosSurtidos = detallesSurtido.every((detalle) => detalle.surtido);

  // Filtrar lotes por cantidad requerida
  const getLotesPorCantidad = (cantidadRequerida: number) => {
    return lotes.filter(
      (lote) => lote.cantidad_disponible >= cantidadRequerida
    );
  };

  // Filtrar ensambles por empresa y bodega
  const getEnsamblesDisponibles = () => {
    /* if (!empresaSeleccionada || !bodegaSeleccionada) return [];

    return ensambles.filter(
      (ensamble) =>
        ensamble.id_empresa === empresaSeleccionada &&
        ensamble.id_bodega === bodegaSeleccionada &&
        ensamble.disponible > 0
    );*/
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg">Cargando orden de instalación...</p>
      </div>
    );
  }

  if (!orden) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-4 text-lg">No se encontró la orden de instalación</p>
        <Button
          className="mt-4"
          onClick={() => router.push("/ordenes-instalacion")}
        >
          Volver a órdenes
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Surtir Orden de Instalación</h1>
        <Badge
          variant={
            orden.estatus_ordenes_instalacion === "Pendiente de surtir"
              ? "outline"
              : "default"
          }
          className="text-base py-1 px-3"
        >
          {orden.estatus_ordenes_instalacion}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Orden: {orden.codigo}</span>
            <span>Pedido: {orden.pedido_codigo}</span>
          </CardTitle>
          <CardDescription>
            Cliente: {orden.cliente_razon_social}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Información de Instalación</h3>
              <p>
                <span className="font-medium">Fecha y hora:</span>{" "}
                {orden.FechaHoraInstalacion || "No definida"}
              </p>
              <p>
                <span className="font-medium">Instalador:</span>{" "}
                {orden.instalador_nombre_completo || "No asignado"}
              </p>
              <p>
                <span className="font-medium">Notas:</span>{" "}
                {orden.Notas || "Sin notas"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Dirección de Instalación</h3>
              {orden.direccion ? (
                <>
                  <p>
                    {orden.direccion.calle} {orden.direccion.numero_exterior}
                    {orden.direccion.numero_interior
                      ? `, Int. ${orden.direccion.numero_interior}`
                      : ""}
                  </p>
                  <p>Col. {orden.direccion.colonia}</p>
                  <p>
                    {orden.direccion.municipio}, {orden.direccion.estado}
                  </p>
                  <p>C.P. {orden.direccion.codigo_postal}</p>
                </>
              ) : (
                <p>No hay dirección registrada</p>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Selección de Empresa y Bodega (General para toda la orden) */}
          <div className="bg-muted/30 p-4 rounded-lg border">
            <h3 className="font-medium text-lg mb-4">Ubicación de Surtido</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <label htmlFor="empresa" className="font-medium">
                    Empresa
                  </label>
                </div>
                <Select
                  onValueChange={(value) => handleEmpresaChange(Number(value))}
                  value={empresaSeleccionada?.toString()}
                >
                  <SelectTrigger id="empresa" className="w-full">
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem
                        key={empresa.id}
                        value={empresa.id.toString()}
                      >
                        ({empresa.codigo}) - {empresa.rfc} -{" "}
                        {empresa.razon_social}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {empresaSeleccionada && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-5 w-5 text-muted-foreground" />
                    <label htmlFor="bodega" className="font-medium">
                      Bodega de{" "}
                      {
                        empresas.find((e) => e.id === empresaSeleccionada)
                          ?.razon_social
                      }
                    </label>
                  </div>
                  <Select
                    onValueChange={(value) => handleBodegaChange(Number(value))}
                    value={bodegaSeleccionada?.toString()}
                  >
                    <SelectTrigger id="bodega" className="w-full">
                      <SelectValue placeholder="Seleccionar bodega" />
                    </SelectTrigger>
                    <SelectContent>
                      {bodegas?.length > 0 ? (
                        bodegas?.map((bodega) => (
                          <SelectItem
                            key={bodega.id}
                            value={bodega.id.toString()}
                          >
                            ({bodega.codigo}) - {bodega.descripcion}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-disponible" disabled>
                          No hay bodegas disponibles para esta empresa
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!empresaSeleccionada && (
                <p className="text-sm text-amber-600 mt-2">
                  Selecciona una empresa para ver las bodegas disponibles
                </p>
              )}

              {empresaSeleccionada && !bodegaSeleccionada && (
                <p className="text-sm text-amber-600 mt-2">
                  Selecciona una bodega para cargar los lotes disponibles
                </p>
              )}

              {bodegaSeleccionada && cargandoLotes && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando lotes disponibles en la bodega...
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Productos a Surtir</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Asignación</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detallesSurtido?.map((detalle) => {
                  console.log("detalle", detalle);

                  /* const ensamblesDisponibles = getEnsamblesDisponibles();
                  const lotesDisponibles = cargarLotesPorBodega(
                    detalle.id_producto || 0,
                    detalle.cantidad || 0
                  );*/

                  return (
                    <TableRow key={detalle.id}>
                      <TableCell className="font-medium">
                        {detalle.producto}
                      </TableCell>
                      <TableCell>{detalle.cantidad}</TableCell>
                      <TableCell>
                        {detalle.es_ensamble
                          ? "Ensamble"
                          : "Producto individual"}
                      </TableCell>
                      <TableCell>
                        {!empresaSeleccionada || !bodegaSeleccionada ? (
                          <p className="text-sm text-muted-foreground italic">
                            Selecciona empresa y bodega primero
                          </p>
                        ) : cargandoLotes ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Cargando lotes...
                          </div>
                        ) : !lotesCargados ? (
                          <p className="text-sm text-muted-foreground italic">
                            Esperando carga de lotes...
                          </p>
                        ) : detalle.es_ensamble ? (
                          <Select
                            onValueChange={(value) =>
                              handleEnsambleChange(
                                detalle.id || 0,
                                Number(value)
                              )
                            }
                            value={detalle?.id_ensamble?.toString()}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar ensamble" />
                            </SelectTrigger>
                            <SelectContent>
                              {detalle.ensambles_disponibles.length > 0 ? (
                                detalle.ensambles_disponibles.map(
                                  (ensamble) => (
                                    <SelectItem
                                      key={ensamble.id}
                                      value={ensamble.id.toString()}
                                    >
                                      {ensamble.numero_serie} - Lote:{" "}
                                      {ensamble.lote} (Disp:{" "}
                                      {ensamble.cantidad_disponible})
                                    </SelectItem>
                                  )
                                )
                              ) : (
                                <SelectItem value="no-disponible" disabled>
                                  No hay ensambles disponibles
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Select
                            onValueChange={(value) =>
                              handleLoteChange(detalle.id || 0, Number(value))
                            }
                            value={detalle?.id_lote?.toString()}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Seleccionar lote" />
                            </SelectTrigger>
                            <SelectContent>
                              {detalle.lotes_disponibles?.length > 0 ? (
                                detalle.lotes_disponibles?.map((lote) => (
                                  <SelectItem
                                    key={lote.id}
                                    value={lote.id.toString()}
                                  >
                                    {lote.codigo_lote} (Disp:{" "}
                                    {lote.cantidad_disponible})
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-disponible" disabled>
                                  No hay lotes con disponibilidad suficiente
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell>
                        {detalle?.surtido ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            <CheckCircle className="h-4 w-4 mr-1" /> Surtido
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-800 hover:bg-amber-100"
                          >
                            Pendiente
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              className="mr-2"
              onClick={() => router.push("/ventas/ordenes-instalacion")}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={
                !empresaSeleccionada ||
                !bodegaSeleccionada ||
                !lotesCargados ||
                !todosSurtidos
              }
            >
              Confirmar Surtido
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de confirmación */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar surtido de orden</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas confirmar el surtido de la orden{" "}
              {orden.codigo}? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={procesando}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={procesando}>
              {procesando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de éxito */}
      <AlertDialog open={exitoDialogOpen} onOpenChange={setExitoDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Orden surtida correctamente</AlertDialogTitle>
            <AlertDialogDescription>
              La orden de instalación {orden.codigo} ha sido surtida
              correctamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleFinish}>
              Volver a órdenes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
