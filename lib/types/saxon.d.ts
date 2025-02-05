declare module "saxonjs-he" {
  export interface TransformOptions {
    stylesheet?: {
      documentText?: string;
      fileName?: string;
    };
    source?: {
      documentText?: string;
      fileName?: string;
    };
    destination?: string;
    resultForm?: string;
  }

  export interface TransformResult {
    principalResult: string;
    [key: string]: any;
  }

  export function transform(
    options: TransformOptions,
    operation?: string
  ): TransformResult;

  // Agregar otras funciones según necesites
  export function getResource(options: any): any;

  export function setPlatform(platform: any): void;
}
