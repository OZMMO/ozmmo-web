"use client";

import { Action, CRUD, Column } from "@/components/crud";
import { useEffect, useMemo, useState } from "react";
import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import { IResponseModel } from "@/lib/interfaces/response-model.interface";
import {
  createOrdenInstalacion,
  updateOrdenInstalacion,
  deleteOrdenInstalacion,
  actualizarEstatusOrden,
} from "./actions";
import { OrdenInstalacionForm } from "./orden-instalacion-form";
import {
  OrdenInstalacion,
  Cliente,
  Pedido,
  Productos,
  User,
  EstatusOrdenInstalacion,
} from "@/lib/db";
import { Check, FileText, MapPin, Printer, Search, User as UserIcon, X, CalendarIcon, Package, Plus, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { TabsContent } from "@/components/ui/tabs";
import { Tabs } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const columns: Column<OrdenInstalacion>[] = [
  { key: "cliente_razon_social", label: "Cliente", sortable: true },
  { key: "codigo", label: "codigo", sortable: true },
  { key: "pedido_codigo", label: "Pedido Cliente", sortable: true },
  { key: "FechaHoraInstalacion", label: "Fecha Instalación", sortable: true },
  {
    key: "instalador_nombre_completo",
    label: "Instalador",
    sortable: true,
  },
  {
    key: "estatus_ordenes_instalacion",
    label: "Estatus",
    sortable: true,
  },
];

interface PageProps {
  payload: IResponseModel<any[]>;
  paginationParams: IPageSearchPaginationParams;
  clientes: Cliente[];
  pedidosClientes: Pedido[];
  productos: Productos[];
  instaladores: User[];
  estatusOrdenInstalacion: EstatusOrdenInstalacion[];
}

export default function OrdenesInstalacionClientPage({
  payload,
  paginationParams,
  clientes,
  pedidosClientes,
  productos,
  instaladores,
  estatusOrdenInstalacion,
}: PageProps) {
  const { data, totalCount, totalPages } = payload;
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Estado para las órdenes organizadas por estatus
  const [columnas, setColumnas] = useState<{ [key: string]: OrdenInstalacion[] }>({})
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenInstalacion | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [ordenesOriginal, setOrdenesOriginal] = useState<OrdenInstalacion[]>([])

  // Estados para filtros adicionales
  const [filtroInstalador, setFiltroInstalador] = useState<string | null>(null)
  const [filtroCliente, setFiltroCliente] = useState<number | null>(null)
  const [filtroFechaDesde, setFiltroFechaDesde] = useState<Date | null>(null)
  const [filtroFechaHasta, setFiltroFechaHasta] = useState<Date | null>(null)
  const [filtroProducto, setFiltroProducto] = useState<number | null>(null)

  // Agregar estados para las búsquedas dentro de cada filtro
  const [busquedaInstalador, setBusquedaInstalador] = useState("")
  const [busquedaCliente, setBusquedaCliente] = useState("")
  const [busquedaProducto, setBusquedaProducto] = useState("")

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // if (!isClient) {
  //   return null;
  // }
  // Inicializar datos
  
  // Inicializar datos
  useEffect(() => {
    // Asignar un estatus por defecto a las órdenes que no tienen
    const ordenesConEstatus = data.map((orden) => {
      if (!orden.id_estatus_ordenes_instalacion) {
        return {
          ...orden,
          id_estatus_ordenes_instalacion: 1, // NUEVA
          estatus_ordenes_instalacion: "N - NUEVA",
        }
      }
      return orden
    })

    // Organizar órdenes por estatus
    const columnasIniciales: { [key: string]: OrdenInstalacion[] } = {}

    estatusOrdenInstalacion.forEach((estatus) => {
      columnasIniciales[estatus.id] = ordenesConEstatus.filter(
        (orden) => orden.id_estatus_ordenes_instalacion === estatus.id,
      )
    })

    // Primero establecer las columnas para que se muestren inmediatamente
    setColumnas(columnasIniciales)
    // Luego establecer las órdenes originales
    setOrdenesOriginal(ordenesConEstatus)
    // Indicar que la carga ha terminado
    // setCargando(false)

    console.log("Inicialización completada:", {
      ordenesConEstatus: ordenesConEstatus.length,
      columnasIniciales: Object.keys(columnasIniciales).map((key) => `${key}: ${columnasIniciales[key].length}`),
    })
  }, [])

  // Extraer listas únicas para filtros
  const instaladoresUnicos = useMemo(() => {
    const instaladores = ordenesOriginal.map((orden) => ({
      id: orden.instalador_id,
      nombre: orden.instalador_nombre_completo,
    }))
    return Array.from(new Map(instaladores.map((item) => [item.id, item])).values())
  }, [ordenesOriginal])

  const clientesUnicos = useMemo(() => {
    const clientes = ordenesOriginal.map((orden) => ({
      id: orden.id_cliente,
      nombre: orden.cliente_razon_social,
    }))
    return Array.from(new Map(clientes.map((item) => [item.id, item])).values())
  }, [ordenesOriginal])

  const productosUnicos = useMemo(() => {
    const productos: { id: number; nombre: string }[] = []
    ordenesOriginal.forEach((orden) => {
      orden.detalles?.forEach((detalle) => {
        productos.push({
          id: detalle.id_producto || 0,
          nombre: detalle.producto || "SIN PRODUCTO",
        })
      })
    })
    return Array.from(new Map(productos.map((item) => [item.id, item])).values())
  }, [ordenesOriginal])

  // Función para manejar el arrastre y soltar
  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result

    // Si no hay destino o el destino es el mismo que el origen, no hacer nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Obtener la orden que se está moviendo
    const ordenId = Number.parseInt(draggableId)
    const orden = ordenesOriginal.find((o) => o.id === ordenId)

    if (!orden) return

    // Crear copias de las columnas de origen y destino
    const columnaOrigen = [...columnas[source.droppableId]]
    const columnaDestino = [...columnas[destination.droppableId]]

    // Remover la orden de la columna de origen
    columnaOrigen.splice(source.index, 1)

    // Actualizar el estatus de la orden
    const nuevoEstatusId = Number.parseInt(destination.droppableId)
    const ordenActualizada = {
      ...orden,
      id_estatus_ordenes_instalacion: nuevoEstatusId,
      estatus_ordenes_instalacion: `${estatusOrdenInstalacion.find((e) => e.id === nuevoEstatusId)?.codigo} - ${estatusOrdenInstalacion.find((e) => e.id === nuevoEstatusId)?.descripcion}`,
    }

    // Añadir la orden a la columna de destino
    columnaDestino.splice(destination.index, 0, ordenActualizada)

    // Actualizar el estado local inmediatamente para una UI responsiva
    setColumnas({
      ...columnas,
      [source.droppableId]: columnaOrigen,
      [destination.droppableId]: columnaDestino,
    })

    // Actualizar la lista original de órdenes
    setOrdenesOriginal(ordenesOriginal.map((o) => (o.id === ordenId ? ordenActualizada : o)))

    // Llamar a la server action para actualizar en la base de datos
    try {
      // Mostrar un toast de carga
      // const loadingToast = toast({
      //   title: "Actualizando...",
      //   description: `Cambiando orden ${ordenId} al estatus ${estatusOrdenInstalacion.find((e) => e.id === nuevoEstatusId)?.descripcion}`,
      //   variant: "default",
      // })
      toast.loading(`Cambiando orden ${ordenId} al estatus ${estatusOrdenInstalacion.find((e) => e.id === nuevoEstatusId)?.descripcion}`)

      // Llamar a la server action
      const resultado = await actualizarEstatusOrden(ordenId, nuevoEstatusId)

      if (resultado.success) {
        // toast({
        //   title: "Actualización exitosa",
        //   description: resultado.message,
        //   variant: "default",
        // })
        toast.success(resultado.message)
      } else {
        // toast({
        //   title: "Error al actualizar",
        //   description: resultado.message,
        //   variant: "destructive",
        // })
        toast.error(resultado.message)
        // Aquí podrías revertir el cambio en la UI si lo deseas
      }
    } catch (error) {
      toast.error("Ocurrió un error al actualizar el estatus de la orden")
      // Aquí podrías revertir el cambio en la UI si lo deseas
    }
  }

  // Función para formatear la fecha
  const formatearFecha = (fechaInput: string | Date | undefined | null) => {
    try {
      if (!fechaInput) return "Fecha no disponible"
      
      const fecha = fechaInput instanceof Date ? fechaInput : new Date(fechaInput)
      return format(fecha, "dd/MM/yyyy HH:mm", { locale: es })
    } catch (error) {
      return "Fecha no disponible"
    }
  }

  // Función para obtener el color del badge según el estatus
  const getColorBadge = (estatusId: number | null) => {
    switch (estatusId) {
      case 1:
        return "bg-gray-200 text-gray-800" // NUEVA
      case 2:
        return "bg-blue-100 text-blue-800" // CALENDARIZADA
      case 3:
        return "bg-orange-100 text-orange-800" // SURTIDO PARCIALMENTE
      case 4:
        return "bg-green-100 text-green-800" // SURTIDO COMPLETO
      case 5:
        return "bg-purple-100 text-purple-800" // PENDIENTE INSTALAR
      case 6:
        return "bg-indigo-100 text-indigo-800" // INSTALADA
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getStatusColor = (estatusId: number | null) => {
    switch (estatusId) {
      case 1:
        return "#9ca3af" // NUEVA - gray
      case 2:
        return "#60a5fa" // CALENDARIZADA - blue
      case 3:
        return "#f97316" // SURTIDO PARCIALMENTE - orange
      case 4:
        return "#34d399" // SURTIDO COMPLETO - green
      case 5:
        return "#a78bfa" // PENDIENTE INSTALAR - purple
      case 6:
        return "#818cf8" // INSTALADA - indigo
      default:
        return "#9ca3af" // gray
    }
  }

  const getStatusGradient = (estatusId: number | null) => {
    switch (estatusId) {
      case 1:
        return "linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)" // NUEVA - silver gradient
      case 2:
        return "linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)" // CALENDARIZADA - blue gradient
      case 3:
        return "linear-gradient(135deg, #fdba74 0%, #ea580c 100%)" // SURTIDO PARCIALMENTE - orange gradient
      case 4:
        return "linear-gradient(135deg, #6ee7b7 0%, #10b981 100%)" // SURTIDO COMPLETO - emerald gradient
      case 5:
        return "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)" // PENDIENTE INSTALAR - purple gradient
      case 6:
        return "linear-gradient(135deg, #a5b4fc 0%, #4f46e5 100%)" // INSTALADA - indigo gradient
      default:
        return "linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)" // default silver gradient
    }
  }

  // Función para filtrar órdenes
  const filtrarOrdenes = () => {
    // Filtrar las órdenes según todos los criterios
    let ordenesFiltradas = [...ordenesOriginal]

    // Filtro por texto de búsqueda
    if (busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase()
      ordenesFiltradas = ordenesFiltradas.filter(
        (orden) =>
          (orden.codigo && orden.codigo.toLowerCase().includes(busquedaLower)) ||
          (orden.pedido_codigo && orden.pedido_codigo.toLowerCase().includes(busquedaLower)) ||
          (orden.cliente_razon_social && orden.cliente_razon_social.toLowerCase().includes(busquedaLower)) ||
          (orden.instalador_nombre_completo &&
            orden.instalador_nombre_completo.toLowerCase().includes(busquedaLower)) ||
          orden.detalles?.some((detalle) => detalle.producto && detalle.producto.toLowerCase().includes(busquedaLower)),
      )
    }

    // Filtro por instalador
    if (filtroInstalador) {
      if (filtroInstalador === "sin_instalador") {
        ordenesFiltradas = ordenesFiltradas.filter((orden) => !orden.instalador_id || orden.instalador_id === "")
      } else {
        ordenesFiltradas = ordenesFiltradas.filter((orden) => orden.instalador_id === filtroInstalador)
      }
    }

    // Filtro por cliente
    if (filtroCliente) {
      ordenesFiltradas = ordenesFiltradas.filter((orden) => orden.id_cliente === filtroCliente)
    }

    // Filtro por fecha desde
    if (filtroFechaDesde) {
      ordenesFiltradas = ordenesFiltradas.filter((orden) => new Date(orden.FechaHoraInstalacion || "") >= filtroFechaDesde)
    }

    // Filtro por fecha hasta
    if (filtroFechaHasta) {
      const fechaHastaFin = new Date(filtroFechaHasta)
      fechaHastaFin.setHours(23, 59, 59, 999)
      ordenesFiltradas = ordenesFiltradas.filter((orden) => new Date(orden.FechaHoraInstalacion || "") <= fechaHastaFin)
    }

    // Filtro por producto
    if (filtroProducto) {
      ordenesFiltradas = ordenesFiltradas.filter((orden) =>
        orden.detalles?.some((detalle) => detalle.id_producto === filtroProducto),
      )
    }

    // Reorganizar las columnas con las órdenes filtradas
    const columnasFiltradas: { [key: string]: OrdenInstalacion[] } = {}

    estatusOrdenInstalacion.forEach((estatus) => {
      columnasFiltradas[estatus.id] = ordenesFiltradas.filter(
        (orden) => orden.id_estatus_ordenes_instalacion === estatus.id,
      )
    })

    setColumnas(columnasFiltradas)
  }

  // Efecto para filtrar cuando cambia la búsqueda o los filtros
  useEffect(() => {
    // Solo filtrar si ya tenemos órdenes cargadas
    if (ordenesOriginal.length > 0) {
      filtrarOrdenes()
    }
  }, [busqueda, filtroInstalador, filtroCliente, filtroFechaDesde, filtroFechaHasta, filtroProducto, ordenesOriginal])

  // Función para limpiar todos los filtros
  const limpiarFiltrosFunc = () => {
    setBusqueda("")
    setFiltroInstalador(null)
    setFiltroCliente(null)
    setFiltroFechaDesde(null)
    setFiltroFechaHasta(null)
    setFiltroProducto(null)
    setBusquedaInstalador("")
    setBusquedaCliente("")
    setBusquedaProducto("")
  }

  // Función para verificar si hay filtros activos
  const hayFiltrosActivosFunc = () => {
    return (
      busqueda.trim() !== "" ||
      filtroInstalador !== null ||
      filtroCliente !== null ||
      filtroFechaDesde !== null ||
      filtroFechaHasta !== null ||
      filtroProducto !== null
    )
  }

  // Función para abrir el sidebar con la orden seleccionada
  const abrirDetallesFunc = (orden: OrdenInstalacion) => {
    setOrdenSeleccionada(orden)
    setSidebarOpen(true)
  }

  // Función para verificar si hay filtros activos
  const hayFiltrosActivos = hayFiltrosActivosFunc

  // Función para limpiar todos los filtros
  const limpiarFiltros = limpiarFiltrosFunc

  // Función para abrir el sidebar con la orden seleccionada
  const abrirDetalles = abrirDetallesFunc

  const extraActions: Action<OrdenInstalacion>[] = [
    {
      title: "Surtir",
      icon: <MapPin />,
      onClick: (row: OrdenInstalacion) => {
        router.push(`/ventas/ordenes-instalacion/surtir/${row.id}/`);
      },
      variant: "default",
      size: "icon",
    },
    {
      title: "Imprimir",
      icon: <Printer />,
      onClick: (row: OrdenInstalacion) => {
        router.push(`/ventas/ordenes-instalacion/imprimir/${row.id}/`);
      },
      variant: "default",
      size: "icon",
    },
  ];

  return (
    // <div className="flex flex-col h-screen bg-gray-100">
    <div className="container-full mx-auto p-2 flex flex-col h-screen">
      {/* Cabecera */}
      <header className="bg-white shadow-sm p-2 border-b sticky top-0 z-10">
        <div className="container-full">
          <div className="flex flex-col md:flex-row md:items-center justify-start gap-2">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 p-1.5 rounded-md">
                <FileText className="h-5 w-5" />
              </span>
              Órdenes de Instalación
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Buscar órdenes..."
                    className="pl-8 w-full h-7 text-xs"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={
                        filtroInstalador
                          ? "bg-blue-50 text-blue-600 border-blue-200 text-xs font-medium shadow-sm hover:shadow-md transition-all"
                          : "text-xs font-medium shadow-sm hover:shadow-md transition-all"
                      }
                    >
                      <UserIcon className="h-3 w-3 mr-1.5" />
                      Instalador
                      {filtroInstalador && (
                        <Badge variant="secondary" className="ml-1 rounded-sm px-1 text-[10px]">
                          {filtroInstalador === "sin_instalador" ? "Sin" : "1"}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  {/* Modificar el PopoverContent del filtro de instalador para incluir búsqueda */}
                  <PopoverContent className="w-64 p-0 rounded-md shadow-lg border border-gray-100" align="end">
                    <div className="p-2 border-b bg-gray-50">
                      <div className="relative">
                        <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          placeholder="Buscar instalador..."
                          className="pl-7 h-7 text-xs"
                          value={busquedaInstalador}
                          onChange={(e) => setBusquedaInstalador(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="py-1.5">
                      <div className="px-2 pb-1 text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                        Opciones rápidas
                      </div>
                      <div className="grid gap-0.5">
                        <div
                          className="flex items-center px-2 py-1 hover:bg-blue-50 cursor-pointer text-xs transition-colors"
                          onClick={() => {
                            setFiltroInstalador(null)
                            setBusquedaInstalador("")
                          }}
                        >
                          <div className="w-4 h-4 mr-2 flex items-center justify-center">
                            {filtroInstalador === null && <Check className="h-3 w-3 text-blue-600" />}
                          </div>
                          <span className="flex-1">Todos los instaladores</span>
                        </div>
                        <div
                          className="flex items-center px-2 py-1 hover:bg-blue-50 cursor-pointer text-xs transition-colors"
                          onClick={() => {
                            setFiltroInstalador("sin_instalador")
                            setBusquedaInstalador("")
                          }}
                        >
                          <div className="w-4 h-4 mr-2 flex items-center justify-center">
                            {filtroInstalador === "sin_instalador" && <Check className="h-3 w-3 text-blue-600" />}
                          </div>
                          <UserIcon className="h-3 w-3 mr-2 text-gray-500" />
                          <span className="flex-1">Sin asignar</span>
                          <Badge variant="secondary" className="ml-1 rounded-sm px-1 text-[10px] bg-gray-100">
                            {ordenesOriginal.filter((o) => !o.instalador_id || o.instalador_id === "").length}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="py-1.5 border-t">
                      <div className="px-2 pb-1 text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                        Instaladores
                      </div>
                      <div className="max-h-[180px] overflow-y-auto">
                        {instaladoresUnicos
                          .filter(
                            (instalador) =>
                              instalador.nombre &&
                              instalador.nombre.toLowerCase().includes(busquedaInstalador.toLowerCase()),
                          )
                          .map((instalador) => (
                            <div
                              key={instalador.id}
                              className="flex items-center px-2 py-1 hover:bg-blue-50 cursor-pointer text-xs transition-colors"
                              onClick={() => {
                                setFiltroInstalador(instalador.id || null)
                                setBusquedaInstalador("")
                              }}
                            >
                              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                {filtroInstalador === instalador.id && <Check className="h-3 w-3 text-blue-600" />}
                              </div>
                              <div className="flex items-center gap-2 flex-1">
                                <div className="bg-blue-50 text-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                                  {instalador.nombre ? instalador.nombre.substring(0, 2).toUpperCase() : "??"}
                                </div>
                                <span>{instalador.nombre}</span>
                              </div>
                              <Badge variant="secondary" className="ml-1 rounded-sm px-1 text-[10px] bg-gray-100">
                                {ordenesOriginal.filter((o) => o.instalador_id === instalador.id).length}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={
                        filtroCliente
                          ? "bg-blue-50 text-blue-600 border-blue-200 text-xs font-medium shadow-sm hover:shadow-md transition-all"
                          : "text-xs font-medium shadow-sm hover:shadow-md transition-all"
                      }
                    >
                      <FileText className="h-3 w-3 mr-1.5" />
                      Cliente
                      {filtroCliente && (
                        <Badge variant="secondary" className="ml-1 rounded-sm px-1 text-[10px]">
                          1
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  {/* Modificar el PopoverContent del filtro de cliente para incluir búsqueda */}
                  <PopoverContent className="w-64 p-0 rounded-md shadow-lg border border-gray-100" align="end">
                    <div className="p-2 border-b bg-gray-50">
                      <div className="relative">
                        <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          placeholder="Buscar cliente..."
                          className="pl-7 h-7 text-xs"
                          value={busquedaCliente}
                          onChange={(e) => setBusquedaCliente(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="py-1.5">
                      <div className="px-2 pb-1 text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                        Opciones rápidas
                      </div>
                      <div className="grid gap-0.5">
                        <div
                          className="flex items-center px-2 py-1 hover:bg-blue-50 cursor-pointer text-xs transition-colors"
                          onClick={() => {
                            setFiltroCliente(null)
                            setBusquedaCliente("")
                          }}
                        >
                          <div className="w-4 h-4 mr-2 flex items-center justify-center">
                            {filtroCliente === null && <Check className="h-3 w-3 text-blue-600" />}
                          </div>
                          <span className="flex-1">Todos los clientes</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1.5 border-t">
                      <div className="px-2 pb-1 text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                        Clientes
                      </div>
                      <div className="max-h-[180px] overflow-y-auto">
                        {clientesUnicos
                          .filter(
                            (cliente) =>
                              cliente.nombre && cliente.nombre.toLowerCase().includes(busquedaCliente.toLowerCase()),
                          )
                          .map((cliente) => (
                            <div
                              key={cliente.id}
                              className="flex items-center px-2 py-1 hover:bg-blue-50 cursor-pointer text-xs transition-colors"
                              onClick={() => {
                                setFiltroCliente(cliente.id || null)
                                setBusquedaCliente("")
                              }}
                            >
                              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                {filtroCliente === cliente.id && <Check className="h-3 w-3 text-blue-600" />}
                              </div>
                              <div className="flex items-center gap-2 flex-1">
                                <div className="bg-green-50 text-green-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                                  {cliente.nombre ? cliente.nombre.substring(0, 2).toUpperCase() : "??"}
                                </div>
                                <span>{cliente.nombre}</span>
                              </div>
                              <Badge variant="secondary" className="ml-1 rounded-sm px-1 text-[10px] bg-gray-100">
                                {ordenesOriginal.filter((o) => o.id_cliente === cliente.id).length}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={
                        filtroFechaDesde || filtroFechaHasta
                          ? "bg-blue-50 text-blue-600 border-blue-200 text-xs font-medium shadow-sm hover:shadow-md transition-all"
                          : "text-xs font-medium shadow-sm hover:shadow-md transition-all"
                      }
                    >
                      <CalendarIcon className="h-3 w-3 mr-1.5" />
                      Fecha
                      {(filtroFechaDesde || filtroFechaHasta) && (
                        <Badge variant="secondary" className="ml-1 rounded-sm px-1 text-[10px]">
                          1
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3 rounded-md shadow-lg border border-gray-100" align="end">
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Fecha de instalación desde</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal text-xs h-7"
                            >
                              <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                              {filtroFechaDesde
                                ? format(filtroFechaDesde, "dd/MM/yyyy", { locale: es })
                                : "Seleccionar fecha"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={filtroFechaDesde || undefined}
                              onSelect={(date) => setFiltroFechaDesde(date || null)}
                              initialFocus
                              className="rounded-md border"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Fecha de instalación hasta</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal text-xs h-7"
                            >
                              <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                              {filtroFechaHasta
                                ? format(filtroFechaHasta, "dd/MM/yyyy", { locale: es })
                                : "Seleccionar fecha"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={filtroFechaHasta || undefined}
                              onSelect={(date) => setFiltroFechaHasta(date || null)}
                              initialFocus
                              className="rounded-md border"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={
                        filtroProducto
                          ? "bg-blue-50 text-blue-600 border-blue-200 text-xs font-medium shadow-sm hover:shadow-md transition-all"
                          : "text-xs font-medium shadow-sm hover:shadow-md transition-all"
                      }
                    >
                      <Package className="h-3 w-3 mr-1.5" />
                      Producto
                      {filtroProducto && (
                        <Badge variant="secondary" className="ml-1 rounded-sm px-1 text-[10px]">
                          1
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  {/* Modificar el PopoverContent del filtro de producto para incluir búsqueda */}
                  <PopoverContent className="w-64 p-0 rounded-md shadow-lg border border-gray-100" align="end">
                    <div className="p-2 border-b bg-gray-50">
                      <div className="relative">
                        <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                          placeholder="Buscar producto..."
                          className="pl-7 h-7 text-xs"
                          value={busquedaProducto}
                          onChange={(e) => setBusquedaProducto(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="py-1.5">
                      <div className="px-2 pb-1 text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                        Opciones rápidas
                      </div>
                      <div className="grid gap-0.5">
                        <div
                          className="flex items-center px-2 py-1 hover:bg-blue-50 cursor-pointer text-xs transition-colors"
                          onClick={() => {
                            setFiltroProducto(null)
                            setBusquedaProducto("")
                          }}
                        >
                          <div className="w-4 h-4 mr-2 flex items-center justify-center">
                            {filtroProducto === null && <Check className="h-3 w-3 text-blue-600" />}
                          </div>
                          <span className="flex-1">Todos los productos</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1.5 border-t">
                      <div className="px-2 pb-1 text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                        Productos
                      </div>
                      <div className="max-h-[180px] overflow-y-auto">
                        {productosUnicos
                          .filter(
                            (producto) =>
                              producto.nombre && producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()),
                          )
                          .map((producto) => (
                            <div
                              key={producto.id}
                              className="flex items-center px-2 py-1 hover:bg-blue-50 cursor-pointer text-xs transition-colors"
                              onClick={() => {
                                setFiltroProducto(producto.id)
                                setBusquedaProducto("")
                              }}
                            >
                              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                {filtroProducto === producto.id && <Check className="h-3 w-3 text-blue-600" />}
                              </div>
                              <div className="flex items-center gap-2 flex-1">
                                <div className="bg-amber-50 text-amber-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                                  {producto.nombre ? producto.nombre.substring(0, 2).toUpperCase() : "??"}
                                </div>
                                <span>{producto.nombre}</span>
                              </div>
                              <Badge variant="secondary" className="ml-1 rounded-sm px-1 text-[10px] bg-gray-100">
                                {
                                  ordenesOriginal.filter((o) => o.detalles?.some((d) => d.id_producto === producto.id))
                                    .length
                                }
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {hayFiltrosActivos() && (
                  <Button variant="ghost" size="sm" onClick={limpiarFiltros} className="ml-auto text-xs font-medium">
                    <X className="h-3 w-3 mr-1" />
                    Limpiar filtros
                  </Button>
                )}

                <Button variant="outline" size="icon" onClick={() => filtrarOrdenes()} className="h-7 w-7">
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
                <Button className="text-xs h-7 px-2.5">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Nueva Orden
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal - Kanban */}
      <main className="overflow-x-auto pb-2 h-[calc(100vh-12rem)]">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex h-full space-x-2 overflow-x-auto pb-2">
            {estatusOrdenInstalacion.map((estatus) => (
              <div key={estatus.id} className="flex-shrink-0 w-80">
                <div className="bg-white rounded-lg shadow-sm h-full flex flex-col border border-gray-100">
                  <div
                    className="p-3 font-medium flex items-center justify-between rounded-t-lg shadow-sm text-white"
                    style={{
                      background: getStatusGradient(estatus.id),
                      boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.1)",
                    }}
                  >
                    <span>{estatus.descripcion}</span>
                    <Badge variant="outline" className="bg-white text-gray-800 text-xs">
                      {columnas[estatus.id]?.length || 0}
                    </Badge>
                  </div>
                  <Droppable droppableId={estatus.id.toString()}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto p-2">
                        {columnas[estatus.id]?.map((orden, index) => (
                          <Draggable key={orden.id} draggableId={orden.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="mb-2"
                              >
                                <Card
                                  className="shadow-sm hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] cursor-pointer border-l-4"
                                  style={{
                                    borderLeftColor: getStatusColor(orden.id_estatus_ordenes_instalacion || 0),
                                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                                  }}
                                  onClick={() => abrirDetalles(orden)}
                                >
                                  <CardHeader className="p-3 pb-0">
                                    <CardTitle className="text-sm font-medium">
                                      <span className="truncate">{orden.codigo}</span>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="p-3 pt-2">
                                    <div className="text-sm text-gray-700 font-medium mb-1 truncate">
                                      {orden.cliente_razon_social}
                                    </div>
                                    <div className="space-y-2 text-xs">
                                      <div className="flex items-center text-gray-600">
                                        <CalendarIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                                        <span>{formatearFecha(orden.FechaHoraInstalacion)}</span>
                                      </div>
                                      <div className="flex items-center text-gray-600">
                                        <UserIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                                        <span className="truncate">{orden.instalador_nombre_completo}</span>
                                      </div>
                                      {orden.direccion && (
                                        <div className="flex items-center text-gray-600">
                                          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                                          <span className="truncate">
                                            {orden.direccion.municipio}, {orden.direccion.estado}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                  <CardFooter className="p-3 pt-0 flex justify-between items-center">
                                    <div className="flex flex-wrap gap-1">
                                      {orden.detalles?.map((detalle, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                          {detalle.cantidad}x {detalle.producto}
                                        </Badge>
                                      ))}
                                    </div>
                                  </CardFooter>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {columnas[estatus.id]?.length === 0 && (
                          <div className="text-center py-4 text-gray-500 text-sm">No hay órdenes en este estatus</div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      </main>

      {/* Sidebar para detalles */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="sticky top-0 z-10 bg-white pb-4">
            <div className="flex justify-between items-center">
              <SheetTitle className="text-xl font-bold">Detalles de la Orden</SheetTitle>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <SheetDescription className="flex items-center gap-2">
              <span className="font-medium">{ordenSeleccionada?.codigo}</span>
              {ordenSeleccionada && (
                <Badge
                  className="ml-2"
                  style={{
                    background: `linear-gradient(135deg, ${getStatusColor(ordenSeleccionada?.id_estatus_ordenes_instalacion || 0)}20, ${getStatusColor(ordenSeleccionada?.id_estatus_ordenes_instalacion || 0)}40)`,
                    color: getStatusColor(ordenSeleccionada?.id_estatus_ordenes_instalacion || 0),
                    border: `1px solid ${getStatusColor(ordenSeleccionada?.id_estatus_ordenes_instalacion || 0)}40`,
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                >
                  {ordenSeleccionada?.estatus_ordenes_instalacion || "Sin estatus"}
                </Badge>
              )}
            </SheetDescription>
          </SheetHeader>

          {ordenSeleccionada && (
            <Tabs defaultValue="detalles" className="mt-6">
              <TabsList className="grid grid-cols-3 p-1 bg-gray-50 rounded-lg">
                <TabsTrigger
                  value="detalles"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
                >
                  Detalles
                </TabsTrigger>
                <TabsTrigger
                  value="productos"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
                >
                  Productos
                </TabsTrigger>
                <TabsTrigger
                  value="direccion"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs"
                >
                  Dirección
                </TabsTrigger>
              </TabsList>
              <TabsContent value="detalles" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-medium text-gray-500">Cliente</h3>
                    <p className="text-sm">{ordenSeleccionada.cliente_razon_social}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500">Pedido</h3>
                    <p className="text-sm">{ordenSeleccionada.pedido_codigo}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500">Instalador</h3>
                    <p className="text-sm">{ordenSeleccionada.instalador_nombre_completo}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-gray-500">Fecha de Instalación</h3>
                    <p className="text-sm">{formatearFecha(ordenSeleccionada.FechaHoraInstalacion)}</p>
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-xs font-medium text-gray-500">Notas</h3>
                    <p className="text-sm">{ordenSeleccionada?.Notas || "Sin notas"}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="productos" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-xs font-medium text-gray-500">Productos a Instalar</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ensamble
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {ordenSeleccionada.surtidos?.map((producto) => (
                          <tr key={producto.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-xs">{producto.producto}</td>
                            <td className="px-4 py-2 text-xs">{producto.cantidad}</td>
                            <td className="px-4 py-2 text-xs">{producto.ensamble || "N/A"}</td>
                            <td className="px-4 py-2 text-xs">
                              {producto.surtido ? (
                                <Badge variant="outline" className="bg-green-50 text-green-600 text-[10px] font-medium">
                                  Surtido
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-50 text-yellow-600 text-[10px] font-medium"
                                >
                                  Pendiente
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="direccion" className="mt-4">
                {ordenSeleccionada.direccion ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">País</h3>
                        <p className="text-sm">{ordenSeleccionada.direccion.pais}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">Estado</h3>
                        <p className="text-sm">{ordenSeleccionada.direccion.estado}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">Municipio</h3>
                        <p className="text-sm">{ordenSeleccionada.direccion.municipio}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">Localidad</h3>
                        <p className="text-sm">{ordenSeleccionada.direccion.localidad}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">Colonia</h3>
                        <p className="text-sm">{ordenSeleccionada.direccion.colonia}</p>
                      </div>
                      <div>
                        <h3 className="text-xs font-medium text-gray-500">Código Postal</h3>
                        <p className="text-sm">{ordenSeleccionada.direccion.codigo_postal}</p>
                      </div>
                      {ordenSeleccionada.direccion.calle && (
                        <div className="col-span-2">
                          <h3 className="text-xs font-medium text-gray-500">Dirección Completa</h3>
                          <p className="text-sm">
                            {ordenSeleccionada.direccion.calle} {ordenSeleccionada.direccion.numero_exterior}{" "}
                            {ordenSeleccionada.direccion.numero_interior
                              ? `Int. ${ordenSeleccionada.direccion.numero_interior}`
                              : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500 text-sm">
                    No hay información de dirección disponible
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>
      {/* Agregar el Toaster al final */}
    </div>
  );
}
