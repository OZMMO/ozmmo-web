export interface EnsambleDisponible {
  id?: number;
  numero_serie?: string;
  producto_id?: number;
  producto?: string;
  lote_id?: number;
  lote?: string;
  cantidad_disponible?: number;
  ubicacion_id?: number;
  ubicacion?: string;
  bodega_id?: number;
  bodega?: string;
  UserId?: string;
}
