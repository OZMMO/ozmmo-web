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
import { materialProductoFormSchema } from "./schemas";
// import { Bodega } from "@/lib/db/catalogos/bodega.model"
import { MaterialProductoInfoExtra } from "./page.client";
import { Textarea } from "@/components/ui/textarea";

type MaterialProductoFormValues = z.infer<typeof materialProductoFormSchema>;

interface MaterialProductoFormProps {
  initialData?: any | null;
  infoExtra?: any;
  onSubmit: (data: any) => void;
}

export function MaterialProductoForm({
  initialData,
  infoExtra,
  onSubmit,
}: MaterialProductoFormProps) {
  console.log({ infoExtra });

  const form = useForm<MaterialProductoFormValues>({
    resolver: zodResolver(materialProductoFormSchema),
    defaultValues: {
      producto_id: initialData?.producto_id || 0,
      producto_parent_id: Number(infoExtra?.producto_parent_id) || 0,
      cantidad_necesaria: initialData?.cantidad_necesaria || 0,
      unidad_medida_id: initialData?.unidad_medida_id || 0,
      nota: initialData?.nota || "",
      estatus: initialData?.estatus || true,
    },
  });
  const {
    formState: { errors },
  } = form;
  console.log({ form, errors });
  const handleSubmit = (data: MaterialProductoFormValues) => {
    console.log({ data });
    data.id = initialData?.id || 0;
    data.unidad_medida_id = Number(data.unidad_medida_id);
    data.producto_id = Number(data.producto_id);
    data.producto_parent_id = Number(data.producto_parent_id);
    data.cantidad_necesaria = Number(data.cantidad_necesaria);
    onSubmit(data as any);
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
            name="producto_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Producto</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Producto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.catalogoProductos?.map((producto: any) => (
                      <SelectItem
                        key={producto.id}
                        value={producto.id.toString()}
                      >
                        {producto.codigo}-{producto.descripcion}
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
            name="cantidad_necesaria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad Necesaria</FormLabel>
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
            name="nota"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nota</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ej: Notas con respecto al material."
                    {...field}
                    value={field.value?.toString() ?? ""}
                    onChange={(event) =>
                      field.onChange(event.target.value || "")
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
