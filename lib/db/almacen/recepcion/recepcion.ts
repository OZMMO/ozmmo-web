import { IPagination } from "@/lib/interfaces/paginations.interface";

export interface Recepcion extends IPagination {
  id: number;
  fecha_recepcion: Date;
  proveedor_id?: number;
  proveedor?: string;
  bodega_id?: number;
  bodega?: string;
  completado?: boolean;
  estatus?: boolean;
  fecha_registro?: Date;
  UserId?: string;
}
