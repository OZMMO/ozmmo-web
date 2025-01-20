import { Database } from "@/database.types";

type BodegaDefault = Database['almacen']['Tables']['tbl_bodega']['Row'];

export type Bodega = BodegaDefault & {
    tbl_empresas: { codigo: string; razon_social: string } 
}

// Actualiza la función en actions.ts
