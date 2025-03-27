"use server";

import { auth } from "@/auth";
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
    return { error: { message: error.message, name: error.name } }
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
    return { error: { message: error.message, name: error.name } }
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
    return { error: { message: error.message, name: error.name } }
  }
};


export async function actualizarEstatusOrden(ordenId: number, nuevoEstatusId: number) {

  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    const model = new OrdenInstalacionModel();
    const result = await model.actualizarEstatus(ordenId, nuevoEstatusId, userId);

    // Simulamos una respuesta exitosa
    return {
      success: true,
      message: `Orden ${result.codigo} actualizada correctamente al estatus ${result.estatus_ordenes_instalacion}`,
    }
  } catch (error) {
    console.error("Error al actualizar el estatus de la orden:", error)
    return {
      success: false,
      message: "Error al actualizar el estatus de la orden",
    }
  }
}
