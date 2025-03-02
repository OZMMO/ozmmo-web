"use server";

import { ActionState } from "@/components/crud";
import { MaterialProducto, MaterialProductoModel } from "@/lib/db";

export const createServer = async (
  data: MaterialProducto
): Promise<ActionState<any>> => {
  try {
    const model = new MaterialProductoModel();
    const result = await model.create(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const updateServer = async (
  data: MaterialProducto
): Promise<ActionState<any>> => {
  try {
    const model = new MaterialProductoModel();
    const result = await model.update(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const deleteServer = async (
  data: MaterialProducto
): Promise<ActionState<any>> => {
  try {
    const model = new MaterialProductoModel();
    const result = await model.delete(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};
