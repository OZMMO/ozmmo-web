import * as z from "zod";
import { direccionSchema } from "@/lib/db/sat/direcciones/schema";

export const pedidoClienteFormSchema = z.object({
  id: z.number().optional(),
  id_cliente: z.number().int().min(1, "El cliente es requerido"),
  id_canal_venta: z.number().int().min(1, "El canal es requerido"),
  generar_factura: z.boolean().default(false),
  generar_instalacion: z.boolean().default(false),
  Notas: z.string().optional(),
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
