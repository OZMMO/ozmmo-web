"use server";

import { ActionState } from "@/components/crud";
import { MaterialProducto, MaterialProductoModel } from "@/lib/db";

export const createServer = async (
  data: MaterialProducto
): Promise<ActionState<any>> => {
  console.log({ data });
  const model = new MaterialProductoModel();
  const result = await model.create(data);

  return { data: result };
};

export const updateServer = async (
  data: MaterialProducto
): Promise<ActionState<any>> => {
  const model = new MaterialProductoModel();
  const result = await model.update(data);

  return { data: result };
};

export const deleteServer = async (
  data: MaterialProducto
): Promise<ActionState<any>> => {
  const model = new MaterialProductoModel();
  const result = await model.delete(data);

  return { data: result };
};
