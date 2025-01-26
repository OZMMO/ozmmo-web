"use server";

import { ActionState } from "@/components/crud";
import { Ubicacion, UbicacionesModel } from "@/lib/db";

export const createServer = async (
  data: Ubicacion
): Promise<ActionState<any>> => {
  const model = new UbicacionesModel();
  const result = await model.create(data);

  return { data: result };
};

export const updateServer = async (
  data: Ubicacion
): Promise<ActionState<any>> => {
  const model = new UbicacionesModel();
  const result = await model.update(data);

  return { data: result };
};

export const deleteServer = async (
  data: Ubicacion
): Promise<ActionState<any>> => {
  const model = new UbicacionesModel();
  const result = await model.delete(data);

  return { data: result };
};
