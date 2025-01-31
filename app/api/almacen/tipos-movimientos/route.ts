import { NextResponse } from "next/server";
import { TipoMovimientoModel } from "@/lib/db/almacen/tipos-movimientos/tipo-movimiento.model";

export async function GET(
  request: Request,
  { params }: { params: { SoloActivos: string, Categorias: string | undefined } }
) {
  try {
    const SoloActivos = params.SoloActivos === 'true';
    const Categorias = (params.Categorias || undefined) as string | undefined;
    const tiposMovimientos = await new TipoMovimientoModel().findMany({ SoloActivos, Categorias });

    return NextResponse.json(tiposMovimientos);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tipos de movimientos' }, { status: 500 });
  }
}