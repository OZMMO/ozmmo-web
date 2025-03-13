import { NextRequest, NextResponse } from "next/server";
import { OrdenInstalacionModel, OrdenInstalacion } from "@/lib/db";
import { CriteriaSqlServer } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user.id as string;

    const id = request?.nextUrl?.searchParams.get("id");

    const ordenInstalacionModel = new OrdenInstalacionModel();
    const criteria = new CriteriaSqlServer<OrdenInstalacion>();
    criteria.addConditition("id", id);
    criteria.addConditition("UserId", userId);
    const ordenesInstalacion = await ordenInstalacionModel.findMany(criteria);

    return NextResponse.json(ordenesInstalacion);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching ordenes de instalacion" },
      { status: 500 }
    );
  }
}
