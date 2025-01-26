import * as z from "zod"

export const direccionSchema = z.object({
  id: z.number().optional(),
  random_id: z.string().optional(),
  direccion_completa: z.string().optional(),
  pais_id: z.number().optional(),
  pais: z.string().optional(),
  estado_id: z.number().optional(),
  estado: z.string().optional(),
  municipio_id: z.number().optional(), 
  municipio: z.string().optional(),
  localidad_id: z.number().optional(),
  localidad: z.string().optional(),
  codigo_postal_id: z.number().optional(),
  codigo_postal: z.string().optional(),
  colonia_id: z.number().optional(),
  colonia: z.string().optional(),
  calle: z.string().optional(),
  numero_exterior: z.string().optional(),
  numero_interior: z.string().optional(),
  referencia_tipo_id: z.string().optional(),
  referencia_id: z.number().optional(),
  estatus: z.boolean().optional(),
  fecha_registro: z.date().optional()
})
