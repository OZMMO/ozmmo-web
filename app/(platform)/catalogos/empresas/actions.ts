'use server';

import { ActionState } from "@/components/crud";
import { Empresa, EmpresaModel } from "@/lib/db";

export const createEmpresa = async (data: Empresa): Promise<ActionState<Empresa>> => {
  const model = new EmpresaModel();
  const result = await model.create(data);

  return { data: result }; 
} 

export const updateEmpresa = async (data: any): Promise<ActionState<any>> => {
  if (!data.curp) {
    data.curp = null
  }

  const model = new EmpresaModel();
  const result = await model.create(data);

  return { data: result }; 
}

export const deleteEmpresa = async (data: any): Promise<ActionState<any>> => {

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