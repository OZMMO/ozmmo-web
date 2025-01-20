import { IPagination } from "@/lib/interfaces/paginations.interface";

export interface Empresa extends IPagination{
  id: number;
  codigo: string;
  rfc: string;
  razon_social: string;
  nombre_comercial?: string;
  curp?: string;
  correo_electronico: string;
  telefono?: string;
  representante_legal?: string;
  certificado_csd?: string;
  llave_privada_csd?: string;
  contrasena_csd?: string;
  fecha_registro?: Date;
  estatus?: boolean;
  regimen_fiscal_id?: number;
  regimen_fiscal?: string;
  UserId?: string
} 
