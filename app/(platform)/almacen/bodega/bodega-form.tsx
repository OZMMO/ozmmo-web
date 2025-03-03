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
import { bodegaFormSchema } from "./schemas";
// import { Bodega } from "@/lib/db/catalogos/bodega.model"
import { BodegaInfoExtra } from "./page.client";
import { toast } from "sonner";
import { Bodega } from "@/lib/db";
import { useRouter, useSearchParams } from "next/navigation";
import { Switch } from "@/components/ui/switch";
type BodegaFormValues = z.infer<typeof bodegaFormSchema>;

interface BodegaFormProps {
  initialData?: Bodega | null;
  infoExtra?: BodegaInfoExtra;
  onSubmit: (data: any) => void;
}

export function BodegaForm({
  initialData,
  infoExtra,
  onSubmit,
}: BodegaFormProps) {
  const searchParams = useSearchParams();
  const empresaId = searchParams.get("empresaId");

  const form = useForm<BodegaFormValues>({
    resolver: zodResolver(bodegaFormSchema),
    defaultValues: {
      codigo: initialData?.codigo || "AUTOGENERADO",
      descripcion: initialData?.descripcion || "",
      empresa_id: initialData?.empresa_id ? initialData?.empresa_id : (empresaId ? Number(empresaId) : 0),
      sucursal_id: initialData?.sucursal_id || 0,
      estatus: initialData?.estatus || false,
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (data: BodegaFormValues) => {
    try {
      data.id = initialData?.id || 0;
      data.empresa_id = data.empresa_id ? Number(data.empresa_id) : null;
      data.sucursal_id = data.sucursal_id ? Number(data.sucursal_id) : null;
      await onSubmit(data as any);
      toast.success("Bodega guardada correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la bodega");
    }
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
            disabled={true}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 0001" {...field} />
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
            name="empresa_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa - Razón Social</FormLabel>
                <Select
                  disabled={empresaId ? true : false}
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Empresa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.catalogoEmpresas?.map((empresa: any) => (
                      <SelectItem
                        key={empresa.id}
                        value={empresa.id.toString()}
                      >
                        {empresa.codigo}-{empresa.razon_social}
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
        </div> */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  );
}
