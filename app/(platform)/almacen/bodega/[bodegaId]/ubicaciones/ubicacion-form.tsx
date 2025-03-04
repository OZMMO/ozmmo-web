"use client";

import { useState } from "react";
import { useParams } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ubicacionesFormSchema } from "./schemas";
// import { Bodega } from "@/lib/db/catalogos/bodega.model"
import { UbicacionInfoExtra } from "./page.client";
import { Ubicacion } from "@/lib/db";
import { Switch } from "@/components/ui/switch";
import { Warehouse } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
type UbicacionFormValues = z.infer<typeof ubicacionesFormSchema>;

interface UbicacionFormProps {
  initialData?: Ubicacion;
  infoExtra?: UbicacionInfoExtra;
  onSubmit: (data: Ubicacion) => void;
}

export function UbicacionForm({
  initialData,
  infoExtra,
  onSubmit
}: UbicacionFormProps) {
  const params = useParams();
  const { bodegaId } = params;
  const bodega = infoExtra?.bodega || { codigo: '', descripcion: '' };

  const form = useForm<UbicacionFormValues>({
    resolver: zodResolver(ubicacionesFormSchema),
    defaultValues: {
      codigo: initialData?.codigo || "AUTOGENERADO",
      descripcion: initialData?.descripcion || "",
      capacidad_maxima: initialData?.capacidad_maxima || 0,
      estado_ubicacion_id: initialData?.estado_ubicacion_id || 0,
      estatus: initialData?.estatus || false,
      bodega_id: initialData?.bodega_id ? Number(initialData?.bodega_id) : (Number(bodegaId) ? Number(bodegaId) : 0),
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (data: UbicacionFormValues) => {
    try {
      data.id = initialData?.id || 0;
      data.bodega_id = data.bodega_id ? Number(data.bodega_id) : null;
      data.capacidad_maxima = data.capacidad_maxima
        ? Number(data.capacidad_maxima)
        : undefined;
      data.estado_ubicacion_id = data.estado_ubicacion_id
        ? Number(data.estado_ubicacion_id)
        : undefined;
      await onSubmit(data as any);
      toast.success("Ubicación guardada correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la ubicación");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 py-4"
      >
        <input type="hidden" name="id" value={initialData?.id} />
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
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="codigo"
            disabled={true}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: LOC001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la Bodega..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="capacidad_maxima"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidad Máxima</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Ej: 1000"
                    {...field}
                    value={field.value?.toString() ?? ""}
                    onChange={(event) =>
                      field.onChange(+event.target.value || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>        
        <div className="grid grid-cols-2 gap-4 items-center">
          <FormField
            control={form.control}
            name="estado_ubicacion_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado de Ubicación</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Estado de Ubicación" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.catalogoEstadosUbicacion?.map(
                      (estadoUbicacion: any) => (
                        <SelectItem
                          key={estadoUbicacion.id}
                          value={estadoUbicacion.id.toString()}
                        >
                          {estadoUbicacion.descripcion}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estatus"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>Estatus</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="estatus"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Estatus</FormLabel>
                </div>
              </FormItem>
            )}
          /> 
        </div>*/}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  );
}
