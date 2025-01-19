'use server';

import { ActionState } from "@/components/supabase-crud";
import { Empresa } from "@/lib/db/catalogos/empresa.model";
import { createClient } from "@/utils/supabase/server";
import Router from "next/router";

export const createServer = async (data: Empresa): Promise<ActionState<Empresa>> => {
  // Implement create logic
  const supabase = await createClient()

  if (!data.curp) {
    data.curp = null
  }

  const { error } = await supabase
    .schema('catalogos')
    .from('tbl_empresas')
    .insert([data])

  if (error) {
    console.error('Error:', error)
    return { error }
  }

  return { data }; // Return an ActionState object
}

export const updateServer = async (data: Empresa): Promise<ActionState<Empresa>> => {
  console.log('update', {data});

  const supabase = await createClient()

  if (!data.curp) {
    data.curp = null
  }


  const { error } = await supabase
    .schema('catalogos')
    .from('tbl_empresas')
    .update(data)
    .eq('id', data.id)

  if (error) {
    console.error('Error:', error)
    return { error }
  }

  return { data }; // Return an ActionState object
}

export const deleteServer = async (data: Empresa): Promise<ActionState<Empresa>> => {
  // Implement delete logic
  const supabase = await createClient()
    
  const { error } = await supabase
    .schema('catalogos')
    .from('tbl_empresas')
    .delete()
    .eq('id', data.id)

  if (error) {
    console.error('Error:', error)
    return { error }
  }

  return { data }; // Return an ActionState object
}