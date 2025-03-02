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
    return { error: { message: error.message, name: error.name } }
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
    return { error: { message: error.message, name: error.name } }
  }
}

export const deleteCliente = async (data: Cliente): Promise<ActionState<Cliente>> => {
  try {
    const model = new ClienteModel();
    const result = await model.delete(data);
    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
}