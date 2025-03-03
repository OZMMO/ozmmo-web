import * as z from "zod"

export const bodegaFormSchema = z.object({
  id: z.number().optional(),
  codigo: z.string().optional(),
  descripcion: z.string().min(1, "La descripción es requerida"),
  empresa_id: z.number().int().nullable().optional(),
  sucursal_id: z.number().int().nullable().optional(),
  estatus: z.boolean().default(true).optional(),
})
