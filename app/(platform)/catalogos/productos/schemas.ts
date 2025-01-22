import * as z from "zod";

export const productosFormSchema = z.object({
  id: z.number().optional(),
  codigo: z.string().min(1, "El código es requerido"),
  codigo_proveedor: z.string().min(1, "El código del proveedor es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  unidad_medida_id: z.number().int().nullable().optional(),
  peso: z.number().nullable().optional(),
  volumen: z.number().nullable().optional(),
  fecha_registro: z.date().nullable().optional(),
  es_ensamble: z.boolean().default(false).optional(),
  estatus: z.boolean().default(true).optional(),
});
