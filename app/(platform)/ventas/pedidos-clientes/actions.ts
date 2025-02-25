"use server";

import { ActionState } from "@/components/crud";
import { Pedido, PedidoModel } from "@/lib/db";

export const createPedidoCliente = async (
  data: Pedido
): Promise<ActionState<Pedido>> => {
  try {
    const model = new PedidoModel();
    const result = await model.create(data);
    return { data: result };
  } catch (error: any) {
    return { error };
  }
};

export const updatePedidoCliente = async (
  data: Pedido
): Promise<ActionState<Pedido>> => {
  try {
    const model = new PedidoModel();
    const result = await model.update(data);
    return { data: result };
  } catch (error: any) {
    return { error };
  }
};

export const deletePedidoCliente = async (
  data: Pedido
): Promise<ActionState<Pedido>> => {
  try {
    const model = new PedidoModel();
    const result = await model.delete(data);
    return { data: result };
  } catch (error: any) {
    return { error };
  }
};
