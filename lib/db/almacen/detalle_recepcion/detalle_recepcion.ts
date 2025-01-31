import { IPagination } from "@/lib/interfaces/paginations.interface";

export interface DetalleRecepcion extends IPagination {
  id: number;
  recepcion_id: number;
  producto_id: number;
  producto?: string;
  cantidad: number;
  unidad_medida_id: number;
  unidad_medida?: string;
  UserId?: string;
}
