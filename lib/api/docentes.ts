import axios from "axios";
import Cookies from "js-cookie";
import { AUTH_COOKIE_NAME } from "@/lib/auth-config";
import { fetchPublic } from "@/lib/fetch-public";
import { PaginatedDocentes } from "@/types/docente";

export interface Docente {
  id: number;
  nombre_completo: string;
  slug: string;
  grados: string;
  foto_url: string | null;
  biografia?: string | null;
  cv_url?: string | null;
  categoria: string;
  especialidad?: string | null;
  estado: "activo" | "inactivo";
  orden: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("ADVERTENCIA: NEXT_PUBLIC_API_URL no está definida en las variables de entorno.");
}

const getAuthHeader = () => {
  const token = Cookies.get(AUTH_COOKIE_NAME);
  if (!token) console.warn("No se encontró token en las cookies");
  return { Authorization: `Bearer ${token}` };
};

export const docentesApi = {
  // === PUBLIC PORTAL API ===
  getPortalList: async (params = {}) => {
    return await fetchPublic<PaginatedDocentes>('portal/docentes', { 
      params: params as Record<string, string | number | boolean>,
      next: { tags: ['docentes'] }
    });
  },

  getPortalSlug: async (slug: string) => {
    return await fetchPublic<Docente>(`portal/docentes/${slug}`, { 
      next: { tags: ['docentes'] }
    });
  },

  // === ADMIN API ===
  getAll: async (params = {}) => {
    const response = await axios.get(`${API_URL}/admin/docentes`, {
      params,
      headers: getAuthHeader(),
    });
    return response.data;
  },

  getById: async (id: string | number) => {
    const response = await axios.get(`${API_URL}/admin/docentes/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await axios.post(`${API_URL}/admin/docentes`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (id: string | number, formData: FormData) => {
    formData.append("_method", "PUT");
    const response = await axios.post(`${API_URL}/admin/docentes/${id}`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await axios.delete(`${API_URL}/admin/docentes/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  toggleVisibility: async (id: string | number, field: string, value: boolean) => {
    const response = await axios.post(
      `${API_URL}/admin/docentes/${id}/toggle-visibility`,
      { field, value },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  updateOrden: async (id: string | number, orden: number) => {
    const response = await axios.patch(
      `${API_URL}/admin/docentes/${id}/orden`,
      { orden },
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};
