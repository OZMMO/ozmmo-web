import { IPagination } from "@/lib/interfaces/paginations.interface";

export interface Ubicacion extends IPagination {
  id: number;
  codigo: string;
  descripcion: string;
  capacidad_maxima?: number;
  estado_ubicacion_id?: number;
  fecha_registro?: Date;
  estatus?: boolean;
  bodega_id?: number;
  bodega?: string;
  estado_ubicacion?: string;
  UserId?: string;
}
