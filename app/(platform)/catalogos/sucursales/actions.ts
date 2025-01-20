'use server';

// import { Sucursal } from "@/lib/db/catalogos/sucursal.model";
import { ActionState } from "@/components/crud";

export const createSucursal = async (data: any) : Promise<ActionState<any>> => {

  console.log({data})
  // const { error } = await sql
  //   .from('catalogos_tbl_sucursales')
  //   .insert([data])

  // if (error) {
  //   console.error('Error:', error)
  //   return { error }
  // }

  return { data }; // Return an ActionState object
}

export const updateSucursal = async (data: any) : Promise<ActionState<any>> => {
  // const { error } = await sql
  //   .from('catalogos_tbl_sucursales')
  //   .update(data)
  //   .eq('id', data.id)

  // if (error) {
  //   console.error('Error:', error)
  //   return { error }
  // }

  return { data }; // Return an ActionState object
}

export const deleteSucursal = async (data: any) : Promise<ActionState<any>> => {

  // const { error } = await sql
  //   .from('catalogos_tbl_sucursales')
  //   .delete()
  //   .eq('id', data.id)

  // if (error) {
  //   console.error('Error:', error)
  //   return { error }
  // }

  return { data };
}