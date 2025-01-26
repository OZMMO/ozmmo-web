import * as z from "zod";

export const ubicacionesFormSchema = z.object({
  id: z.number().optional(),
  codigo: z.string().min(1, "El código es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  capacidad_maxima: z.number().nullable().optional(),
  estado_ubicacion_id: z.number().int().nullable().optional(),
  estatus: z.boolean().default(true).optional(),
  bodega_id: z.number().int().nullable().optional(),
});
