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
import { useEffect, useState } from "react"
import { Empresa } from "@/lib/db/catalogos/empresas/empresa"
import DireccionForm from "@/components/direccion"
import { TipoContribuyente } from "@/lib/db"
import { RegimenFiscal } from "@/lib/db/sat/regimenes_fiscales/regimen_fiscal"
import { Label } from "@/components/ui/label"
import { Upload, Trash2 } from "lucide-react"
import { FormSubmit } from "@/components/form-submit"
import { Switch } from "@/components/ui/switch"
// import { Empresa } from "@/lib/db"
// import { Empresa } from "@/lib/db/catalogos/empresa.model"

export type EmpresaFormValues = z.infer<typeof empresaFormSchema>

export interface InfoExtraEmpresa {
  tiposContribuyentes: TipoContribuyente[]
  regimenesFiscales: RegimenFiscal[]
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
      codigo: initialData?.codigo || "AUTOGENERADO",
      rfc: initialData?.rfc || "",
      razon_social: initialData?.razon_social || "",
      nombre_comercial: initialData?.nombre_comercial || "",
      tipo_contribuyente_id: initialData?.tipo_contribuyente_id || undefined,
      curp: initialData?.curp || "",
      regimen_fiscal_id: initialData?.regimen_fiscal_id || undefined,
      correo_electronico: initialData?.correo_electronico || "",
      telefono: initialData?.telefono || "",
      representante_legal: initialData?.representante_legal || "",
      certificado_csd: initialData?.certificado_csd || undefined,
      llave_privada_csd: initialData?.llave_privada_csd || undefined,
      contrasena_csd: initialData?.contrasena_csd || "",
      estatus: initialData?.estatus || false,
      direccion: initialData?.direccion || undefined
    },
  })

  const { isSubmitting } = form.formState;

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

  const handleSubmit = async (data: EmpresaFormValues) => {
    try {
      data.id = initialData?.id || 0
      data.direccion = selectedDireccion || undefined

      await onSubmit(data as Empresa)
    } catch (error) {
      console.log('Error al guardar la empresa:', { error })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
        <input type="hidden" name="id" value={initialData?.id} />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            disabled={true}
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

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione régimen fiscal" />
                    </SelectTrigger>
                    <SelectContent>
                      {listaRegimenesFiscales.map((regimen) => (
                        <SelectItem 
                          key={regimen.id} 
                          value={regimen.id.toString()}
                        >
                          {regimen.descripcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
        
        <div className="grid grid-cols-2 gap-4">
          <div className="group/field grid gap-2" data-invalid={!!form.formState.errors?.certificado_csd}>
            <Label htmlFor="certificado_csd" className="group-data-[invalid=true]/field:text-destructive">
              Certificado CSD (.cer) <span aria-hidden="true">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="certificado_csd"
                name="certificado_csd"
                type="file"
                accept=".cer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const base64 = e.target?.result?.toString().split(',')[1] || '';
                      form.setValue("certificado_csd", base64);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                aria-invalid={!!form.formState.errors?.certificado_csd}
                aria-errormessage="error-certificado_csd"
              />
              <Upload className="text-muted-foreground" />
              {form.watch("certificado_csd") && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.setValue("certificado_csd", undefined)}
                  className="flex items-center gap-1 text-destructive hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
              )}
            </div>
            {form.formState.errors?.certificado_csd && (
              <p id="error-certificado_csd" className="text-destructive text-sm">
                {form.formState.errors.certificado_csd.message}
              </p>
            )}
          </div>
          <div className="group/field grid gap-2" data-invalid={!!form.formState.errors?.llave_privada_csd}>
            <Label htmlFor="llave_privada_csd" className="group-data-[invalid=true]/field:text-destructive">
              Llave Privada CSD (.key) <span aria-hidden="true">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="llave_privada_csd"
                name="llave_privada_csd"
                type="file"
                accept=".key"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const base64 = e.target?.result?.toString().split(',')[1] || '';
                      form.setValue("llave_privada_csd", base64);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="group-data-[invalid=true]/field:border-destructive focus-visible:group-data-[invalid=true]/field:ring-destructive"
                aria-invalid={!!form.formState.errors?.llave_privada_csd}
                aria-errormessage="error-llave_privada_csd"
              />
              <Upload className="text-muted-foreground" />
              {form.watch("llave_privada_csd") && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.setValue("llave_privada_csd", undefined)}
                  className="flex items-center gap-1 text-destructive hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
              )}
            </div>
            {form.formState.errors?.llave_privada_csd && (
              <p id="error-llave_privada_csd" className="text-destructive text-sm">
                {form.formState.errors.llave_privada_csd.message}
              </p>
            )}
          </div>
        </div>
              
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

        <DireccionForm selectedDireccion={selectedDireccion} setSelectedDireccion={setSelectedDireccion} />

        <FormSubmit disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar"}
        </FormSubmit>
      </form>
    </Form>
  )
} 