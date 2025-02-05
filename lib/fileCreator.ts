import * as fs from "fs/promises";
import path from "path";
interface FileCreationOptions {
  basePath: string;
  fileName: string;
  extension: string;
  content: string;
  overwrite?: boolean;
  isBase64?: boolean;
}

export class FileCreator {
  /**
   * Crea un archivo con el contenido especificado
   * @throws Error si el archivo ya existe y overwrite es false
   */
  public static async createFile({
    basePath,
    fileName,
    extension,
    content,
    overwrite = false,
    isBase64 = false,
  }: FileCreationOptions): Promise<string> {
    try {
      await fs.mkdir(basePath, { recursive: true });

      const fullPath = path.join(basePath, `${fileName}.${extension}`);

      try {
        await fs.access(fullPath);
        if (!overwrite) {
          throw new Error(`El archivo ${fullPath} ya existe`);
        }
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          throw error;
        }
      }

      // Si es base64, decodificar antes de escribir
      if (isBase64) {
        // Remover el prefijo de data URL si existe
        const base64Data = content.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        await fs.writeFile(fullPath, buffer);
      } else {
        await fs.writeFile(fullPath, content, "utf8");
      }

      return fullPath;
    } catch (error) {
      throw new Error(`Error al crear el archivo: ${(error as Error).message}`);
    }
  }
  public static async createImageFromBase64({
    basePath,
    fileName,
    base64String,
    extension = "png",
    overwrite = false,
  }: {
    basePath: string;
    fileName: string;
    base64String: string;
    extension?: string;
    overwrite?: boolean;
  }): Promise<string> {
    return await FileCreator.createFile({
      basePath,
      fileName,
      extension,
      content: base64String,
      overwrite,
      isBase64: true,
    });
  }
}
