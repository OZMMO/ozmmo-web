import { IPagination } from "@/lib/interfaces/paginations.interface";
import { DetallePedido } from "./detalle-pedido";
import { Direccion } from "../sat/direcciones/direccion";

export interface Pedido extends IPagination {
  id: number;
  codigo: string;
  id_cliente: number;
  cliente?: string;
  generar_factura: boolean;
  generar_instalacion: boolean;
  Notas?: string;
  FechaHoraExpedicion?: Date;
  id_canal_venta?: number;
  canal_venta?: string;
  detalles?: DetallePedido[];
  direccion?: Direccion;
  UserId?: string;
}
