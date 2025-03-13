export interface DetalleSurtido {
  id: number;
  id_orden_instalacion_cliente?: number;
  id_producto: number;
  producto?: string;
  es_ensamble?: boolean;
  cantidad: number;
  id_ensamble?: number;
  ensamble?: string;
  id_bodega?: number;
  bodega?: string;
  id_lote?: number;
  lote?: string;
  surtido?: boolean;
}
