import * as z from "zod";

export const conceptoFormSchema = z.object({
  id: z.number().optional(),
  codigo: z.string().min(1, "El código es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  uso_cfdi: z.string().min(1, "El uso del CFDI es requerido"),
  clave_prod_serv: z.string().min(1, "La clave de la unidad es requerida"),
  ClaveUnidad: z.string().min(1, "El nombre de la unidad es requerido"),
  ValorUnitario: z.number().min(0, "El valor unitario debe ser mayor que 0"),
  ObjetoImp: z.string().min(1, "El objeto de impuesto es requerido"),
  Impuesto: z.string().min(1, "El impuesto es requerido"),
  TipoFactor: z.string().min(1, "El tipo de factor es requerido"),
  detalles: z.array(
    z.object({
      id_producto: z.number().min(1, "El producto es requerido"),
      cantidad: z.number().min(0, "La cantidad debe ser mayor que 0"),
    })
  ),
});
