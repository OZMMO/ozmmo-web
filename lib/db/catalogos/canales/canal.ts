import { IPagination } from "@/lib/interfaces/paginations.interface";

export interface Canal extends IPagination {
  id: number;
  descripcion: string;
}
