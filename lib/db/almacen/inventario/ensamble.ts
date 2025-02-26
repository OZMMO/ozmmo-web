
export interface Ensamble {
  ensamble_id: number;
  producto_id: number;
  producto?: string;
  cantidad_necesaria: number;
  unidad_medida_id: number;
  unidad_medida?: string;
  lote_id: number;
}

export interface ProductoAEnsamblar {
  id: number;
  numero_serie: string;
  producto_id: number;
  producto?: string;
  descripcion?: string;
}