"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from "next/navigation"
import { Empresa } from "./columns"
import { Pencil } from "lucide-react"

const empresaFormSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  rfc: z.string().min(12, "RFC debe tener 12-13 caracteres").max(13),
  razon_social: z.string().min(1, "La razón social es requerida"),
  nombre_comercial: z.string().optional(),
  curp: z.string().length(18, "CURP debe tener 18 caracteres").optional(),
  tipo_contribuyente: z.enum(["Física", "Moral"]),
  regimen_fiscal: z.string().length(3, "Régimen fiscal debe tener 3 caracteres"),
  correo_electronico: z.string().email("Correo electrónico inválido"),
  telefono: z.string().optional(),
  representante_legal: z.string().optional(),
})

type EmpresaFormValues = z.infer<typeof empresaFormSchema>

export function EditEmpresaForm({ empresa }: { empresa: Empresa }) {
  return (
    <div className="flex items-center">
      <Pencil className="mr-2 h-4 w-4" />
      <span>Editar</span>
    </div>
  )
} 