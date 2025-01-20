'use server';

import { ActionState } from "@/components/supabase-crud";
import { Empresa } from "@/lib/db/catalogos/empresa.model";
import { createClient } from "@/utils/supabase/server";

export const createServer = async (data: Empresa): Promise<ActionState<Empresa>> => {
  const supabase = await createClient()

  if (!data.curp) {
    data.curp = null
  }

  const { error } = await supabase
    .from('catalogos_tbl_empresas')
    .insert([data])

  if (error) {
    console.error('Error:', error)
    return { error }
  }

  return { data }; 
}

export const updateServer = async (data: Empresa): Promise<ActionState<Empresa>> => {
  const supabase = await createClient()

  if (!data.curp) {
    data.curp = null
  }

  const { error } = await supabase
    .from('catalogos_tbl_empresas')
    .update(data)
    .eq('id', data.id)

  if (error) {
    console.error('Error:', error)
    return { error }
  }

  return { data };
}

export const deleteServer = async (data: Empresa): Promise<ActionState<Empresa>> => {
  const supabase = await createClient()
    
  const { error } = await supabase
    .from('catalogos_tbl_empresas')
    .delete()
    .eq('id', data.id)

  if (error) {
    console.error('Error:', error)
    return { error }
  }

  return { data }; 
}