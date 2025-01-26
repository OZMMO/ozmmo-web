"use server";

import { ActionState } from "@/components/crud";
import { Recepcion, RecepcionModel } from "@/lib/db";

export const createServer = async (
  data: Recepcion
): Promise<ActionState<any>> => {
  const model = new RecepcionModel();
  const result = await model.create(data);

  return { data: result };
};

export const updateServer = async (
  data: Recepcion
): Promise<ActionState<any>> => {
  const model = new RecepcionModel();
  const result = await model.update(data);

  return { data: result };
};

export const deleteServer = async (
  data: Recepcion
): Promise<ActionState<any>> => {
  const model = new RecepcionModel();
  const result = await model.delete(data);

  return { data: result };
};
