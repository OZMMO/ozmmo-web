import * as z from "zod"

export const bodegaFormSchema = z.object({
  id: z.number().optional(),
  codigo: z.string().min(1, "El código es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  empresa_id: z.number().int().nullable().optional(),
  empresa: z.string().optional(),
  esta_activo: z.boolean().optional(),
  sucursal_id: z.number().int().nullable().optional(),
  sucursal: z.string().optional(),
  estatus: z.boolean().default(true).optional(),
})
