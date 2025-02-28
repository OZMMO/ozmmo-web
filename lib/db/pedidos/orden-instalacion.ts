import { IPagination } from "@/lib/interfaces/paginations.interface";
import { DetalleOrdenInstalacion } from "./detalle-orden-instalacion";
import { Direccion } from "../sat/direcciones/direccion";

export interface OrdenInstalacion extends IPagination {
  id: number;
  codigo: string;
  id_pedido_cliente: number;
  pedido_codigo?: string;
  Notas?: string;
  FechaHoraInstalacion?: Date;
  instalador_id?: string;
  instalador_nombre_completo?: string;
  id_cliente?: number;
  cliente_razon_social?: string;
  detalles?: DetalleOrdenInstalacion[];
  direccion?: Direccion;
  UserId?: string;
}
