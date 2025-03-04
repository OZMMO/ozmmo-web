import { IPagination } from "@/lib/interfaces/paginations.interface";
import { Direccion } from "../../sat/direcciones/direccion";

export interface Proveedor extends IPagination {
  id: number;
  codigo: string;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion?: Direccion;
  estatus?: boolean;
  UserId?: string;
}
