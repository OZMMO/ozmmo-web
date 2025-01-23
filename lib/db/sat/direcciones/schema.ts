import * as z from "zod"

export const direccionSchema = z.object({
  id: z.number(),
  random_id: z.string().nullable(),
  direccion_completa: z.string().nullable(),
  pais_id: z.number().nullable(),
  pais: z.string().nullable(),
  estado_id: z.number().nullable(),
  estado: z.string().nullable(),
  municipio_id: z.number().nullable(), 
  municipio: z.string().nullable(),
  localidad_id: z.number().nullable(),
  localidad: z.string().nullable(),
  codigo_postal_id: z.number().nullable(),
  codigo_postal: z.string().nullable(),
  colonia_id: z.number().nullable(),
  colonia: z.string().nullable(),
  calle: z.string().nullable(),
  numero_exterior: z.string().nullable(),
  numero_interior: z.string().nullable(),
  referencia: z.string().nullable(),
  referencia_tipo_id: z.string(),
  referencia_id: z.number(),
  estatus: z.boolean().nullable(),
  fecha_registro: z.date().nullable()
})
