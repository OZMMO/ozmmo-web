export interface EstatusOrdenInstalacion {
  id: number;
  codigo: string;
  descripcion: string;
}

export enum EstatusOrdenInstalacionEnum {
  NUEVA = 1,
  CALENDARIZADA = 2,
  // SURTIDO_PARCIALMENTE = 3,
  SURTIDO_COMPLETO = 3,
  PENDIENTE_INSTALAR = 4,
  INSTALADA = 5
}
