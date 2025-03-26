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
  // Simulación de retraso de 2 segundos para simular la comunicación con la base de datos
  await new Promise((resolve) => setTimeout(resolve, 2000))

  try {
    // Aquí iría la lógica real para actualizar la base de datos
    console.log(`[SERVER] Actualizando orden ${ordenId} a estatus ${nuevoEstatusId}`)

    // Simulamos una respuesta exitosa
    return {
      success: true,
      message: `Orden ${ordenId} actualizada correctamente al estatus ${nuevoEstatusId}`,
    }
  } catch (error) {
    console.error("Error al actualizar el estatus de la orden:", error)
    return {
      success: false,
      message: "Error al actualizar el estatus de la orden",
    }
  }
}
