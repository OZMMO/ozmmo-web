'use server';

import { ActionState } from "@/components/supabase-crud";
import { Bodega } from "@/lib/db/catalogos/bodega.model";
import { createClient } from "@/utils/supabase/server";

export const createServer = async (data: Bodega): Promise<ActionState<Bodega>> => {
  const supabase = await createClient()
  const dataBodega = {
    codigo: data.codigo || '',
    descripcion: data.descripcion || '',
    empresa_id: data.empresa_id || 0,
    esta_activo: data.esta_activo || true
  }
  const { error } = await supabase
    .schema('almacen')
    .from('tbl_bodega')
    .insert([dataBodega])

  if (error) {
    console.error('Error:', error)
    return { error }
  }

  return { data }; 
}

export const updateServer = async (data: Bodega): Promise<ActionState<Bodega>> => {
  const supabase = await createClient()
  const dataBodega = {
    codigo: data.codigo || '',
    descripcion: data.descripcion || '',
    empresa_id: data.empresa_id || 0,
    esta_activo: data.esta_activo || true
  }
  
  const { error } = await supabase
    .schema('almacen')
    .from('tbl_bodega')
    .update(dataBodega)
    .eq('id', data.id)

  if (error) {
    console.error('Error:', error)
    return { error }
  }

  return { data };
}

export const deleteServer = async (data: Bodega): Promise<ActionState<Bodega>> => {
  const supabase = await createClient()
    
  const { error } = await supabase
    .schema('almacen')
    .from('tbl_bodega')
    .delete()
    .eq('id', data.id)

  if (error) {
    console.error('Error:', error)
    return { error }
  }

  return { data }; 
}