import { EstadoLoteModel } from "@/lib/db/almacen/estados-lote/estado-lote.model";
import { NextResponse } from "next/server";

export async function GET() {
  const estadoLoteModel = new EstadoLoteModel();
  const estadosLote = await estadoLoteModel.findMany();
  return NextResponse.json(estadosLote);
}