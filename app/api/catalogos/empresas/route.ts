import { NextRequest, NextResponse } from "next/server";
import { EmpresaModel, Empresa } from "@/lib/db";
import { CriteriaSqlServer } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user.id as string;

    const id = request?.nextUrl?.searchParams.get("id");

    const empresaModel = new EmpresaModel();
    const criteria = new CriteriaSqlServer<Empresa>();
    criteria.addConditition("UserId", userId);
    const empresas = await empresaModel.findMany(criteria);

    return NextResponse.json(empresas);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching empresas" },
      { status: 500 }
    );
  }
}
