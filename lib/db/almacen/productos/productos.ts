import { IPagination } from "@/lib/interfaces/paginations.interface";

export interface Productos extends IPagination {
  id: number;
  codigo: string;
  codigo_proveedor: string;
  descripcion: string;
  unidad_medida_id?: number;
  unidad_medida?: string;
  peso?: number;
  volumen?: number;
  fecha_registro?: Date;
  es_ensamble?: boolean;
  estatus?: boolean;
  UserId?: string;
}
