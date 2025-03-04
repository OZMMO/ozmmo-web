"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { recepcionesFormSchema } from "./schemas";
// import { Bodega } from "@/lib/db/catalogos/bodega.model"
import { RecepcionInfoExtra } from "./page.client";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

type RecepcionFormValues = z.infer<typeof recepcionesFormSchema>;

interface RecepcionFormProps {
  initialData?: any | null;
  infoExtra?: any;
  onSubmit: (data: any) => void;
}

export function RecepcionForm({
  initialData,
  infoExtra,
  onSubmit,
}: RecepcionFormProps) {
  const form = useForm<RecepcionFormValues>({
    resolver: zodResolver(recepcionesFormSchema),
    defaultValues: {
      fecha_recepcion: initialData?.fecha_recepcion || "",
      proveedor_id: initialData?.proveedor_id || 0,
      bodega_id: initialData?.bodega_id || 0,
      completado: initialData?.completado || false,
      estatus: initialData?.estatus || false,
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (data: RecepcionFormValues) => {
    try {
      data.id = initialData?.id || 0;
      data.proveedor_id = data.proveedor_id ? Number(data.proveedor_id) : null;
      data.bodega_id = data.bodega_id ? Number(data.bodega_id) : null;
      data.completado = data.completado ? Boolean(data.completado) : undefined;
      data.estatus = data.estatus ? Boolean(data.estatus) : undefined;
      await onSubmit(data as any);
      toast.success("Recepcion guardada correctamente");
    } catch (error) {
      console.error("Error al guardar la recepcion:", error);
      toast.error("Error al guardar la recepcion");
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
          <FormField
            control={form.control}
            name="fecha_recepcion"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Recepcion</FormLabel>
                <DateTimePicker date={field.value} setDate={field.onChange} />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="proveedor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Proveedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.catalogoProveedores?.map((proveedor: any) => (
                      <SelectItem
                        key={proveedor.id}
                        value={proveedor.id.toString()}
                      >
                        {proveedor.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="bodega_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bodega</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Bodega" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.catalogoBodegas?.map((bodega: any) => (
                      <SelectItem key={bodega.id} value={bodega.id.toString()} className="">
                        <div className="flex flex-col items-start gap-1">
                          <div className="font-medium">
                            Bodega: {bodega.codigo} - {bodega.descripcion}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Empresa: {bodega.empresa?.codigo} - {bodega.empresa?.nombre_comercial}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="completado"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Completado</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div> */}
        <div className="grid grid-cols-2 gap-4">
        <FormField
            control={form.control}
            name="completado"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>Completado</FormLabel>
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
{/*           
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
          /> */}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  );
}
