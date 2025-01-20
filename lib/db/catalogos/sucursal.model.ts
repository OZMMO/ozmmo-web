import { Database } from "@/database.types";

type SucursalDefault = Database['catalogos']['Tables']['tbl_sucursales']['Row'];
export type Sucursal = SucursalDefault & { tbl_empresas: { codigo: string; razon_social: string } };