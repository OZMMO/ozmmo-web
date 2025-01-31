import * as z from "zod"
import { direccionSchema } from "./schema";

export type Direccion = z.infer<typeof direccionSchema> 



// export interface Direccion {
//   RandomUUID?: string;
//   Direccion: string;
//   IDPais: number;
//   Pais: string;
//   IDEstado: number;
//   Estado: string;
//   IDMunicipio: number;
//   Municipio: string;
//   IDColonia: number;
//   Colonia: string;
//   IDCodigoPostal: number;
//   CodigoPostal: string;
//   IDLocalidad: number;
//   Localidad: string;
// }
