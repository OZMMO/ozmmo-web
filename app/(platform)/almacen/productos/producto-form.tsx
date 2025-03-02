"use client";

import { useState } from "react";
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
import { productosFormSchema } from "./schemas";
// import { Bodega } from "@/lib/db/catalogos/bodega.model"
import { ProductosInfoExtra } from "./page.client";

type ProductosFormValues = z.infer<typeof productosFormSchema>;

interface ProductosFormProps {
  initialData?: any | null;
  infoExtra?: any;
  onSubmit: (data: any) => void;
}

export function ProductosForm({
  initialData,
  infoExtra,
  onSubmit,
}: ProductosFormProps) {

  const form = useForm<ProductosFormValues>({
    resolver: zodResolver(productosFormSchema),
    defaultValues: {
      codigo: initialData?.codigo || "",
      codigo_proveedor: initialData?.codigo_proveedor || "",
      descripcion: initialData?.descripcion || "",
      unidad_medida_id: initialData?.unidad_medida_id || 0,
      peso: initialData?.peso || 0,
      volumen: initialData?.volumen || 0,
      es_ensamble: initialData?.es_ensamble || false,
      estatus: initialData?.estatus || true,
    },
  });

  const handleSubmit = (data: ProductosFormValues) => {
    data.id = initialData?.id || 0;
    data.unidad_medida_id = data.unidad_medida_id
      ? Number(data.unidad_medida_id)
      : undefined;
    onSubmit(data as any);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 py-4"
      >
        <input type="hidden" name="id" value={initialData?.id} />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: NÚMERO DE PRODUCTO" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="codigo_proveedor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Proveedor</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: NÚMERO DE PRODUCTO PROVEEDOR"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input placeholder="Descripción del producto..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="peso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso</FormLabel>
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
          <FormField
            control={form.control}
            name="volumen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volumen</FormLabel>
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
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="unidad_medida_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad de Medida</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Unidad de Medida" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.catalogoUnidadMedida?.map(
                      (unidadMedida: any) => (
                        <SelectItem
                          key={unidadMedida.id}
                          value={unidadMedida.id.toString()}
                        >
                          {unidadMedida.abreviatura}-{unidadMedida.nombre}
                        </SelectItem>
                      )
                    )}
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
            name="es_ensamble"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Es Ensamblado</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
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
        </div>
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  );
}
