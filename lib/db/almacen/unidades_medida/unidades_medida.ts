import { IPagination } from "@/lib/interfaces/paginations.interface";

export interface UnidadesMedida extends IPagination {
  id: number;
  nombre: string;
  abreviatura: string;
  estatus?: boolean;
  fecha_registro?: Date;
  UserId?: string;
}
