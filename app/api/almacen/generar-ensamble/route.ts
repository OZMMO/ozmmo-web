import { EnsambleModel } from "@/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const { searchParams } = new URL(request.url);
    const producto_id = searchParams.get("producto_id");
    
    if (!producto_id || !userId) {
      return new Response("Producto ID y User ID son requeridos", { status: 400 });
    }

    const ensamble = await new EnsambleModel().generarEnsamble({producto_id: parseInt(producto_id), userId: userId});
    return NextResponse.json(ensamble);
  } catch (error) {
    console.error('Error al generar ensamble:', error);
    return NextResponse.json({ error: 'Error al generar ensamble' }, { status: 500 });
  }
}
