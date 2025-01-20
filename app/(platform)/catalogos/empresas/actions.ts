'use server';

import { ActionState } from "@/components/crud";
// import { Empresa } from "@/lib/db/catalogos/empresa.model";

export const createServer = async (data: any): Promise<ActionState<any>> => {

  // if (!data.curp) {
  //   data.curp = null
  // }

  // const { error } = await sql
  //   .from('catalogos_tbl_empresas')
  //   .insert([data])

  // if (error) {
  //   console.error('Error:', error)
  //   return { error }
  // }

  return { data }; 
}

export const updateServer = async (data: any): Promise<ActionState<any>> => {

  if (!data.curp) {
    data.curp = null
  }

  // const { error } = await sql
  //   .from('catalogos_tbl_empresas')
  //   .update(data)
  //   .eq('id', data.id)

  // if (error) {
  //   console.error('Error:', error)
  //   return { error }
  // }

  return { data };
}

export const deleteServer = async (data: any): Promise<ActionState<any>> => {

  // const { error } = await sql
  //   .from('catalogos_tbl_empresas')
  //   .delete()
  //   .eq('id', data.id)

  // if (error) {
  //   console.error('Error:', error)
  //   return { error }
  // }

  return { data }; 
}