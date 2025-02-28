import { z } from "zod";
import { IPagination } from "@/lib/interfaces/pagination.interface";

export interface TrazabilidadLote extends IPagination {
  id: number;
  lote_id: number;
  codigo_lote: string;
  cantidad: number;
  tipo_movimiento_id: number;
  tipo_movimiento: string;
  referencia_movimiento?: string;
  notas?: string;
  estatus: boolean;
  fecha_registro?: Date;
  cantidad_anterior: number;
  cantidad_actual: number;
}

export const trazabilidadLoteSchema = z.object({
  id: z.number().optional(),
  lote_id: z.number().optional(),
  cantidad: z.number().optional(),
  tipo_movimiento_id: z.number().optional(),
  referencia_movimiento: z.string().optional(),
  notas: z.string().optional(),
  estatus: z.boolean().optional(),
  fecha_registro: z.date().optional(),
  cantidad_anterior: z.number().optional(),
  cantidad_actual: z.number().optional(),
});
