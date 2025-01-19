'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/database.types';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T]) => React.ReactNode;
}

interface CRUDProps<T> {
  columns: Column<T>[];
  tableName: keyof Database[keyof Database]["Tables"] | string;
  schema?: keyof Database;
  formComponent: React.ComponentType<{
    initialData?: T | null;
    onSubmit: (data: T) => void;
    errors?: Record<string, string[]>;
  }>;
  searchable?: boolean;
  formClassName?: string;
  path?: string;
  idField: keyof T;
  searchFields?: (keyof T)[];
  redirectMode?: boolean;
  pageSize?: number;
}

export default function SupabaseCRUD<T extends Record<string, any>>({
  columns,
  tableName,
  schema,
  formComponent: FormComponent,
  searchable = true,
  formClassName,
  path,
  idField,
  searchFields = [],
  redirectMode = false,
  pageSize = 10
}: CRUDProps<T>) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [data, setData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenNew, setIsOpenNew] = useState(false);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | number | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const currentPage = Number(searchParams.get('page')) || 1;
  const query = searchParams.get('query') || '';
  const orderByColumn = searchParams.get('orderByColumn') as keyof T || idField;
  const orderDirection = (searchParams.get('orderDirection') || 'asc') as 'asc' | 'desc';

  const fetchData = async () => {
    setIsLoading(true);
    try {


  const schema = 'catalogos', tabla = 'tbl_empresas';

  const { data: empresas, error:adfsdf } = await supabase
    .schema(schema)
    .from(tableName)
    .select('*')
    .order('razon_social', { ascending: true })

      // const client = schema ? supabase.schema(schema) : supabase;
      // let query = client
      //   .from(tableName as string)
      //   .select('*', { count: 'exact' });

      let query = null;
      if (schema) {
        query = supabase.schema(schema).from('tbl_empresas').select('*', { count: 'exact' });
      } else {
        query = supabase.from(tabla).select('*', { count: 'exact' });
      }
      // Add search conditions if query exists and searchFields are provided
      if (searchParams.get('query') && searchFields.length > 0) {
        const searchConditions = searchFields.map(field => 
          `${String(field)}.ilike.%${searchParams.get('query')}%`
        );
        query = query.or(searchConditions.join(','));
      }

      // Add ordering
      query = query
        .order(String(orderByColumn), { ascending: orderDirection === 'asc' })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      const { data: results, count, error } = await query;

      if (error) throw error;

      setData(results as T[]);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, query, orderByColumn, orderDirection]);

  const handleCreate = async (formData: T) => {
    try {
      const client = schema ? supabase.schema(schema) : supabase;
      const { error } = await client
        .from(tableName as string)
        .insert([formData]);

      if (error) throw error;

      toast.success('Item created successfully!');
      setIsOpenNew(false);
      fetchData();
    } catch (error: any) {
      console.error('Error creating item:', error);
      toast.error(error.message);
      if (error.details) {
        setErrors({ ...error.details });
      }
    }
  };

  const handleUpdate = async (formData: T) => {
    try {
      const client = schema ? supabase.schema(schema) : supabase;
      const { error } = await client
        .from(tableName)
        .update(formData)
        .eq(String(idField), formData[idField]);

      if (error) throw error;

      toast.success('Item updated successfully!');
      setEditItem(null);
      fetchData();
    } catch (error: any) {
      console.error('Error updating item:', error);
      toast.error(error.message);
      if (error.details) {
        setErrors({ ...error.details });
      }
    }
  };

  const handleDelete = async (item: T) => {
    setIsDeleting(String(item[idField]));
    try {
      const client = schema ? supabase.schema(schema) : supabase;
      const { error } = await client
        .from(tableName as string)
        .delete()
        .eq(String(idField), item[idField]);

      if (error) throw error;

      toast.success('Item deleted successfully!');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast.error(error.message);
    } finally {
      setIsDeleting(null);
    }
  };

  const createQueryString = (params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });
    return newSearchParams.toString();
  };

  const onNew = () => {
    if (redirectMode) {
      router.push(`${path}/0`);
    } else {
      setIsOpenNew(true);
    }
  };

  const onEdit = (item: T) => {
    if (redirectMode) {
      router.push(`${path}/${String(item[idField])}`);
    } else {
      setEditItem(item);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const renderCellContent = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item[column.key]);
    }
    const value = item[column.key];
    if (typeof value?.toLocaleString === 'function') {
      return value.toLocaleString();
    }
    return String(value || '');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {searchable && (
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Search..."
              defaultValue={searchParams.get('query') || ''}
              onChange={(e) => {
                const query = createQueryString({
                  query: e.target.value,
                  page: 1,
                });
                router.push(`${pathname}?${query}`);
              }}
              className="max-w-sm"
            />
          </div>
        )}
        <Button variant="outline" onClick={onNew}>Add New</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={column.sortable ? 'cursor-pointer hover:bg-muted' : ''}
                  onClick={() => {
                    if (column.sortable) {
                      const query = createQueryString({
                        orderByColumn: column.key as string,
                        orderDirection: orderByColumn === column.key && orderDirection === 'asc'
                          ? 'desc'
                          : 'asc',
                      });
                      router.push(`${pathname}?${query}`);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && orderByColumn === column.key && (
                      <span>{orderDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.map((item) => (
              <TableRow key={String(item[idField])}>
                {columns.map((column) => (
                  <TableCell key={`${String(item[idField])}-${String(column.key)}`}>
                    {renderCellContent(item, column)}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this item
                            and remove its data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item)}
                            disabled={isDeleting === String(item[idField])}
                          >
                            {isDeleting === String(item[idField]) ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isOpenNew} onOpenChange={setIsOpenNew}>
        <SheetContent className={cn('w-[400px] sm:w-[540px]', formClassName)}>
          <SheetHeader>
            <SheetTitle>Add new</SheetTitle>
          </SheetHeader>
          <FormComponent
            onSubmit={handleCreate}
            errors={errors}
          />
        </SheetContent>
      </Sheet>

      <Sheet open={editItem !== null} onOpenChange={(open) => !open && setEditItem(null)}>
        <SheetContent className={cn('w-[400px] sm:w-[540px]', formClassName)}>
          <SheetHeader>
            <SheetTitle>Editing</SheetTitle>
          </SheetHeader>
          <FormComponent
            initialData={editItem}
            onSubmit={handleUpdate}
            errors={errors}
          />
        </SheetContent>
      </Sheet>

      <div className="flex items-center justify-between">
        <div>
          Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => {
              const query = createQueryString({ page: currentPage - 1 });
              router.push(`${pathname}?${query}`);
            }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => {
              const query = createQueryString({ page: currentPage + 1 });
              router.push(`${pathname}?${query}`);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}