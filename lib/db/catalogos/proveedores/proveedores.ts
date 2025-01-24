import { IPagination } from "@/lib/interfaces/paginations.interface";

export interface Proveedor extends IPagination {
  id: number;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  estatus?: boolean;
  UserId?: string;
}
