export interface DetallePedido {
  id?: number; // Opcional para nuevos detalles
  id_pedido_cliente?: number; // Opcional, se asigna al crear el pedido
  id_concepto: number;
  concepto?: string; // Opcional, se puede obtener al consultar
  cantidad: number;
  id_ensamble?: number; // Opcional, si el detalle es un ensamble
  ensamble?: string; // Opcional, se puede obtener al consultar
  surtido?: boolean; // Opcional, indica si el detalle ha sido surtido
}
