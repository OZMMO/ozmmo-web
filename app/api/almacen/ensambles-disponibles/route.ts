import { EnsambleDisponibleModel } from "@/lib/db/almacen/inventario/ensambles-disponibles.model";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { EnsambleDisponible } from "@/lib/db/almacen/inventario/ensambles-disponibles";
import ICriteria from "@/lib/interfaces/criteria.interface";
import { CriteriaSqlServer } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const UserId = session?.user?.email || "";

    const { searchParams } = new URL(request.url);
    const bodega_id = searchParams.get("bodega_id");
    const producto_id = searchParams.get("producto_id");
    const ensamble_id = searchParams.get("ensamble_id");
    const numero_serie = searchParams.get("numero_serie");

    const ensamblesModel = new EnsambleDisponibleModel();

    const criteria = new CriteriaSqlServer<EnsambleDisponible>();
    criteria.addConditition("bodega_id", bodega_id ? Number(bodega_id) : 0);
    criteria.addConditition(
      "producto_id",
      producto_id ? Number(producto_id) : 0
    );
    criteria.addConditition(
      "ensamble_id",
      ensamble_id ? Number(ensamble_id) : 0
    );
    criteria.addConditition("numero_serie", numero_serie ? numero_serie : "");
    criteria.addConditition("UserId", UserId);

    const data = await ensamblesModel.findMany(criteria);
    console.log("data", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching productos disponibles", error);
    return NextResponse.json(
      { error: "Error fetching productos disponibles" },
      { status: 500 }
    );
  }
}
