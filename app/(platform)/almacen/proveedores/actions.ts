"use server";

import { ActionState } from "@/components/crud";
import { Proveedor, ProveedoresModel } from "@/lib/db";

export const createProveedor = async (
  data: Proveedor
): Promise<ActionState<any>> => {
  try {
    const model = new ProveedoresModel();
    const result = await model.create(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const updateProveedor = async (
  data: Proveedor
): Promise<ActionState<any>> => {
  try {
    const model = new ProveedoresModel();
    const result = await model.update(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const deleteProveedor = async (
  data: Proveedor
): Promise<ActionState<any>> => {
  try {
    const model = new ProveedoresModel();
    const result = await model.delete(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};
