
"use server";

import { ActionState } from "@/components/crud";
import { EnsambleModel } from "@/lib/db/almacen/inventario/ensamble.model";
import { Ensamble } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createEnsamble = async (data: {producto_id: number, numero_serie: string, notas: string, detalle_ensamble: Ensamble[], UserId: string}): Promise<ActionState<any>> => {
  try {
    const model = new EnsambleModel();
    const result = await model.create(data);
    revalidatePath("/inventario/ensambles");
    return { data: result };
  } catch (error) {
    return { error: error as Error };
  }
};
