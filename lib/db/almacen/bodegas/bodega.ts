import { IPagination } from "@/lib/interfaces/paginations.interface";
import { Empresa } from "../../catalogos/empresas/empresa";
import { Sucursal } from "../../catalogos/sucursales/sucursal";

export interface Bodega extends IPagination{
  id: number;
  codigo: string;
  descripcion: string;
  empresa_id?: number;
  empresa?: Empresa;
  sucursal_id?: number;
  sucursal?: Sucursal;
  estatus?: boolean;
  fecha_registro?: Date;
  UserId?: string
} 
