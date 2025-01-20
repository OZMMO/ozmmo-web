import { IPageSearchPaginationParams } from "@/lib/interfaces/paginations.interface";
import BodegasClientPage from "./page.client";
// import { Empresa } from "@/lib/db/catalogos/empresa.model";
export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<IPageSearchPaginationParams>;
}


export default async function BodegasPage({searchParams}: PageProps) {
  
  const dataSearchParams = await searchParams;
  const page = dataSearchParams?.page || '1';
  const pageSize = dataSearchParams?.pageSize || '10';
  const query = dataSearchParams?.query || '';
  
  // const { page = '1', pageSize = 10, query = '' } = dataSearchParams;
  const offset = (Number(page) - 1) * Number(pageSize);
  // const { data: bodegas, error, count: countData } = await sql
  //   .from('almacen_tbl_bodega')
  //     .select(`
  //       *,
  //       catalogos_tbl_empresas (
  //         codigo,
  //         razon_social
  //       )
  //     `, { count: 'exact' })
  //   .or(`descripcion.ilike.%${query}%,codigo.ilike.%${query}%`)
  //   .order('codigo', { ascending: true })
  //   .range(offset, offset + Number(pageSize) - 1)

  // const { data: empresas, error: errorEmpresas } = await sql
  //   .from('catalogos_tbl_empresas')
  //   .select('*')
  //   .filter('estatus', 'eq', true)
  //   .order('codigo', { ascending: true })
  //   .returns<Empresa[]>()

//console.log(empresas)

  // let count = countData || 0;

  // if (error) {
  //   console.error('Error fetching data:', error);
  //   return <div>Error fetching data</div>;
  // }

  // Calculate total pages by dividing total count by page size and rounding up
  // const totalPages = count <= Number(pageSize) ? 1 : Math.ceil(count / Number(pageSize));

  // return <BodegasClientPage 
  //   payload={{
  //     data: bodegas,
  //     totalCount: count || 0,
  //     totalPages: totalPages
  //   }}
  //   paginationParams={dataSearchParams}
  //   catalogoEmpresas={empresas || []}
  // />;

  return <div>Bodegas</div>;
}
