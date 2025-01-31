import * as z from "zod"
import { direccionSchema } from "@/lib/db/sat/direcciones/schema"

export const clienteFormSchema = z.object({
  id: z.number().optional(),
  codigo: z.string().min(1, "El código es requerido"),
  razon_social: z.string().min(1, "La razón social es requerida"),
  rfc: z.string().min(12, "RFC debe tener 12-13 caracteres").max(13),
  tipo_contribuyente_id: z.string().optional(),
  curp: z.string().nullable().optional(),
  regimen_fiscal_id: z.number().optional(),
  fecha_nacimiento: z.date().nullable().optional(),
  correo_electronico: z.string().email("Correo electrónico inválido"),
  telefono: z.string().optional(),
  estatus: z.boolean().optional(),
  direccion: direccionSchema.optional(),
  UserId: z.string().optional(),
})