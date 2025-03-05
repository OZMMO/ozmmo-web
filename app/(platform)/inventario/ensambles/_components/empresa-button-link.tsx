'use client'

import { Empresa } from "@/lib/db/catalogos/empresas/empresa";
import { useRouter } from "next/navigation";

export default function EmpresaButtonLink({ empresa }: { empresa: Empresa }) {
  const router = useRouter();

  return (
    <button
      key={empresa.id}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl hover:bg-gray-300 dark:hover:bg-blue-900 transition-all duration-300 hover:scale-105 animate-fade-in-up"
      onClick={() => router.push(`/inventario/ensambles/empresas/${empresa.id}`)}
    >
      <div className="flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {empresa.nombre_comercial}
        </h2>
        
        <div className="space-y-2 text-gray-600 dark:text-gray-300 flex-grow">
          <p>
            <span className="font-medium">RFC:</span> {empresa.rfc}
          </p>
          <p>
            <span className="font-medium">Razón Social:</span> {empresa.razon_social}
          </p>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span className={`w-2 h-2 rounded-full mr-2 ${empresa.estatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
          {empresa.estatus ? 'Activa' : 'Inactiva'}
        </div>
      </div>
    </button>
  );
}