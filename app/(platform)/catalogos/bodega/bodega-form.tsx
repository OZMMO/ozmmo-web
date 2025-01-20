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
import { bodegaFormSchema } from "./schemas"
import { Bodega } from "@/lib/db/catalogos/bodega.model"
import { BodegaInfoExtra } from "./page.client"

type BodegaFormValues = z.infer<typeof bodegaFormSchema>

interface BodegaFormProps {
  initialData?: Bodega | null,
  infoExtra?: BodegaInfoExtra,
  onSubmit: (data: Bodega) => void
}

export function BodegaForm({ initialData,infoExtra, onSubmit }: BodegaFormProps) {
  const form = useForm<BodegaFormValues>({
    resolver: zodResolver(bodegaFormSchema),
    defaultValues: {
      codigo: initialData?.codigo || "",
      descripcion: initialData?.descripcion || "",
      empresa_id: initialData?.empresa_id || 0,
      //sucursal_id: initialData?.sucursal_id || 0,
      //esta_activo: initialData?.esta_activo || true,
     
    },
  })
console.log(form)
 // const tipoContribuyente = form.watch("tipo_contribuyente")

  const handleSubmit = (data: BodegaFormValues) => {
    const formData = {
      ...data,
      id: initialData?.id || 0,
      empresa_id: data.empresa_id ? Number(data.empresa_id) : null
    };
    onSubmit(formData as Bodega);
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
                  <Input placeholder="Ej: BOD001" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar Empresa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.catalogoEmpresas?.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id.toString() }>{empresa.codigo}-{empresa.razon_social}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          </div>
        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  )
} 