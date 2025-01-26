import { IPagination } from "@/lib/interfaces/paginations.interface";
import { Direccion } from "../../sat/direcciones/direccion";

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
  direccion?: Direccion;
  UserId?: string;
}
