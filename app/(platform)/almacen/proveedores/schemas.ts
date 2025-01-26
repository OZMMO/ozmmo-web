import * as z from "zod";

export const proveedoresFormSchema = z.object({
  id: z.number().optional(),
  nombre: z.string().min(1, "El nombre es requerido"),
  contacto: z.string().nullable().optional(),
  telefono: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  direccion: z.string().nullable().optional(),
  estatus: z.boolean().default(true).optional(),
});
