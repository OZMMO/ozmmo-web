import { NextRequest, NextResponse } from "next/server";
import { LoteModel } from "@/lib/db/almacen/lotes/lote.model";
import { Lote } from "@/lib/db/almacen/lotes/lote";
import { CriteriaSqlServer } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(  
  request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user.id as string;

    const producto_id = request?.nextUrl?.searchParams.get('producto_id');
    const recepcion_id = request?.nextUrl?.searchParams.get('recepcion_id');
    const estado_lote_id = request?.nextUrl?.searchParams.get('estado_lote_id');
    const bodega_id = request?.nextUrl?.searchParams.get('bodega_id');

    const loteModel = new LoteModel();
    const criteria = new CriteriaSqlServer<Lote>();
    criteria.addConditition('producto_id', producto_id);
    criteria.addConditition('recepcion_id', recepcion_id);
    criteria.addConditition('estado_lote_id', estado_lote_id);
    criteria.addConditition('bodega_id', bodega_id);
    criteria.addConditition('UserId', userId);
    const lotes = await loteModel.findMany(criteria);
    
    return NextResponse.json(lotes);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching lotes' }, { status: 500 });
  }
}