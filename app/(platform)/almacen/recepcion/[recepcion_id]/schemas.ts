import * as z from "zod";

export const detalleRecepcionFormSchema = z.object({
  id: z.number().optional(),
  producto_id: z.number().int({ message: "El producto es requerido" }),
  cantidad: z.number({ message: "La cantidad es requerida" }),
  unidad_medida_id: z.number({ message: "La unidad de medida es requerida" }),
  recepcion_id: z.number().int({ message: "La recepción es requerida" }),
});
