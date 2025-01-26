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
import { proveedoresFormSchema } from "./schemas";
// import { Bodega } from "@/lib/db/catalogos/bodega.model"
import { ProveedorInfoExtra } from "./page.client";

type ProveedorFormValues = z.infer<typeof proveedoresFormSchema>;

interface ProveedorFormProps {
  initialData?: any | null;
  infoExtra?: any;
  onSubmit: (data: any) => void;
}

export function ProveedorForm({
  initialData,
  infoExtra,
  onSubmit,
}: ProveedorFormProps) {
  console.log({ initialData });

  const form = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedoresFormSchema),
    defaultValues: {
      nombre: initialData?.nombre,
      contacto: initialData?.contacto || "",
      telefono: initialData?.telefono || "",
      email: initialData?.email || "",
      direccion: initialData?.direccion || "",
      estatus: initialData?.estatus || true,
    },
  });
  console.log({ form });
  const handleSubmit = (data: ProveedorFormValues) => {
    console.log({ data });
    data.id = initialData?.id || 0;
    data.nombre = data.nombre;
    data.estatus = data.estatus ? data.estatus : false;
    data.telefono = data.telefono ? data.telefono : null;
    data.email = data.email ? data.email : null;
    data.direccion = data.direccion ? data.direccion : null;
    data.contacto = data.contacto ? data.contacto : null;
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
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del Proveedor..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="contacto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contacto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre del Contacto..."
                    {...field}
                    value={field.value?.toString() ?? ""}
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
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Teléfono del Proveedor..."
                    {...field}
                    value={field.value?.toString() ?? ""}
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email del Proveedor..."
                    {...field}
                    value={field.value?.toString() ?? ""}
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
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Dirección del Proveedor..."
                    {...field}
                    value={field.value?.toString() ?? ""}
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
