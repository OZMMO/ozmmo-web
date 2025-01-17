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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { empresaFormSchema } from "./schemas"

type EmpresaFormValues = z.infer<typeof empresaFormSchema>

interface EmpresaFormProps {
}

export function EmpresaForm() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  
  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaFormSchema),
    defaultValues: {
      codigo: "",
      rfc: "",
      razon_social: "",
      nombre_comercial: "",
      curp: null,
      tipo_contribuyente: "Física",
      regimen_fiscal: "",
      correo_electronico: "",
      telefono: "",
      representante_legal: "",
      certificado_csd: "",
      llave_privada_csd: "",
      contrasena_csd: "",
    },
  })

  const tipoContribuyente = form.watch("tipo_contribuyente")

  async function onSubmit(data: EmpresaFormValues) {
    console.log({data})
    const supabase = createClient()
    const { error } = await supabase
      .schema('catalogos')
      .from('tbl_empresas')
      .insert([data])

    if (error) {
      console.error('Error:', error)
      return
    }

    setOpen(false)
    form.reset()
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Empresa
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Crear Nueva Empresa</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                name="tipo_contribuyente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Contribuyente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Física">Física</SelectItem>
                        <SelectItem value="Moral">Moral</SelectItem>
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

            {tipoContribuyente === "Física" && (
              <FormField
                control={form.control}
                name="curp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CURP</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: XAXX010101HDFXXX01" maxLength={18} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="regimen_fiscal"
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

            <SheetFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setOpen(false)
                  form.reset()
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar Empresa</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
} 