import * as z from "zod";
import { direccionSchema } from "@/lib/db/sat/direcciones/schema";

export const ordenInstalacionFormSchema = z.object({
  id: z.number().optional().nullable(),
  id_cliente: z.number().int().optional(),
  id_pedido_cliente: z.number().int().min(1, "El pedido es requerido"),
  id_estatus_ordenes_instalacion: z
    .number()
    .int()
    .min(1, "El estatus de la orden de instalación es requerido"),
  Notas: z.string().optional(),
  FechaHoraInstalacion: z.date({
    required_error: "La fecha y hora de instalación es requerida",
  }),
  instalador_id: z.string().optional(),
  direccion: direccionSchema.optional(),
  detalles: z
    .array(
      z.object({
        id_producto: z.number().int().min(1, "El producto es requerido"),
        cantidad: z.number().int().min(1, "La cantidad es requerida"),
      })
    )
    .optional(),
});
