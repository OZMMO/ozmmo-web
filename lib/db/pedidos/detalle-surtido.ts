import { EnsambleDisponible } from "../almacen/inventario/ensambles-disponibles";
import { Lote } from "../almacen/lotes/lote";

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
  codigo_lote?: string;
  lote?: string;
  surtido?: boolean;
  ensambles_disponibles?: EnsambleDisponible[];
  lotes_disponibles?: Lote[];
}
