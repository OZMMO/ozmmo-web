"use server";

import { ActionState } from "@/components/crud";
import { Proveedor, ProveedoresModel } from "@/lib/db";

export const createServer = async (
  data: Proveedor
): Promise<ActionState<any>> => {
  const model = new ProveedoresModel();
  const result = await model.create(data);

  return { data: result };
};

export const updateServer = async (
  data: Proveedor
): Promise<ActionState<any>> => {
  const model = new ProveedoresModel();
  const result = await model.update(data);

  return { data: result };
};

export const deleteServer = async (
  data: Proveedor
): Promise<ActionState<any>> => {
  const model = new ProveedoresModel();
  const result = await model.delete(data);

  return { data: result };
};
