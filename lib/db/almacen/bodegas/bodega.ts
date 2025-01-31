import { IPagination } from "@/lib/interfaces/paginations.interface";

export interface Bodega extends IPagination{
  id: number;
  codigo: string;
  descripcion: string;
  empresa_id?: number;
  empresa?: string;
  sucursal_id?: number;
  sucursal?: string;
  estatus?: boolean;
  fecha_registro?: Date;
  UserId?: string
} 
