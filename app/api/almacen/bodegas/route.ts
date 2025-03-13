import { auth } from "@/auth";
import { Bodega } from "@/lib/db/almacen/bodegas/bodega";
import { BodegaModel } from "@/lib/db/almacen/bodegas/bodega.model";
import { CriteriaSqlServer } from "@/lib/db/criteria/criteria-sqlserver.model";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  const { searchParams } = new URL(request.url);
  const empresaId = searchParams.get("empresaId");
  const productoId = searchParams.get("productoId");
  const soloActivos = searchParams.get("soloActivos");

  console.log({ empresaId, productoId, soloActivos });

  const criteriaBodegaPorProducto = new CriteriaSqlServer<
    Bodega & { SoloActivos?: boolean; producto_id?: number }
  >();
  criteriaBodegaPorProducto.addConditition(
    "SoloActivos",
    soloActivos === "true"
  );
  criteriaBodegaPorProducto.addConditition("empresa_id", empresaId);
  criteriaBodegaPorProducto.addConditition("producto_id", productoId);
  criteriaBodegaPorProducto.addConditition("UserId", userId);

  const criteriaBodega = new CriteriaSqlServer<
    Bodega & { SoloActivos?: boolean }
  >();
  criteriaBodega.addConditition("SoloActivos", soloActivos === "true");
  criteriaBodega.addConditition("empresa_id", empresaId);
  criteriaBodega.addConditition("UserId", userId);

  const bodegaModel = new BodegaModel();

  const { data: bodegas } = productoId
    ? await bodegaModel.findManyPorProducto(criteriaBodegaPorProducto)
    : await bodegaModel.findMany(criteriaBodega);

  console.log({ bodegas });

  return NextResponse.json(bodegas);
}
