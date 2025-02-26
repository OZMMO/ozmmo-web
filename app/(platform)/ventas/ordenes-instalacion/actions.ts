"use server";

import { ActionState } from "@/components/crud";
import { OrdenInstalacion, OrdenInstalacionModel } from "@/lib/db";

export const createOrdenInstalacion = async (
  data: OrdenInstalacion
): Promise<ActionState<OrdenInstalacion>> => {
  try {
    console.log("data", data);
    const model = new OrdenInstalacionModel();
    const result = await model.create(data);
    return { data: result };
  } catch (error: any) {
    return { error };
  }
};

export const updateOrdenInstalacion = async (
  data: OrdenInstalacion
): Promise<ActionState<OrdenInstalacion>> => {
  try {
    const model = new OrdenInstalacionModel();
    const result = await model.update(data);
    return { data: result };
  } catch (error: any) {
    return { error };
  }
};

export const deleteOrdenInstalacion = async (
  data: OrdenInstalacion
): Promise<ActionState<OrdenInstalacion>> => {
  try {
    const model = new OrdenInstalacionModel();
    const result = await model.delete(data);
    return { data: result };
  } catch (error: any) {
    return { error };
  }
};
