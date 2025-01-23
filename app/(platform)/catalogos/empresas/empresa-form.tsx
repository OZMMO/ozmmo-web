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
import { empresaFormSchema } from "./schemas"
// import DireccionForm from "@/components/direccion"
import { Direccion } from "@/lib/db/sat/direcciones/direccion"
import { useState } from "react"
import { Empresa } from "@/lib/db/catalogos/empresas/empresa"
import DireccionForm from "@/components/direccion"
import { TipoContribuyente } from "@/lib/db"
// import { Empresa } from "@/lib/db"
// import { Empresa } from "@/lib/db/catalogos/empresa.model"

type EmpresaFormValues = z.infer<typeof empresaFormSchema>

export interface InfoExtraEmpresa {
  tiposContribuyentes: TipoContribuyente[]
}

interface EmpresaFormProps {
  initialData?: Empresa | null,
  onSubmit: (data: Empresa) => void,
  infoExtra?: InfoExtraEmpresa
}

export function EmpresaForm({ initialData, onSubmit, infoExtra }: EmpresaFormProps) {
  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaFormSchema),
    defaultValues: {
      codigo: initialData?.codigo || "",
      rfc: initialData?.rfc || "",
      razon_social: initialData?.razon_social || "",
      nombre_comercial: initialData?.nombre_comercial || "",
      tipo_contribuyente_id: initialData?.tipo_contribuyente_id || undefined,
      // tipo_contribuyente: initialData?.tipo_contribuyente || undefined,
      curp: initialData?.curp || "",
      regimen_fiscal_id: initialData?.regimen_fiscal_id || undefined,
      // regimen_fiscal: initialData?.regimen_fiscal || "",
      correo_electronico: initialData?.correo_electronico || "",
      telefono: initialData?.telefono || "",
      representante_legal: initialData?.representante_legal || "",
      certificado_csd: initialData?.certificado_csd || "",
      llave_privada_csd: initialData?.llave_privada_csd || "",
      contrasena_csd: initialData?.contrasena_csd || "",
      direccion: initialData?.direccion || undefined
    },
  })

  const tipoContribuyente = form.watch("tipo_contribuyente_id")

  const [selectedDireccion, setSelectedDireccion] = useState<Direccion | null>(initialData?.direccion || null)

  const handleSubmit = (data: EmpresaFormValues) => {
    console.log({data, selectedDireccion})
    data.id = initialData?.id || 0
    data.direccion = selectedDireccion || undefined
    // if (selectedDireccion) {
    //   data.direccion = selectedDireccion
    // } else {
    //   data.direccion = null
    // }

    onSubmit(data as Empresa)
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
                  <Input placeholder="Ej: EMP001" {...field} />
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
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {infoExtra?.tiposContribuyentes.map((tipo) => (
                      <SelectItem key={tipo.id} value={tipo.id}>{tipo.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="razon_social"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razón Social</FormLabel>
              <FormControl>
                <Input placeholder="Nombre legal completo de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nombre_comercial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Comercial</FormLabel>
              <FormControl>
                <Input placeholder="Nombre comercial o de marca" {...field} />
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
              <FormControl>
                <Input placeholder="Ej: 601" maxLength={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="correo_electronico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="correo@empresa.com" {...field} />
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
          name="representante_legal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Representante Legal</FormLabel>
              <FormControl>
                <Input placeholder="Nombre completo del representante" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="certificado_csd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificado CSD</FormLabel>
              <FormControl>
                <Input placeholder="Contenido del certificado en Base64" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="llave_privada_csd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Llave Privada CSD</FormLabel>
              <FormControl>
                <Input placeholder="Contenido de la llave privada en Base64" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contrasena_csd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña CSD</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Contraseña del certificado" {...field}  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DireccionForm selectedDireccion={selectedDireccion} setSelectedDireccion={setSelectedDireccion} />

        <Button type="submit">Guardar</Button>
      </form>
    </Form>
  )
} 