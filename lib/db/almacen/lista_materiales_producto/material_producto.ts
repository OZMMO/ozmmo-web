import { IPagination } from "@/lib/interfaces/paginations.interface";

export interface MaterialProducto extends IPagination {
  id: number;
  producto_parent_id: number;
  producto_id: number;
  producto?: string;
  cantidad_necesaria: number;
  unidad_medida_id: number;
  unidad_medida?: string;
  nota?: string;
  fecha_registro?: Date;
  estatus?: boolean;
  UserId?: string;
}
