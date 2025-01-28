'use server';

import { ActionState } from "@/components/crud";
import { Empresa, EmpresaModel } from "@/lib/db";

export const createEmpresa = async (data: Empresa): Promise<ActionState<Empresa>> => {
  if (!data.curp) {
    data.curp = undefined
  }

  if (!data.direccion) {
    data.direccion = undefined
  }

  try {
    const model = new EmpresaModel();
    const result = await model.create(data);

    return { data: result }; 
  } catch (error: any) {
    return { error }
  }
} 

export const updateEmpresa = async (data: Empresa): Promise<ActionState<Empresa>> => {
  if (!data.curp) {
    data.curp = undefined
  }

  if (!data.direccion) {
    data.direccion = undefined
  }

  try {
    console.log({data})
    const model = new EmpresaModel();
    const result = await model.update(data);

    return { data: result }; 
  } catch (error: any) {
    return { error}
  }
}

export const deleteEmpresa = async (data: Empresa): Promise<ActionState<Empresa>> => {

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