export interface TipoMovimiento {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  estatus: boolean;
  fecha_registro: Date;
}