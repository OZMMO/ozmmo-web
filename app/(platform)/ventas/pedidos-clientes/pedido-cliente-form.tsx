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
import { Cliente, Canal, Pedido, Direccion, Concepto } from "@/lib/db";
import DireccionForm from "@/components/direccion";
import { Textarea } from "@/components/ui/textarea";
import { DetallePedidoTable } from "./detalle-pedido-table";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";

type PedidoClienteFormValues = z.infer<typeof pedidoClienteFormSchema>;

interface PedidoClienteFormProps {
  initialData?: any | null;
  infoExtra?: {
    clientes: Cliente[];
    canales: Canal[];
    conceptos: Concepto[];
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
      detalles: initialData?.detalles || [],
    },
  });

  const { isSubmitting } = form.formState;

  const [selectedDireccion, setSelectedDireccion] = useState<Direccion | null>(
    initialData?.direccion || null
  );

  const handleSubmit = async (values: PedidoClienteFormValues) => {
    try {
      values.id = initialData?.id || 0;
      values.direccion = selectedDireccion || undefined;
      console.log(values);
      await onSubmit(values as Pedido);
    } catch (error) {
      console.error(error);
    }
  };

  return (    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <div className="container-full mx-auto py-2 max-w-5xl">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-2xl font-bold">Agregar nuevo pedido</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="details">Detalles del pedido</TabsTrigger>
                  <TabsTrigger value="address">Dirección de entrega</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
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
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                              />
                          </FormControl>
                          <FormLabel>Generar Factura</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="generar_instalacion"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Generar Instalación</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="Notas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Notas" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="detalles"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <DetallePedidoTable
                            detalles={field.value || []}
                            onDetallesChange={field.onChange}
                            infoExtra={infoExtra}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="address" className="space-y-6">
                  <DireccionForm
                    selectedDireccion={selectedDireccion}
                    setSelectedDireccion={setSelectedDireccion}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end border-t p-6">
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </div>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
}
