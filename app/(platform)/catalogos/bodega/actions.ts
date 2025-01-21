'use server';

import { ActionState } from "@/components/crud";
import { Bodega, BodegaModel } from "@/lib/db";
import { getConnection } from "@/lib/db";
import { sql } from "mssql";

export const createServer = async (data: Bodega): Promise<ActionState<any>> => {
  const model = new BodegaModel();  
  const result = await model.create(data);

  return { data: result }; 
}

export const updateServer = async (data: Bodega): Promise<ActionState<any>> => {
  const model = new BodegaModel();  
  const result = await model.update(data);

  return { data: result }; 
}

export const deleteServer = async (data: Bodega): Promise<ActionState<any>> => {
  const model = new BodegaModel();  
  const result = await model.delete(data);

  return { data: result }; 
}

export async function getBodegas(empresa_id: number) {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('empresa_id', sql.Int, empresa_id)  // Parametrizar correctamente
      .query(`
        SELECT 
          b.bodega_id,
          b.nombre,
          b.descripcion,
          b.activo
        FROM tbl_bodegas b
        WHERE b.empresa_id = @empresa_id
      `);

    return result.recordset;
  } catch (error) {
    console.error('Error al obtener bodegas:', error);
    throw new Error('Error al obtener las bodegas');
  }
}