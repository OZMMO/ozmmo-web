'use server';

import { createClient } from "@/utils/supabase/server";
import { Sucursal } from "@/lib/db/catalogos/sucursal.model";
import { ActionState } from "@/components/supabase-crud";

export const createSucursal = async (data: Sucursal) : Promise<ActionState<Sucursal>> => {
  const supabase = await createClient()

  console.log({data})
  const { error } = await supabase
    .schema('catalogos')
    .from('tbl_sucursales')
    .insert([data])

  if (error) {
    console.error('Error:', error)
    return { error }
  }

  return { data }; // Return an ActionState object
}

export const updateSucursal = async (data: Sucursal) : Promise<ActionState<Sucursal>> => {
  const supabase = await createClient()

  const { error } = await supabase
    .schema('catalogos')
    .from('tbl_sucursales')
    .update(data)
    .eq('id', data.id)

  if (error) {
    console.error('Error:', error)
    return { error }
  }

  return { data }; // Return an ActionState object
}

export const deleteSucursal = async (data: Sucursal) : Promise<ActionState<Sucursal>> => {
  const supabase = await createClient()

  const { error } = await supabase
    .schema('catalogos')
    .from('tbl_sucursales')
    .delete()
    .eq('id', data.id)

  if (error) {
    console.error('Error:', error)
    return { error }
  }

  return { data };
}