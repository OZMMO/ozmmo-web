'use server';

import { ActionState } from "@/components/crud";
import { Empresa, EmpresaModel } from "@/lib/db";

export const createServer = async (data: Empresa): Promise<ActionState<any>> => {

  const model = new EmpresaModel();
  const result = await model.create(data);

  return { data: result }; 
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