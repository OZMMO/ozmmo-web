export interface DetalleOrdenInstalacion {
  id?: number; // Opcional para nuevos detalles
  id_orden_instalacion_cliente?: number; // Opcional, se asigna al crear la orden
  id_producto: number;
  producto?: string; // Opcional, se puede obtener al consultar
  es_ensamble?: boolean;
  cantidad: number;
  id_ensamble?: number; // Opcional, si el detalle es un ensamble
  ensamble?: string; // Opcional, se puede obtener al consultar
  surtido?: boolean; // Opcional, indica si el detalle ha sido surtido
  id_bodega?: number;
  bodega?: string;
  id_lote?: number;
  codigo_lote?: string;
  lote?: string;
}
