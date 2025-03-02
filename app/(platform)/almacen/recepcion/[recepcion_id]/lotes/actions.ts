"use server";

import { ActionState } from "@/components/crud";
import { Lote, LoteModel } from "@/lib/db";

export const createLote = async (data: Lote): Promise<ActionState<Lote>> => {
  try { 
    const model = new LoteModel();
    const result = await model.create(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const updateLote = async (data: Lote): Promise<ActionState<Lote>> => {
  try {
    const model = new LoteModel();
    const result = await model.update(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const deleteLote = async (data: Lote): Promise<ActionState<Lote>> => {
  try {
    const model = new LoteModel();
    const result = await model.delete(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};
