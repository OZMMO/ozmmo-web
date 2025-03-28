"use client";

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
import { sucursalSchema } from "./schema";
import { SucursalInfoExtra } from "./page.client";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import DireccionForm from "@/components/direccion";
import { Direccion } from "@/lib/db/sat/direcciones/direccion";
import { Sucursal } from "@/lib/db/catalogos/sucursales/sucursal";
import { FormSubmit } from "@/components/form-submit";
import { Switch } from "@/components/ui/switch";
type SucursalFormValues = z.infer<typeof sucursalSchema>;

interface SucursalFormProps {
  initialData?: Sucursal | null;
  infoExtra?: SucursalInfoExtra;
  onSubmit: (data: Sucursal) => void;
}

export function SucursalForm({
  initialData,
  infoExtra,
  onSubmit,
}: SucursalFormProps) {
  const form = useForm<SucursalFormValues>({
    resolver: zodResolver(sucursalSchema),
    defaultValues: {
      empresa_id: initialData?.empresa_id || infoExtra?.empresa?.id || 0,
      codigo: initialData?.codigo || "AUTOGENERADO",
      nombre: initialData?.nombre || "",
      telefono: initialData?.telefono || undefined,
      responsable: initialData?.responsable || undefined,
      correo_electronico: initialData?.correo_electronico || undefined,
      estatus: initialData?.estatus || false,
      direccion: initialData?.direccion || undefined
    },
  });

  const { isSubmitting } = form.formState;

  const [selectedDireccion, setSelectedDireccion] = useState<Direccion | null>(initialData?.direccion || null)

  const handleSubmit = async (data: SucursalFormValues) => {
    try {
      data.id = initialData?.id || 0;
      data.empresa_id = data.empresa_id ? Number(data.empresa_id) : null;
      
      data.direccion = selectedDireccion || undefined
      await onSubmit(data as Sucursal);
    } catch (error) {
      console.log('Error al guardar la sucursal:', { error });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-2 py-2"
      >
        <input type="hidden" name="id" value={initialData?.id} />
        <input type="hidden" name="empresa_id" value={initialData?.empresa_id || infoExtra?.empresa?.id} />

        <div className="flex items-centergap-2 p-2 mb-4 bg-sky-100 rounded-lg border border-sky-200">
          <span className="font-semibold text-sky-700">Empresa:</span>
          <span className="text-sky-900">&nbsp;{infoExtra?.empresa?.codigo} - {infoExtra?.empresa?.nombre_comercial}</span>
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
                  <Input placeholder="Ej: SUC001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la sucursal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="correo_electronico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="correo@sucursal.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: (555) 555-5555" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* <FormField
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

        <DireccionForm selectedDireccion={selectedDireccion} setSelectedDireccion={setSelectedDireccion} />

        <FormSubmit disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </FormSubmit>
      </form>
    </Form>
  );
}
