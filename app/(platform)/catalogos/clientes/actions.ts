'use server';

import { ActionState } from "@/components/crud";
import { Cliente, ClienteModel } from "@/lib/db";

export const createCliente = async (data: Cliente): Promise<ActionState<Cliente>> => {
  try {

    if (!data.curp) {
      data.curp = undefined
    }

    if (!data.direccion) {
      data.direccion = undefined
    }
    
    const model = new ClienteModel();
    const result = await model.create(data);

    return { data: result };
  } catch (error: any) {
    return { error };
  }
}

export const updateCliente = async (data: Cliente): Promise<ActionState<Cliente>> => {
  try {
    if (!data.curp) {
      data.curp = undefined
    }

    if (!data.direccion) {
      data.direccion = undefined
    }

    const model = new ClienteModel();
    const result = await model.update(data);
    return { data: result };
  } catch (error: any) {
    return { error };
  }
}

export const deleteCliente = async (data: Cliente): Promise<ActionState<Cliente>> => {
  return { data };
}