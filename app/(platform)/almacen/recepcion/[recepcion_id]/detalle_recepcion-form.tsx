"use client";

import { useEffect, useState } from "react";
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
import { detalleRecepcionFormSchema } from "./schemas";
import { UnidadesMedida } from "@/lib/db/almacen/unidades_medida/unidades_medida";
import { DetalleRecepcion } from "@/lib/db/almacen/detalle_recepcion/detalle_recepcion";
type DetalleRecepcionFormValues = z.infer<typeof detalleRecepcionFormSchema>;

interface DetalleRecepcionFormProps {
  initialData?: DetalleRecepcion | null;
  infoExtra?: any;
  onSubmit: (data: any) => void;
}

export function DetalleRecepcionForm({
  initialData,
  infoExtra,
  onSubmit,
}: DetalleRecepcionFormProps) {
  const [unidadMedida, setUnidadMedida] = useState<UnidadesMedida | null>(null);

  useEffect(() => {
    if (initialData?.producto_id) {
      const unidadMedida = infoExtra?.catalogoUnidadMedida?.find(
        (u: any) => u.id === initialData?.unidad_medida_id
      );
      setUnidadMedida(unidadMedida);
    }
  }, [initialData?.producto_id]);

  const form = useForm<DetalleRecepcionFormValues>({
    resolver: zodResolver(detalleRecepcionFormSchema),
    defaultValues: {
      producto_id: initialData?.producto_id || 0,
      recepcion_id: Number(infoExtra?.recepcion_id) || 0,
      cantidad: initialData?.cantidad || 0,
      unidad_medida_id: initialData?.unidad_medida_id || 0,
    },
  });

  const {
    formState: { errors },
  } = form;

  const handleSubmit = (data: DetalleRecepcionFormValues) => {
    data.id = initialData?.id || 0;
    data.unidad_medida_id = Number(data.unidad_medida_id);
    data.producto_id = Number(data.producto_id);
    data.recepcion_id = Number(data.recepcion_id);
    data.cantidad = Number(data.cantidad);
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
                  onValueChange={(value) => {
                    field.onChange(Number(value));
                    // Find selected product and set its unidad_medida_id
                    const producto = infoExtra?.catalogoProductos?.find(
                      (p: any) => p.id === Number(value)
                    );
                    console.log({ producto });
                    if (producto) {
                      const unidadMedida = infoExtra?.catalogoUnidadMedida?.find(
                        (u: any) => u.id === producto.unidad_medida_id
                      );
                      setUnidadMedida(unidadMedida);
                      form.setValue("unidad_medida_id", unidadMedida?.id);
                    }
                  }}
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
          {unidadMedida && (
            <div className="text-sm text-gray-500">
              Unidad de Medida: {unidadMedida.abreviatura}-{unidadMedida.nombre}
            </div>
          )}
          {/* <FormField
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
          />*/}
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="cantidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
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
     
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  );
}
