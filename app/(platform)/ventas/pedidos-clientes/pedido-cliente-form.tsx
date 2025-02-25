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
import { pedidoClienteFormSchema } from "./schemas";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Cliente, Canal, Pedido, Direccion } from "@/lib/db";
import DireccionForm from "@/components/direccion";
import { Textarea } from "@/components/ui/textarea";
type PedidoClienteFormValues = z.infer<typeof pedidoClienteFormSchema>;

interface PedidoClienteFormProps {
  initialData?: any | null;
  infoExtra?: {
    clientes: Cliente[];
    canales: Canal[];
  };
  onSubmit: (data: any) => void;
}

export function PedidoClienteForm({
  initialData,
  infoExtra,
  onSubmit,
}: PedidoClienteFormProps) {
  const form = useForm<PedidoClienteFormValues>({
    resolver: zodResolver(pedidoClienteFormSchema),
    defaultValues: {
      id_cliente: initialData?.id_cliente || 0,
      id_canal_venta: initialData?.id_canal_venta || 0,
      generar_factura: initialData?.generar_factura || false,
      generar_instalacion: initialData?.generar_instalacion || false,
      direccion: initialData?.direccion || undefined,
      Notas: initialData?.Notas || "",
    },
  });
  const error = form.formState.errors;

  console.log(error);

  const [selectedDireccion, setSelectedDireccion] = useState<Direccion | null>(
    initialData?.direccion || null
  );

  const handleSubmit = (values: PedidoClienteFormValues) => {
    values.id = initialData?.id || 0;
    values.direccion = selectedDireccion || undefined;
    onSubmit(values as unknown as Pedido);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="id_cliente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.clientes.map((cliente) => (
                      <SelectItem
                        key={cliente.id}
                        value={cliente.id.toString()}
                      >
                        {cliente.razon_social}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id_canal_venta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Canal de Venta</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un canal de venta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.canales.map((canal) => (
                      <SelectItem key={canal.id} value={canal.id.toString()}>
                        {canal.descripcion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="generar_factura"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Generar Factura</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="generar_instalacion"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Generar Instalación</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="Notas"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Textarea placeholder="Notas" {...field} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Notas</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        <DireccionForm
          selectedDireccion={selectedDireccion}
          setSelectedDireccion={setSelectedDireccion}
        />
        <div className="flex justify-end">
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  );
}
