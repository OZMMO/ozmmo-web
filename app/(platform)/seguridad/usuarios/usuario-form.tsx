"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "@/lib/db/security/user.model";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const usuarioSchema = z.object({
  UserId: z.string().optional(),
  Email: z.string().email("Correo electrónico inválido"),
  // PasswordHash: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional(),
  FirstName: z.string().min(1, "El primer nombre es requerido"),
  SecondName: z.string().optional(),
  LastNameFather: z.string().min(1, "El apellido paterno es requerido"),
  LastNameMother: z.string().optional(),
  RoleId: z.string().optional(),
  ImageUrl: z.string().optional(),
  IsActive: z.boolean().default(true),
});

type UsuarioFormValues = z.infer<typeof usuarioSchema>;

interface UsuarioFormProps {
  initialData?: User;
  onSubmit: (data: User) => void;
  infoExtra?: any;
}

export function UsuarioForm({ initialData, onSubmit }: UsuarioFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UsuarioFormValues>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      UserId: initialData?.UserId || "",
      Email: initialData?.Email || "",
      // PasswordHash: "",
      FirstName: initialData?.FirstName || "",
      SecondName: initialData?.SecondName || "",
      LastNameFather: initialData?.LastNameFather || "",
      LastNameMother: initialData?.LastNameMother || "",
      RoleId: initialData?.RoleId || "",
      ImageUrl: initialData?.ImageUrl || "",
      IsActive: initialData?.IsActive ?? true,
    }
  });

  const handleSubmit = async (data: UsuarioFormValues) => {
    setIsSubmitting(true);
    try {
      // Si es un nuevo usuario, generar ID y establecer contraseña temporal
      const formData = {
        ...data,
        UserId: data.UserId || uuidv4(),
        // Si es un nuevo usuario o si se cambió la contraseña
        // PasswordHash: data.PasswordHash || initialData?.PasswordHash || "",
      } as User;

      await onSubmit(formData);
      toast.success("Usuario guardado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="Email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="usuario@ejemplo.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* {!initialData && (
          <FormField
            control={form.control}
            name="PasswordHash"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input {...field} type="password" placeholder="Contraseña" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )} */}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="FirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primer Nombre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Primer nombre" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="SecondName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Segundo Nombre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Segundo nombre" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="LastNameFather"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido Paterno</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Apellido paterno" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="LastNameMother"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido Materno</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Apellido materno" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ImageUrl" 
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  {value && (
                    <img 
                      src={value}
                      alt="Avatar"
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                  <Input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          onChange(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="IsActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Usuario Activo</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Guardando..." : "Guardar Usuario"}
        </Button>
      </form>
    </Form>
  );
} 