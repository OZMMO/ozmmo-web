"use client";

import { useState, useEffect } from "react";
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
import { ordenInstalacionFormSchema } from "./schemas";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Cliente,
  Pedido,
  Direccion,
  Productos,
  User,
  OrdenInstalacion,
  EstatusOrdenInstalacion,
} from "@/lib/db";
import DireccionForm from "@/components/direccion";
import { Textarea } from "@/components/ui/textarea";
import { DetalleOrdenInstalacionTable } from "./detalle-orden-instalacion-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy } from "lucide-react";
type OrdenInstalacionFormValues = z.infer<typeof ordenInstalacionFormSchema>;

interface OrdenInstalacionFormProps {
  initialData?: any | null;
  infoExtra?: {
    clientes: Cliente[];
    pedidosClientes: Pedido[];
    productos: Productos[];
    instaladores: User[];
    estatusOrdenInstalacion: EstatusOrdenInstalacion[];
  };
  onSubmit: (data: any) => void;
}

export function OrdenInstalacionForm({
  initialData,
  infoExtra,
  onSubmit,
}: OrdenInstalacionFormProps) {
  const form = useForm<OrdenInstalacionFormValues>({
    resolver: zodResolver(ordenInstalacionFormSchema),
    defaultValues: {
      id_cliente: initialData?.id_cliente || undefined,
      id_pedido_cliente: initialData?.id_pedido_cliente || undefined,
      id_estatus_ordenes_instalacion:
        initialData?.id_estatus_ordenes_instalacion || undefined,
      instalador_id: initialData?.instalador_id || undefined,
      FechaHoraInstalacion: initialData?.FechaHoraInstalacion || undefined,
      Notas: initialData?.Notas || "",
      detalles: initialData?.detalles || [],
      direccion: initialData?.direccion || undefined,
    },
  });
  const error = form.formState.errors;
  const { isSubmitting } = form.formState;

  const handleSubmit = async (values: OrdenInstalacionFormValues) => {
    try {
      values.id = initialData?.id || 0;
      values.id_cliente = Number(selectedCliente?.id);
      values.id_pedido_cliente = Number(values.id_pedido_cliente);
      values.id_estatus_ordenes_instalacion = Number(
        values.id_estatus_ordenes_instalacion
      );
      values.instalador_id = values.instalador_id || undefined;
      values.direccion = selectedDireccion || undefined;
      console.log(values);
      await onSubmit(values as unknown as OrdenInstalacion);
    } catch (error) {
      console.error(error);
    }
  };

  const [selectedCliente, setSelectedCliente] = useState<Cliente>();
  const [selectedPedidoCliente, setSelectedPedidoCliente] = useState<Pedido>();
  const [filteredPedidosClientes, setFilteredPedidosClientes] = useState<
    Pedido[]
  >([]);
  const [selectedDireccion, setSelectedDireccion] = useState<Direccion | null>(
    initialData?.direccion || null
  );

  useEffect(() => {
    if (initialData?.id_cliente) {
      const pedidos =
        infoExtra?.pedidosClientes.filter(
          (pedido) => pedido.id_cliente === initialData?.id_cliente
        ) || [];

      setFilteredPedidosClientes(
        infoExtra?.pedidosClientes.filter(
          (pedido) => pedido.id_cliente === initialData?.id_cliente
        ) || []
      );
    } else {
      setFilteredPedidosClientes([]);
    }
  }, [initialData?.id_cliente]);

  useEffect(() => {
    if (selectedCliente) {
      setFilteredPedidosClientes(
        infoExtra?.pedidosClientes.filter(
          (pedido) => pedido.id_cliente === selectedCliente.id
        ) || []
      );
    }
    //  else {
    //  console.log("selectedCliente", selectedCliente);
    //   setFilteredPedidosClientes([]);
    //  }
  }, [selectedCliente]);

  const handleClienteSelect = (clienteId: string) => {
    setSelectedCliente(
      infoExtra?.clientes.find((e) => e.id.toString() === clienteId) ||
        undefined
    );
    // setSelectedProduct({ id: 0, codigo: "", codigo_proveedor: "", descripcion: "", page: 1, pageSize: 10, materiales: [] });
    setSelectedPedidoCliente(undefined);
    setFilteredPedidosClientes([]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{initialData?.id > 0 ? "Editar Orden de Instalación" : "Nueva Orden de Instalación"}</CardTitle>
      </CardHeader>
      <CardContent>
        {initialData?.id > 0 && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-md">
            <span className="text-sm font-medium text-gray-600">Código:</span>
            <code className="text-sm bg-white px-2 py-1 rounded border">{initialData.codigo}</code>
            <Button
              variant="ghost" 
              size="sm"
              className="ml-auto"
              onClick={() => navigator.clipboard.writeText(initialData.codigo)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Tabs defaultValue="General">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="General">General</TabsTrigger>
              <TabsTrigger value="Productos">Productos ({form.getValues("detalles")?.length || 0})</TabsTrigger>
            </TabsList>
            <TabsContent value="General">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="id_cliente"
                  disabled={initialData?.id > 0}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select
                        onValueChange={handleClienteSelect}
                        defaultValue={field.value?.toString()}
                        disabled={initialData?.id > 0}
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
                  name="id_pedido_cliente"
                  disabled={initialData?.id_pedido_cliente > 0}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pedido Cliente</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                        disabled={initialData?.id > 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un pedido cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredPedidosClientes.map((pedidoCliente) => (
                            <SelectItem
                              key={pedidoCliente.id}
                              value={pedidoCliente.id.toString()}
                            >
                              {pedidoCliente.codigo}
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
                  name="instalador_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instalador</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un instalador" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {infoExtra?.instaladores.map((instalador) => (
                            <SelectItem
                              key={instalador.UserId}
                              value={instalador.UserId}
                            >
                              {instalador.FirstName} {instalador.LastNameFather}
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
                  name="FechaHoraInstalacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha y Hora de Instalación</FormLabel>
                      <FormControl>
                        <DateTimePicker date={field.value} setDate={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="id_estatus_ordenes_instalacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estatus de la Orden de Instalación</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un estatus de la orden de instalación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {infoExtra?.estatusOrdenInstalacion.map((estatus) => (
                            <SelectItem key={estatus.id} value={estatus.id.toString()}>
                              {estatus.codigo} - {estatus.descripcion}
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
            </TabsContent>
            <TabsContent value="Productos">
              <FormField
                control={form.control}
                name="detalles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalles del Pedido</FormLabel>
                    <FormControl>
                      <DetalleOrdenInstalacionTable
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
          </Tabs>
            <DireccionForm
              selectedDireccion={selectedDireccion}
              setSelectedDireccion={setSelectedDireccion}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
