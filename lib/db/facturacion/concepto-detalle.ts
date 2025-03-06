export interface ConceptoDetalle {
  id?: number; // Opcional para nuevos detalles
  id_concepto?: number;
  concepto?: string; // Opcional, se puede obtener al consultar
  id_producto: number;
  producto?: string; // Opcional, se puede obtener al consultar
  cantidad: number;
}
