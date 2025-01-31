'use client';

import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {clienteFormSchema} from './schemas';
import { Direccion } from '@/lib/db/sat/direcciones/direccion';
import { useEffect, useState } from 'react';
import { Cliente } from '@/lib/db/catalogos/clientes/cliente';
import DireccionForm from '@/components/direccion';
import { Empresa, TipoContribuyente } from '@/lib/db';
import { RegimenFiscal } from '@/lib/db/sat/regimenes_fiscales/regimen_fiscal';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type ClienteFormValues = z.infer<typeof clienteFormSchema>

export interface InfoExtraCliente {
  tiposContribuyentes: TipoContribuyente[]
  regimenesFiscales: RegimenFiscal[]
}

interface ClienteFormProps {
  initialData?: Cliente | null,
  onSubmit: (data: Cliente) => void,
  infoExtra?: InfoExtraCliente
}

export function ClienteForm({ initialData, onSubmit, infoExtra }: ClienteFormProps) {
  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteFormSchema),
    defaultValues: {
      id: initialData?.id || 0,
      codigo: initialData?.codigo || "",
      razon_social: initialData?.razon_social || "",
      rfc: initialData?.rfc || "",
      tipo_contribuyente_id: initialData?.tipo_contribuyente_id || undefined,
      curp: initialData?.curp || "",
      regimen_fiscal_id: initialData?.regimen_fiscal_id || undefined,
      fecha_nacimiento: initialData?.fecha_nacimiento || undefined,
      correo_electronico: initialData?.correo_electronico || "",
      telefono: initialData?.telefono || "",
      estatus: initialData?.estatus || true,
      direccion: initialData?.direccion || undefined,
      UserId: initialData?.UserId || undefined
    },
  })

  const error = form.formState.errors

  console.log(error)

  const [listaRegimenesFiscales, setListaRegimenesFiscales] = useState<RegimenFiscal[]>([])
  const tipoContribuyente = form.watch("tipo_contribuyente_id")

  const [selectedDireccion, setSelectedDireccion] = useState<Direccion | null>(initialData?.direccion || null)

  useEffect(() => {
    if (tipoContribuyente === "fisica") {
      setListaRegimenesFiscales(infoExtra?.regimenesFiscales.filter(regimen => regimen.persona_fisica) as RegimenFiscal[])
    } else {
      setListaRegimenesFiscales(infoExtra?.regimenesFiscales.filter(regimen => regimen.persona_moral) as RegimenFiscal[])
    }
  }, [tipoContribuyente])


  const handleSubmit = (data: ClienteFormValues) => {
    console.log({ data });

    data.id = initialData?.id || 0
    data.direccion = selectedDireccion || undefined

    onSubmit(data as Cliente)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
        <input type="hidden" name="id" value={initialData?.id} />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: CLI001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rfc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RFC</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: XAXX010101000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tipo_contribuyente_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Contribuyente</FormLabel>
                <Select onValueChange={(value) => field.onChange(value.toString())} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.tiposContribuyentes.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
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
            name="razon_social"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Razón Social</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {tipoContribuyente?.toString() === "fisica" && (
          <FormField
            control={form.control}
            name="curp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CURP</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ej: XAXX010101HDFXXX01" 
                    maxLength={18} 
                    {...field} 
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
          <FormField
            control={form.control}
            name="regimen_fiscal_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Régimen Fiscal</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione régimen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {listaRegimenesFiscales.map((regimen) => (
                      <SelectItem key={regimen.id} value={regimen.id.toString()}>
                        {regimen.descripcion}
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
            name="correo_electronico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
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
                  <Input {...field} />
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
        
        <DireccionForm
          selectedDireccion={selectedDireccion}
          setSelectedDireccion={setSelectedDireccion}
        />
        <div className="flex justify-end">
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  )
}