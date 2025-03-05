import { Productos } from "@/lib/db/almacen/productos/productos";
import { auth } from "@/auth";
import { CriteriaSqlServer } from "@/lib/db/criteria/criteria-sqlserver.model";
import { Empresa, EmpresaModel, ProductosModel } from "@/lib/db";
import EmpresaPageClient from "./page.client";

interface PageProps {
  params: {
    empresaId: string;
  };
}

export default async function EmpresaPage({ params }: PageProps) {

  const session = await auth();
  const userId = session?.user?.id;

  const criteria = new CriteriaSqlServer<Productos & { SoloEnsambles?: boolean, SoloActivos?: boolean }>();
  criteria.addConditition("SoloEnsambles", true);
  criteria.addConditition("SoloActivos", true);
  criteria.addConditition("UserId", userId);
  const productosModel = new ProductosModel();

  const criteriaEmpresa = new CriteriaSqlServer<Empresa>();
  criteriaEmpresa.addConditition("id", params.empresaId);
  criteriaEmpresa.addConditition("UserId", userId);
  const empresaModel = new EmpresaModel();

  const promises = [
    productosModel.findMany(criteria),
    empresaModel.findMany(criteriaEmpresa)
  ]
  
  const [productos, empresas] = await Promise.all(promises);
  
  const productosData = (productos?.data || []) as Productos[];
  const empresaSeleccionada = ((empresas?.data || []) as Empresa[])[0];

  return <EmpresaPageClient empresaSeleccionada={empresaSeleccionada} productos={productosData} />;
}