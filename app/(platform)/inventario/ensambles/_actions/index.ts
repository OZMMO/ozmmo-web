
"use server";

import { ActionState } from "@/components/crud";
import { EnsambleModel } from "@/lib/db/almacen/inventario/ensamble.model";
import { Ensamble } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateEnsambleData {
  producto_id: number, 
  numero_serie: string, 
  notas: string, 
  detalle_ensamble: Ensamble[], 
  lote_id: number, 
  UserId: string
}

export const createEnsamble = async (data: CreateEnsambleData): Promise<ActionState<any>> => {  
  try {
    const model = new EnsambleModel();
    const result = await model.create(data);
    revalidatePath("/inventario/ensambles");
    return { data: result };
  } catch (error: any) {
    return { error: { message: error.message, name: error.name } }
  }
};
