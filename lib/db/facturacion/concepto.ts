import { IPagination } from "@/lib/interfaces/paginations.interface";
import { ConceptoDetalle } from "./concepto-detalle";
export interface Concepto extends IPagination {
  id: number;
  codigo: string;
  descripcion: string;
  uso_cfdi: string;
  uso_cfdi_descripcion: string;
  clave_prod_serv: string;
  prod_serv_descripcion: string;
  ClaveUnidad: string;
  unidad_nombre: string;
  ValorUnitario: number;
  ObjetoImp: string;
  objeto_imp_descripcion: string;
  Impuesto: string;
  impuesto_descripcion: string;
  TipoFactor: string;
  tipo_factor_descripcion: string;
  UserId?: string;
  detalles?: ConceptoDetalle[];
}
