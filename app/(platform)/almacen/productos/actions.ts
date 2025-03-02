"use server";

import { ActionState } from "@/components/crud";
import { Productos, ProductosModel } from "@/lib/db";

export const createServer = async (
  data: Productos
): Promise<ActionState<any>> => {
  try {
    const model = new ProductosModel();
    const result = await model.create(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const updateServer = async (
  data: Productos
): Promise<ActionState<any>> => {
  try {
    const model = new ProductosModel();
    const result = await model.update(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const deleteServer = async (
  data: Productos
): Promise<ActionState<any>> => {
  try {
    const model = new ProductosModel();
    const result = await model.delete(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};
