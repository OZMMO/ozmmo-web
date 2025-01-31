import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DetalleRecepcion, Ubicacion } from "@/lib/db";
import { EstadoLote } from "@/lib/db/almacen/estados-lote/estado-lote";
import { Lote } from "@/lib/db/almacen/lotes/lote";
import { TipoMovimiento } from "@/lib/db/almacen/tipos-movimientos/tipo-movimiento";
import { trazabilidadLoteSchema } from "@/lib/db/almacen/trazabilidad-lotes/trazabilidad-lote";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { createLote } from "./actions";

interface LoteFormProps {
  detalleRecepcion: DetalleRecepcion;
  estadosLote: EstadoLote[];
  bodega: {
    id: number;
    nombre: string;
  };
  ubicaciones: Ubicacion[];
  tiposMovimientos: TipoMovimiento[]; 
}

const loteSchema = z.object({
  id: z.number().optional(),
  codigo_lote: z.string(),
  producto_id: z.number().optional(),
  fecha_fabricacion: z.date({
    invalid_type_error: "Fecha de fabricación inválida",
  }).optional(),
  fecha_expiracion: z.date({
    invalid_type_error: "Fecha de expiración inválida",
  }).optional(),
  cantidad_inicial: z.number({
    invalid_type_error: "Cantidad inicial inválida",
  }).optional(),
  cantidad_disponible: z.number({
    invalid_type_error: "Cantidad disponible inválida",
  }).optional(),
  estado_lote_id: z.number().optional(),
  recepcion_id: z.number().optional(),
  estatus: z.boolean().optional(),
  ubicacion_id: z.number().optional(),
  UserId: z.string().optional(),
  trazabilidad_lotes: trazabilidadLoteSchema,
});

type LoteFormData = z.infer<typeof loteSchema>;


export default function LoteForm({ detalleRecepcion, estadosLote, bodega, ubicaciones, tiposMovimientos }: LoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<LoteFormData>({
    resolver: zodResolver(loteSchema),
    defaultValues: {
      codigo_lote: "",
      producto_id: detalleRecepcion.producto_id,
      fecha_fabricacion: addDays(new Date(), -50),
      fecha_expiracion: addDays(new Date(), 365),
      recepcion_id: detalleRecepcion.recepcion_id,
      estado_lote_id: 1, // Activo - Lote disponible para uso
      cantidad_inicial: detalleRecepcion.cantidad,
      cantidad_disponible: detalleRecepcion.cantidad,
      estatus: true,
      ubicacion_id: 1,
      UserId: "",
      trazabilidad_lotes: {
        cantidad: detalleRecepcion.cantidad,
        ubicacion_origen_id: undefined,
        ubicacion_destino_id: undefined,
        tipo_movimiento_id: 1, // Recepción de Compra - Ingreso de mercancía desde un proveedor
        referencia_movimiento: undefined,
        notas: undefined,
        estatus: true,
      },
    },
  });

  const onSubmit = async (data: LoteFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Here you would typically send the form data to your server
      console.log("Form data:", data)

      // Simulating an API call
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      createLote(data as Lote);
      // console.log('response', response);
      // if (response.error) {
      //   setSubmitError(response.error.message)
      //   throw response.error;
      // }

      reset()
      alert("Form submitted successfully!")
    } catch (error) {
      console.log('error', error);
      setSubmitError("An error occurred while submitting the form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Info Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Producto</p>
            <p className="text-sm text-muted-foreground">{detalleRecepcion.producto}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Unidad de Medida</p>
            <p className="text-sm text-muted-foreground">{detalleRecepcion.unidad_medida}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Cantidad a Recibir</p>
            <p className="text-sm text-muted-foreground">{new Intl.NumberFormat().format(detalleRecepcion.cantidad)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 rounded-md border p-4">
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">Bodega</p>
            <p className="text-sm text-muted-foreground">{bodega.nombre}</p>
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="space-y-6">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="col-span-1">
            <Label htmlFor="codigo_lote" className="mb-2 block">Código del Lote</Label>
            <Input 
              type="text" 
              id="codigo_lote" 
              className="w-full" 
              disabled 
              value={"AUTO GENERADO"} 
            />
          </div>
          
          <div className="col-span-1">
            <Label htmlFor="fecha_fabricacion" className="mb-2 block">Fecha de Fabricación</Label>
            <Controller
              control={control}
              name="fecha_fabricacion"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PP") : <span>Seleccione fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="fecha_expiracion" className="mb-2 block">Fecha de Expiración</Label>
            <Controller
              control={control}
              name="fecha_expiracion" 
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PP") : <span>Seleccione fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="col-span-1">
            <Label htmlFor="cantidad_inicial" className="mb-2 block">Cantidad Inicial</Label>
            <Input type="number" id="cantidad_inicial" {...register("cantidad_inicial")} disabled className="w-full" />
          </div>

          <div className="col-span-1">
            <Label htmlFor="cantidad_disponible" className="mb-2 block">Cantidad Disponible</Label>
            <Input type="number" id="cantidad_disponible" {...register("cantidad_disponible")} disabled className="w-full" />
          </div>
        </div>

        {/* Second Row - Estado y Ubicaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="estado_lote_id" className="mb-2 block">Estado del Lote</Label>
            <Controller
              control={control}
              name="estado_lote_id"
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadosLote.map((estado) => (
                      <SelectItem key={estado.id} value={estado.id.toString()}>
                        <div className="flex flex-col items-start">
                          <span>{estado.nombre}</span>
                          <span className="text-sm text-muted-foreground">
                            {estado.descripcion}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="trazabilidad_lotes.ubicacion_origen_id" className="mb-2 block">Ubicación Origen</Label>
            <Controller
              control={control}
              name="trazabilidad_lotes.ubicacion_origen_id" 
              render={({ field }) => (
                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {ubicaciones.map((ubicacion) => (
                      <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                        <div className="flex flex-col items-start">
                          <span>{ubicacion.codigo}</span>
                          <span className="text-sm text-muted-foreground">{ubicacion.descripcion}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="trazabilidad_lote.ubicacion_destino_id" className="mb-2 block">Ubicación Destino</Label>
            <Controller
              control={control}
              name="trazabilidad_lotes.ubicacion_destino_id"
              render={({ field }) => (
                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {ubicaciones.map((ubicacion) => (
                      <SelectItem key={ubicacion.id} value={ubicacion.id.toString()}>
                        <div className="flex flex-col items-start">
                          <span>{ubicacion.codigo}</span>
                          <span className="text-sm text-muted-foreground">{ubicacion.descripcion}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label htmlFor="trazabilidad_lotes.tipo_movimiento_id" className="mb-2 block">Tipo de Movimiento</Label>
            <Controller
              control={control}
              name="trazabilidad_lotes.tipo_movimiento_id"
              render={({ field }) => (
                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo de movimiento" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposMovimientos.map((tipoMovimiento) => (
                      <SelectItem key={tipoMovimiento.id} value={tipoMovimiento.id.toString()}>
                        <div className="flex flex-col items-start">
                          <span>{tipoMovimiento.nombre}</span>
                          <span className="text-sm text-muted-foreground">{tipoMovimiento.descripcion}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Referencias y Notas */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label htmlFor="trazabilidad_lotes.referencia_movimiento" className="mb-2 block">
              Referencia del Movimiento
            </Label>
            <Input 
              type="text" 
              id="trazabilidad_lotes.referencia_movimiento" 
              {...register("trazabilidad_lotes.referencia_movimiento")} 
              className="w-full" 
            />
          </div>

          <div>
            <Label htmlFor="trazabilidad_lotes.notas" className="mb-2 block">Notas</Label>
            <Textarea
              id="trazabilidad_lotes.notas"
              placeholder="Ingrese notas adicionales..."
              {...register("trazabilidad_lotes.notas")}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </div>

      {/* Error Message */}
      {submitError && (
        <p className="text-red-500 text-center mt-4">{submitError}</p>
      )}
    </form>
  )
}