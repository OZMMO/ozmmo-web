import { NextRequest, NextResponse } from "next/server";
import { TipoMovimientoModel } from "@/lib/db/almacen/tipos-movimientos/tipo-movimiento.model";

export async function GET(
  request: NextRequest
) {
  try {
    const SoloActivos = request?.nextUrl?.searchParams.get('SoloActivos') === 'true';
    const Categorias = (request?.nextUrl?.searchParams.get('Categorias') || undefined) as string | undefined;
    const tiposMovimientos = await new TipoMovimientoModel().findMany({ SoloActivos, Categorias });

    return NextResponse.json(tiposMovimientos);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tipos de movimientos' }, { status: 500 });
  }
}