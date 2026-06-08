import api from "@/lib/api";
import { Docente } from "./docentes";
import { fetchPublic } from "@/lib/fetch-public";

export interface BibliotecaCategoria {
  id: number;
  nombre: string;
  icono?: string | null;
  orden: number;
}

export interface BibliotecaRecurso {
  id: number;
  titulo: string;
  descripcion?: string | null;
  archivo_url: string;
  imagen_portada_url?: string | null;
  categoria_id: number;
  categoria?: BibliotecaCategoria;
  docente_id?: number | null;
  docente?: Docente | null;
  recomendador_externo?: string | null;
  fecha_subida: string;
  estado: "activo" | "borrador";
  orden: number;
}

export interface BibliotecaResponse {
  data: BibliotecaRecurso[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface PublicBibliotecaResponse {
  recursos: BibliotecaResponse;
  categorias: BibliotecaCategoria[];
}

export const bibliotecaApi = {
  // --- Gestión de Recursos ---
  getAll: async (params?: Record<string, unknown>) => {
    const response = await api.get<BibliotecaResponse>("/admin/biblioteca", { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<BibliotecaRecurso>(`/admin/biblioteca/${id}`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await api.post<BibliotecaRecurso>("/admin/biblioteca", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id: number, data: FormData) => {
    data.append("_method", "PUT");
    const response = await api.post<BibliotecaRecurso>(`/admin/biblioteca/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/admin/biblioteca/${id}`);
  },

  // --- Gestión de Categorías ---
  getCategorias: async () => {
    const response = await api.get<BibliotecaCategoria[]>("/admin/biblioteca-categorias");
    return response.data;
  },

  createCategoria: async (data: Partial<BibliotecaCategoria>) => {
    const response = await api.post<BibliotecaCategoria>("/admin/biblioteca-categorias", data);
    return response.data;
  },

  updateCategoria: async (id: number, data: Partial<BibliotecaCategoria>) => {
    const response = await api.put<BibliotecaCategoria>(`/admin/biblioteca-categorias/${id}`, data);
    return response.data;
  },

  deleteCategoria: async (id: number) => {
    await api.delete(`/admin/biblioteca-categorias/${id}`);
  },

  /**
   * Obtener recursos para el portal público (con cache e ISR)
   */
  getPublic: async (params?: Record<string, unknown>) => {
    return await fetchPublic<PublicBibliotecaResponse>('portal/biblioteca', { 
      params: params as Record<string, string | number | boolean>,
      next: { tags: ['biblioteca'] }
    });
  },
};
