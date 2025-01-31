import { NextResponse } from "next/server";
import { DireccionModel } from "@/lib/db/sat/direcciones/direccion.model";

export async function GET(
  request: Request,
  { params }: { params: { direccion: string } }
) {
  try {
    const direccion = params.direccion;
    
    if(!direccion) return NextResponse.json({ error: 'Direccion is required' }, { status: 400 });

    const direccionModel = new DireccionModel();
    const direcciones = await direccionModel.findMany(direccion);
    return NextResponse.json(direcciones);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching direcciones' }, { status: 500 });
  }
} 