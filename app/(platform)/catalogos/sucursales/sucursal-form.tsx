"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sucursalSchema } from "./schema"
import { Sucursal } from "@/lib/db/catalogos/sucursal.model"
import { Empresa } from "@/lib/db/catalogos/empresa.model"
import { SucursalInfoExtra } from "./page.client"

type SucursalFormValues = z.infer<typeof sucursalSchema>

interface SucursalFormProps {
  initialData?: Sucursal | null,
  infoExtra?: SucursalInfoExtra,
  onSubmit: (data: Sucursal) => void
}

export function SucursalForm({ initialData, infoExtra, onSubmit }: SucursalFormProps) {
  const form = useForm<SucursalFormValues>({
    resolver: zodResolver(sucursalSchema),
    defaultValues: {
      empresa_id: initialData?.empresa_id || 0,
      codigo: initialData?.codigo || "",
      nombre: initialData?.nombre || "",
      telefono: initialData?.telefono || "",
      responsable: initialData?.responsable || "",
      correo_electronico: initialData?.correo_electronico || "",
      estatus: initialData?.estatus || true,
    },
  })

  const handleSubmit = (data: SucursalFormValues) => {
    console.log({data})
    data.id = initialData?.id || 0
    onSubmit(data as Sucursal)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
        <input type="hidden" name="id" value={initialData?.id} />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="codigo"
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

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="empresa_id" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.catalogoEmpresas?.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id.toString()}>{empresa.codigo}-{empresa.razon_social}</SelectItem>
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
            name="correo_electronico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="correo@sucursal.com" {...field} />
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

        <FormField
          control={form.control}
          name="estatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estatus</FormLabel>
              <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={field.value?.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estatus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  )
}