"use server";

import { ActionState } from "@/components/crud";
import { Concepto, ConceptoModel } from "@/lib/db";

export const createConcepto = async (
  data: Concepto
): Promise<ActionState<Concepto>> => {
  try {
    const model = new ConceptoModel();
    const result = await model.create(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const updateConcepto = async (
  data: Concepto
): Promise<ActionState<Concepto>> => {
  try {
    console.log({ data });
    const model = new ConceptoModel();
    const result = await model.update(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const deleteConcepto = async (
  data: Concepto
): Promise<ActionState<Concepto>> => {
  try {
    const model = new ConceptoModel();
    const result = await model.delete(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }

};
