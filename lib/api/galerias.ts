import api from "@/lib/api";
import { fetchPublic } from "@/lib/fetch-public";

export interface GaleriaFoto {
  id: number;
  galeria_id: number;
  archivo_url: string;
  titulo_foto?: string | null;
  orden: number;
}

export interface Galeria {
  id: number;
  titulo: string;
  slug: string;
  categoria: string;
  descripcion?: string | null;
  fecha_evento: string;
  imagen_portada_url?: string | null;
  estado: "activo" | "borrador";
  orden: number;
  fotos_count?: number;
  fotos?: GaleriaFoto[];
}

export interface GaleriaResponse {
  data: Galeria[];
  current_page: number;
  last_page: number;
  total: number;
}

export const galeriasApi = {
  /**
   * Obtener todas las galerías con filtros (Portal/Admin)
   */
  getAll: async (params?: Record<string, unknown>) => {
    const response = await api.get<GaleriaResponse>("/admin/galerias", { params });
    return response.data;
  },

  /**
   * Obtener una galería por ID (Admin)
   */
  getById: async (id: number) => {
    const response = await api.get<Galeria>(`/admin/galerias/${id}`);
    return response.data;
  },

  /**
   * Crear una nueva galería
   */
  create: async (data: FormData) => {
    const response = await api.post<Galeria>("/admin/galerias", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * Actualizar una galería existente
   */
  update: async (id: number, data: FormData) => {
    // Laravel requiere _method: PUT para procesar FormData con archivos en una petición POST
    data.append("_method", "PUT");
    const response = await api.post<Galeria>(`/admin/galerias/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * Eliminar una galería
   */
  delete: async (id: number) => {
    await api.delete(`/admin/galerias/${id}`);
  },

  /**
   * Eliminar una foto individual de un álbum
   */
  removePhoto: async (fotoId: number) => {
    await api.delete(`/admin/galerias/foto/${fotoId}`);
  },

  /**
   * Actualizar prioridad de una galería
   */
  updateOrden: async (id: number, orden: number) => {
    await api.patch(`/admin/galerias/${id}/orden`, { orden });
  },

  /**
   * Obtener galería pública por slug (Portal)
   */
  getBySlug: async (slug: string) => {
    return await fetchPublic<Galeria>(`portal/galerias/${slug}`, { next: { tags: ['galerias'] } });
  },

  /**
   * Obtener todas las galerías públicas (Portal)
   */
  getPublic: async (params?: Record<string, unknown>) => {
    return await fetchPublic<GaleriaResponse>('portal/galerias', { params: params as Record<string, string | number | boolean>, next: { tags: ['galerias'] } });
  },
};
