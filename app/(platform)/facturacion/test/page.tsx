import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import FacturacionClientPage from "./page.client";
import { auth } from "@/auth";
// import { Empresa } from "@/lib/db/catalogos/empresa.model";
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: IPageSearchPaginationParams;
}

export default async function RecepcionesPage({ searchParams }: PageProps) {
  const session = await auth();
  const userId = session?.user.id as string;

  return <FacturacionClientPage />;
}
