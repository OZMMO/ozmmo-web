import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import { createClient } from "@/utils/supabase/server";
import EmpresasClientPage from "./page.client";

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<IPageSearchPaginationParams>;
}
export default async function SucursalesPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const dataSearchParams = await searchParams;
  const { page = 1, pageSize = 10 } = dataSearchParams;
  const offset = (Number(page) - 1) * Number(pageSize);
  
  const { data: empresas, error, count: countData } = await supabase
    .schema('catalogos')
    .from('tbl_empresas')
    .select('*', { count: 'exact' })
    .order('razon_social', { ascending: true })
    .range(offset, offset + Number(pageSize) - 1)
  
  let count = countData || 0;

  if (error) {
    console.error('Error fetching data:', error);
    return <div>Error fetching data</div>;
  }

  // Calculate total pages by dividing total count by page size and rounding up
  const totalPages = count <= Number(pageSize) ? 1 : Math.ceil(count / Number(pageSize));

  return <EmpresasClientPage 
    payload={{
      data: empresas,
      totalCount: count || 0,
      totalPages: totalPages
    }}
    paginationParams={dataSearchParams}
  />;
}
