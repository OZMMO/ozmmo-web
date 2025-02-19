import { auth } from "@/auth";
import { CriteriaSqlServer, Ubicacion, UbicacionesModel } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest
) { 
  try {
    const session = await auth();
    const userId = session?.user.id as string;
    const bodega_id = request?.nextUrl?.searchParams.get('bodega_id')
    
    if(!bodega_id) return NextResponse.json({ error: 'Bodega is required' }, { status: 400 });

    const criteria = new CriteriaSqlServer<Ubicacion>();
    criteria.addConditition("bodega_id", bodega_id);
    criteria.addConditition("estatus", "1");
    criteria.addConditition("UserId", userId);
    const ubicaciones = await new UbicacionesModel().findMany(criteria);
    
    return NextResponse.json(ubicaciones);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error fetching ubicaciones' }, { status: 500 });
  }
}