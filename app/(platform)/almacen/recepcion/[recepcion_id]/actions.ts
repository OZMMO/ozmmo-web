"use server";

import { ActionState } from "@/components/crud";
import { DetalleRecepcion, DetalleRecepcionModel } from "@/lib/db";

export const createServer = async (
  data: DetalleRecepcion
): Promise<ActionState<any>> => {
  console.log({ data });
  const model = new DetalleRecepcionModel();
  const result = await model.create(data);

  return { data: result };
};

export const updateServer = async (
  data: DetalleRecepcion
): Promise<ActionState<any>> => {
  const model = new DetalleRecepcionModel();
  const result = await model.update(data);

  return { data: result };
};

export const deleteServer = async (
  data: DetalleRecepcion
): Promise<ActionState<any>> => {
  const model = new DetalleRecepcionModel();
  const result = await model.delete(data);

  return { data: result };
};
