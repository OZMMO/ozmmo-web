"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { 
  ArrowUpDown, 
  MoreHorizontal,
  Pencil,
  Trash2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditEmpresaForm } from "./edit-empresa-form"
import { DeleteEmpresaDialog } from "./delete-empresa-dialog"

// Definimos el tipo de datos que obtendremos de la tabla
export type Empresa = {
  id: number
  codigo: string
  rfc: string
  razon_social: string
  nombre_comercial: string | null
  curp: string | null
  tipo_contribuyente: 'Física' | 'Moral'
  regimen_fiscal: string
  correo_electronico: string
  telefono: string | null
  representante_legal: string | null
  estatus: boolean
}

export const columns: ColumnDef<Empresa>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const empresa = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <EditEmpresaForm empresa={empresa} />
            </DropdownMenuItem>
            <DeleteEmpresaDialog 
              id={empresa.id} 
              razonSocial={empresa.razon_social}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "codigo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Código
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "rfc",
    header: "RFC",
  },
  {
    accessorKey: "razon_social",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Razón Social
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "tipo_contribuyente",
    header: "Tipo",
  },
  {
    accessorKey: "estatus",
    header: "Estatus",
    cell: ({ row }) => (
      <Badge variant={row.original.estatus ? "default" : "destructive"}>
        {row.original.estatus ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
] 