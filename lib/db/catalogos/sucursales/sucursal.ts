import { IPagination } from "@/lib/interfaces/paginations.interface";

export interface Sucursal extends IPagination {
  id: number;
  codigo: string;
  nombre: string;
  empresa_id?: number;
  empresa?: string;
  correo_electronico?: string;
  telefono?: string;
  responsable?: string;
  fecha_registro?: Date;
  estatus?: boolean;
  UserId?: string;
}
