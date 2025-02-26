export interface EstadoLote {
  id: number;
  nombre: string;
  descripcion: string;
  estatus: boolean;
  fecha_registro: Date;
}

export enum EstadoLoteEnum {
  ACTIVO = 1,
  BLOQUEADO = 2,
  CONSUMIDO = 3,
  VENCIDO = 4,
  DAÑADO = 5,
}