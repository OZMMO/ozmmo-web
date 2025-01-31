import { IPagination } from "@/lib/interfaces/paginations.interface";
import { Direccion } from "../../sat/direcciones/direccion";

export interface Cliente extends IPagination{
  id: number;
  codigo: string;
  razon_social: string;
  rfc: string;
  tipo_contribuyente_id?: string;
  tipo_contribuyente?: string;
  curp?: string;
  regimen_fiscal_id?: number;
  regimen_fiscal?: string;
  fecha_nacimiento?: Date;
  correo_electronico?: string;
  telefono?: string;
  fecha_registro?: Date;
  estatus?: boolean;
  direccion?: Direccion;
  UserId?: string;
}