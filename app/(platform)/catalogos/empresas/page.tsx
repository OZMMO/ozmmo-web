import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { DataTable } from './data-table'
import { columns } from './columns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from '@/utils/supabase/server'
import { EmpresaForm } from './empresa-form'

export const dynamic = 'force-dynamic'

async function getEmpresas() {
  const supabase = await createClient()
  const { data: empresas, error } = await supabase
    .schema('catalogos')
    .from('tbl_empresas')
    .select('*')
    .order('razon_social', { ascending: true })

  if (error) {
    console.error('Error:', error)
    throw new Error('No se pudieron cargar las empresas')
  }

  return empresas
}

export default async function EmpresasPage() {
  const empresas = await getEmpresas()

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Catálogo de Empresas</CardTitle>
          <EmpresaForm />
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={empresas} />
        </CardContent>
      </Card>
    </div>
  )
}