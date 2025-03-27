import { es } from "date-fns/locale"
import { format } from "date-fns";

// Función para formatear la fecha
export const formatearFecha = (
  fechaInput: string | Date | undefined | null
) => {
  try {
    if (!fechaInput) return "Fecha no disponible";

    const fecha = fechaInput instanceof Date ? fechaInput : new Date(fechaInput);
    return format(fecha, "dd/MM/yyyy HH:mm", { locale: es });
  } catch (error) {
    return "Fecha no disponible";
  }
};
