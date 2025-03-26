"use server";

import { ActionState } from "@/components/crud";
import { SurtidoModel } from "@/lib/db/pedidos/surtido.model";
import { OrdenInstalacion } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const surtirOrdenInstalacion = async (
  data: OrdenInstalacion
): Promise<ActionState<any>> => {
  try {
    const model = new SurtidoModel();
    const result = await model.create({
      orden_id: data.id,
      id_estatus_ordenes_instalacion:
        data.id_estatus_ordenes_instalacion || null,
      surtidos: data.surtidos || [],
      UserId: data.UserId || "",
    });
    revalidatePath(`/ventas/ordenes-instalacion/surtir/${data.id}`);
    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } };
  }
};
