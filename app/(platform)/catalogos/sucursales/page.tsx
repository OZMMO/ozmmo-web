'use client';

// Example usage in your page component:
import SupabaseCRUD from '@/components/supabase-crud';
import { Column as TableColumn } from '@tanstack/react-table';
import { ReactNode } from 'react';
import { Database } from "@/database.types";

// // Define your data type
// interface User {
//   id: number;
//   name: string;
//   email: string;
//   created_at: string;
// }

type Empresa = Database['catalogos']['Tables']['tbl_empresas']['Row'];

interface CustomColumn<T> {
  key: keyof T;
  label: string;
  sortable: boolean;
  render?: (value: T[keyof T]) => ReactNode;
  accessorKey?: keyof T;
}

// Define your columns
const columns: CustomColumn<Empresa>[] = [
  { key: 'id', accessorKey: 'id', label: 'ID', sortable: true },
  { key: 'codigo', accessorKey: 'codigo', label: 'Código', sortable: true },
  { key: 'razon_social', accessorKey: 'razon_social', label: 'Razón Social', sortable: true },
  { key: 'nombre_comercial', accessorKey: 'nombre_comercial', label: 'Nombre Comercial', sortable: true },
  { key: 'rfc', accessorKey: 'rfc', label: 'RFC', sortable: true },
  { key: 'correo_electronico', accessorKey: 'correo_electronico', label: 'Correo', sortable: true },
  { key: 'telefono', accessorKey: 'telefono', label: 'Teléfono', sortable: true },
  // { key: 'tipo_contribuyente', accessorKey: 'tipo_contribuyente', label: 'Tipo Contribuyente', sortable: true },
  // { key: 'regimen_fiscal', accessorKey: 'regimen_fiscal', label: 'Régimen Fiscal', sortable: true },
  { 
    key: 'fecha_registro',
    accessorKey: 'fecha_registro', 
    label: 'Fecha Registro',
    sortable: true,
    render: (value: string | number | boolean | null) => 
      value && typeof value !== 'boolean' ? new Date(value.toString()).toLocaleDateString() : ''
  },
  { key: 'estatus', accessorKey: 'estatus', label: 'Estatus', sortable: true },
];
// Your form component
const EmpresaForm = ({ 
  initialData = null, 
  onSubmit, 
  errors 
}: { 
  initialData?: Empresa | null,
  onSubmit: (data: Empresa) => void, 
  errors?: Record<string, string[]> 
}) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // Handle form submission
    }}>
      {/* Your form fields */}
    </form>
  );
};

export default function EmpresasPage() {
  return (
    <SupabaseCRUD<Empresa>
      columns={columns}
      tableName="tbl_empresas"
      schema="catalogos"
      formComponent={EmpresaForm}
      idField="id"
      searchFields={['razon_social']}
      pageSize={10}
    />
  );
}