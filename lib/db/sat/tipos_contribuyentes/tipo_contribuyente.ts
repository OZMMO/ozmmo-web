export interface TipoContribuyente {
  id: string;
  nombre: string;
  descripcion?: string;
}


export enum TipoContribuyenteEnum {
  FISICA = 'fisica',
  MORAL = 'moral',
}
