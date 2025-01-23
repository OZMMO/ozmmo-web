import * as z from "zod"
import { direccionSchema } from "@/lib/db/sat/direcciones/schema"

export const empresaFormSchema = z.object({
  id: z.number().optional(),
  codigo: z.string().min(1, "El código es requerido"),
  rfc: z.string().min(12, "RFC debe tener 12-13 caracteres").max(13),
  razon_social: z.string().min(1, "La razón social es requerida"),
  nombre_comercial: z.string().optional(),
  tipo_contribuyente_id: z.number().optional(),
  
  curp: z.string().nullable().optional(),
  regimen_fiscal_id: z.number().optional(),
  correo_electronico: z.string().email("Correo electrónico inválido"),
  telefono: z.string().optional(),
  representante_legal: z.string().optional(),
  certificado_csd: z.string().optional(),
  llave_privada_csd: z.string().optional(),
  contrasena_csd: z.string(),
  direccion: direccionSchema.optional(),
})

