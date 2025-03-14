import { IPagination } from "@/lib/interfaces/paginations.interface";
import { DetalleOrdenInstalacion } from "./detalle-orden-instalacion";
import { Direccion } from "../sat/direcciones/direccion";
import { DetalleSurtido } from "./detalle-surtido";
export interface OrdenInstalacion extends IPagination {
  id: number;
  codigo: string;
  id_pedido_cliente: number;
  pedido_codigo?: string;
  Notas?: string;
  FechaHoraInstalacion?: Date | null;
  instalador_id?: string;
  instalador_nombre_completo?: string;
  id_cliente?: number;
  cliente_razon_social?: string;
  id_estatus_ordenes_instalacion?: number | null;
  estatus_ordenes_instalacion?: string;
  detalles?: DetalleOrdenInstalacion[];
  direccion?: Direccion;
  surtidos?: DetalleSurtido[];
  UserId?: string;
}
