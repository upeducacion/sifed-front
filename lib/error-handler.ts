import { AxiosError } from 'axios';
import { ToastType } from '@/components/ui/toast';

interface ValidationErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Procesa los errores devueltos por la API (especialmente Laravel)
 * y los formatea para ser mostrados a través del hook useToast.
 * 
 * @param error El objeto de error capturado en el catch (suele ser de Axios).
 * @param showToast Función extraída de useToast() para mostrar notificaciones.
 * @param defaultMessage Mensaje genérico por si no se puede extraer uno específico.
 */
export const handleApiError = (
  error: unknown, 
  showToast: (message: string, type?: ToastType) => void,
  defaultMessage = "Ha ocurrido un error inesperado"
) => {
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status;
    const data = error.response.data as ValidationErrorResponse;

    // Error de Validación (Laravel HTTP 422)
    if (status === 422 && data.errors) {
      // Recorrer y mostrar cada error de validación
      Object.values(data.errors).forEach((errorMessages) => {
        errorMessages.forEach((msg) => {
          showToast(msg, "error");
        });
      });
      return;
    }

    // Otros errores conocidos con mensaje del servidor (401, 403, 404, 500)
    if (data.message) {
      showToast(data.message, "error");
      return;
    }
  }

  // Error de Red o error desconocido
  console.error("Uncaught API Error:", error);
  showToast(defaultMessage, "error");
};
