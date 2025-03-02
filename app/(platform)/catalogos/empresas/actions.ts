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
    return { error: { message: error.message, name: error.name } }
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
    const model = new EmpresaModel();
    const result = await model.update(data);

    return { data: result }; 
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
}

export const deleteEmpresa = async (data: Empresa): Promise<ActionState<Empresa>> => {
  try {
    const model = new EmpresaModel();
    const result = await model.delete(data);
    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
}