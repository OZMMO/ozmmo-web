import * as z from "zod";

export const materialProductoFormSchema = z.object({
  id: z.number().optional(),
  producto_id: z.number().int().nullable(),
  cantidad_necesaria: z.number().nullable(),
  unidad_medida_id: z.number().int().nullable(),
  nota: z.string().nullable().optional(),
  estatus: z.boolean().default(true).optional(),
  producto_parent_id: z.number().int().nullable(),
});
