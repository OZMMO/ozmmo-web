import * as z from "zod";

export const recepcionesFormSchema = z.object({
  id: z.number().optional(),
  fecha_recepcion: z.date({
    required_error: "La fecha y hora de recepción es requerida",
  }),
  proveedor_id: z
    .number()
    .int({
      message: "El proveedor es requerido.",
    })
    .nullable()
    .optional(),
  bodega_id: z
    .number()
    .int({
      message: "La bodega es requerida.",
    })
    .nullable()
    .optional(),
  completado: z.boolean().default(false).optional(),
  estatus: z.boolean().default(true).optional(),
});
