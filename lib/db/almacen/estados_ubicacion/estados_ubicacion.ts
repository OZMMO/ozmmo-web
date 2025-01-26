import { IPagination } from "@/lib/interfaces/paginations.interface";

export interface EstadosUbicacion extends IPagination {
  id: number;
  descripcion: string;
  disponible?: boolean;
  estatus?: boolean;
  fecha_registro?: Date;
  UserId?: string;
}
