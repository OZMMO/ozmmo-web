import { IPagination } from "@/lib/interfaces/pagination.interface";
import { TrazabilidadLote } from "../trazabilidad-lotes/trazabilidad-lote";
import { Ubicacion } from "../ubicaciones/ubicaciones";
import { Bodega } from "../bodegas/bodega";

export interface Lote extends IPagination {
  id: number;
  codigo_lote: string;
  producto_id: number;
  producto?: string;
  fecha_fabricacion?: Date;
  fecha_expiracion?: Date;
  cantidad_inicial?: number;
  cantidad_disponible?: number;
  estado_lote_id?: number;
  estado_lote?: string;
  recepcion_id?: number;
  tipo_movimiento_id?: number;
  recepcion?: string;
  estatus?: boolean;
  ubicacion_id?: number;
  ubicacion?: Ubicacion;
  bodega_id?: number;
  bodega?: Bodega;
  UserId?: string;
  trazabilidad_lotes?: TrazabilidadLote;
}
