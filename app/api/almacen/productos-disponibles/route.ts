import { ProductosModel } from "@/lib/db/almacen/productos/productos.model";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await auth();
    const UserId = session?.user?.email || "";

  const { searchParams } = new URL(request.url);
  const bodega_id = searchParams.get("bodega_id");
  const producto_id = searchParams.get("producto_id");
  const cantidad_minima = searchParams.get("cantidad_minima");

  if (!bodega_id || !producto_id || !cantidad_minima) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  const productosModel = new ProductosModel();
  const data = await productosModel.getProductosDisponibles({ bodega_id: Number(bodega_id), producto_id: Number(producto_id), cantidad_minima: Number(cantidad_minima), UserId });

  return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching productos disponibles', error);
    return NextResponse.json({ error: 'Error fetching productos disponibles' }, { status: 500 });
  }
} 