import { auth } from "@/auth";
import { CriteriaSqlServer, Empresa, EmpresaModel } from "@/lib/db";
import EmpresaButtonLink from "../_components/empresa-button-link";
import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: IPageSearchPaginationParams;
}

export default async function EmpresasPage({searchParams}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  const criteriaEmpresa = new CriteriaSqlServer<Empresa>();
  criteriaEmpresa.addConditition('query', searchParams.query || '');
  criteriaEmpresa.addConditition("SoloActivas", true);
  criteriaEmpresa.addConditition("UserId", userId);
  const empresaModel = new EmpresaModel();

  const { data: empresas} = await empresaModel.findMany(criteriaEmpresa);
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 animate-fade-in">
        Seleccione una Empresa
      </h1>

      <div className="mb-6">
        <form className="flex gap-2">
          <div className="flex-1">
            <input
              type="search"
              name="query"
              defaultValue={searchParams.query || ''}
              placeholder="Buscar empresas..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">Presiona Enter para buscar</p>
          </div>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empresas?.map((empresa) => (
          <EmpresaButtonLink key={empresa.id} empresa={empresa} />
        ))}
      </div>
    </div>
  );
}
