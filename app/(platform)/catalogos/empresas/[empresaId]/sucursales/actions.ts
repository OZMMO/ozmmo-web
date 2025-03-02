"use server";

// import { Sucursal } from "@/lib/db/catalogos/sucursal.model";
import { ActionState } from "@/components/crud";
import { Sucursal, SucursalModel } from "@/lib/db";

export const createSucursal = async (
  data: Sucursal
): Promise<ActionState<any>> => {
  try {
    const model = new SucursalModel();
    if (!data.direccion) {
      data.direccion = undefined
    }
    const result = await model.create(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const updateSucursal = async (
  data: Sucursal
): Promise<ActionState<any>> => {
  try {
    const model = new SucursalModel();
    if (!data.direccion) {
      data.direccion = undefined
    }
    const result = await model.update(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};

export const deleteSucursal = async (
  data: Sucursal
): Promise<ActionState<any>> => {
  try {
    const model = new SucursalModel();
    const result = await model.delete(data);

    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};
