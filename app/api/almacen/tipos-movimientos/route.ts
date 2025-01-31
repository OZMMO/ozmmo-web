import { NextRequest, NextResponse } from "next/server";
import { TipoMovimientoModel } from "@/lib/db/almacen/tipos-movimientos/tipo-movimiento.model";

export async function GET(request: NextRequest) {
  const SoloActivos = request.nextUrl.searchParams.get('SoloActivos') === 'true';
  const Categorias = request.nextUrl.searchParams.get('Categorias') || undefined;
  const tiposMovimientos = await new TipoMovimientoModel().findMany({ SoloActivos, Categorias });

  return NextResponse.json(tiposMovimientos);
}