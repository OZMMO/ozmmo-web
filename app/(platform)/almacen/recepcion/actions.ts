"use server";

import { ActionState } from "@/components/crud";
import { Recepcion, RecepcionModel } from "@/lib/db";

export const createServer = async (
  data: Recepcion
): Promise<ActionState<any>> => {
  try {
    const model = new RecepcionModel();
    const result = await model.create(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const updateServer = async (
  data: Recepcion
): Promise<ActionState<any>> => {
  try {
    const model = new RecepcionModel();
    const result = await model.update(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const deleteServer = async (
  data: Recepcion
): Promise<ActionState<any>> => {
  try {
    const model = new RecepcionModel();
    const result = await model.delete(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};
