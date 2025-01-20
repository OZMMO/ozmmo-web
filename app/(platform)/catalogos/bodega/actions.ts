'use server';

import { ActionState } from "@/components/crud";
// import { Bodega } from "@/lib/db/catalogos/bodega.model";

export const createServer = async (data: any): Promise<ActionState<any>> => {
  // const dataBodega = {
  //   codigo: data.codigo || '',
  //   descripcion: data.descripcion || '',
  //   empresa_id: data.empresa_id || 0,
  //   esta_activo: data.esta_activo || true
  // }
  // const { error } = await sql
  //   .from('almacen_tbl_bodega')
  //   .insert([dataBodega])

  // if (error) {
  //   console.error('Error:', error)
  //   return { error }
  // }

  return { data }; 
}

export const updateServer = async (data: any): Promise<ActionState<any>> => {
  // const dataBodega = {
  //   codigo: data.codigo || '',
  //   descripcion: data.descripcion || '',
  //   empresa_id: data.empresa_id || 0,
  //   esta_activo: data.esta_activo || true
  // }
  
  // const { error } = await sql
  //   .from('almacen_tbl_bodega')
  //   .update(dataBodega)
  //   .eq('id', data.id)

  // if (error) {
  //   console.error('Error:', error)
  //   return { error }
  // }

  return { data };
}

export const deleteServer = async (data: any): Promise<ActionState<any>> => {
  // const { error } = await sql
  //   .from('almacen_tbl_bodega')
  //   .delete()
  //   .eq('id', data.id)

  // if (error) {
  //   console.error('Error:', error)
  //   return { error }
  // }

  return { data }; 
}