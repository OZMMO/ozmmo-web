import { NextRequest } from "next/server";
import { DireccionModel } from "@/lib/db/sat/direcciones/direccion.model";
import { NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  const direccion = request.nextUrl.searchParams.get('direccion');
  
  if(!direccion) return NextResponse.json({ error: 'Direccion is required' }, { status: 400 });

  const direccionModel = new DireccionModel();
  const direcciones = await direccionModel.findMany(direccion);
  return NextResponse.json(direcciones);
} 