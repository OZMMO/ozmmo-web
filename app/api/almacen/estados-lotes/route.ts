import { NextResponse } from "next/server";
import { EstadoLoteModel } from "@/lib/db/almacen/estados-lote/estado-lote.model";

export async function GET(request: Request) {
  try {
    const estadoLoteModel = new EstadoLoteModel();
    const estadosLote = await estadoLoteModel.findMany();
    return NextResponse.json(estadosLote);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching estados de lotes' }, { status: 500 });
  }
}