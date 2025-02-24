import { ProductosModel } from "@/lib/db/almacen/productos/productos.model";
import { Productos } from "@/lib/db/almacen/productos/productos";
import { CriteriaSqlServer } from "@/lib/db/criteria/criteria-sqlserver.model";
import { auth } from "@/auth";
import EmsamblesPageClient from "./page.client";
import { Bodega } from "@/lib/db/almacen/bodegas/bodega";
import { BodegaModel } from "@/lib/db/almacen/bodegas/bodega.model";
import { Empresa } from "@/lib/db/catalogos/empresas/empresa";
import { EmpresaModel } from "@/lib/db/catalogos/empresas/empresa.model";

export default async function EmsamblesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const criteria = new CriteriaSqlServer<Productos & { SoloEnsambles?: boolean, SoloActivos?: boolean }>();
  criteria.addConditition("SoloEnsambles", true);
  criteria.addConditition("SoloActivos", true);
  criteria.addConditition("UserId", userId);
  const productosModel = new ProductosModel();
  
  const criteriaBodega = new CriteriaSqlServer<Bodega & { SoloActivos?: boolean }>();
  criteriaBodega.addConditition("SoloActivos", true);
  criteriaBodega.addConditition("UserId", userId);
  const bodegaModel = new BodegaModel();
  
  const criteriaEmpresa = new CriteriaSqlServer<Empresa>();
  criteriaEmpresa.addConditition("UserId", userId);
  const empresaModel = new EmpresaModel();
  
  const promises = [
    productosModel.findMany(criteria),
    bodegaModel.findMany(criteriaBodega),
    empresaModel.findMany(criteriaEmpresa)
  ]
  
  const [productos, bodegas, empresas] = await Promise.all(promises);
  
  const productosData = (productos?.data || []) as Productos[];
  const bodegaData = (bodegas?.data || []) as Bodega[];
  let empresaAll = (empresas?.data || []) as Empresa[];

  const empresaData = empresaAll.filter(e => bodegaData.some(b => b.empresa_id === e.id));
  
  return (
    <EmsamblesPageClient 
      productos={productosData as Productos[]} 
      bodegas={bodegaData as Bodega[]} 
      empresas={empresaData as Empresa[]} 
    />
  );
}
