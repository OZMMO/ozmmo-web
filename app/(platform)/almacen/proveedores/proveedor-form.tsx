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
import { Direccion } from "@/lib/db/sat/direcciones/direccion";
import { toast } from "sonner";
import DireccionForm from "@/components/direccion";
import { Switch } from "@/components/ui/switch";

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

  const form = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedoresFormSchema),
    defaultValues: {
      nombre: initialData?.nombre,
      contacto: initialData?.contacto || "",
      telefono: initialData?.telefono || "",
      email: initialData?.email || "",
      direccion: initialData?.direccion || undefined,
      estatus: initialData?.estatus || false,
    },
  });

  const { isSubmitting } = form.formState;

  const [selectedDireccion, setSelectedDireccion] = useState<Direccion | null>(initialData?.direccion || null)
  
  const handleSubmit = async (data: ProveedorFormValues) => {
    try {
      data.id = initialData?.id || 0;
      data.nombre = data.nombre;
      data.estatus = data.estatus ? data.estatus : false;
      data.telefono = data.telefono ? data.telefono : null;
      data.email = data.email ? data.email : null;
      data.direccion = selectedDireccion || undefined
      data.contacto = data.contacto ? data.contacto : null;

      await onSubmit(data as any);
      toast.success("Proveedor guardado correctamente");
    } catch (error) {
      console.log('Error al guardar el proveedor:', { error });
      toast.error("Error al guardar el proveedor");
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
        <div className="grid grid-cols-2 gap-4">
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  );
}
