"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createClient } from '@/utils/supabase/client'
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteEmpresaDialog({ 
  id, 
  razonSocial 
}: { 
  id: number
  razonSocial: string 
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function onDelete() {
    const supabase = createClient()
    
    const { error } = await supabase
      .schema('catalogos')
      .from('tbl_empresas')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error:', error)
      return
    }

    setOpen(false)
    router.refresh()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button 
          className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={(e) => 
            e.stopPropagation()
          }
        >
          <Trash2 className="mr-2 h-4 w-4 inline" />
          Eliminar
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-red-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">¿Está seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente la empresa: {razonSocial}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 