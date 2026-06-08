import axios from "axios";
import Cookies from "js-cookie";
import { AUTH_COOKIE_NAME } from "@/lib/auth-config";
import { fetchPublic } from "@/lib/fetch-public";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Autoridad {
  id: string; // id temporal para uso en frontend (dnd, etc)
  nombre: string;
  cargo: string;
  foto_url?: string | null;
  resumen?: string;
  orden: number;
}

export interface DirectorioContacto {
  id: string; // id temporal
  area: string;
  telefono?: string;
  email?: string;
  anexo?: string;
  orden: number;
}

export interface UnidadPosgrado {
  id: number;
  mision: string | null;
  vision: string | null;
  historia: string | null;
  identidad_json: Record<string, unknown> | null;
  autoridades_json: Autoridad[] | null;
  directorio_json: DirectorioContacto[] | null;
  admision_json: {
    periodo_actual: string;
    whatsapp_contacto: string;
    documentos: {
      maestria: string;
      doctorado: string;
      diplomado: string;
      curso: string;
    };
  } | null;
  organigrama_url: string | null;
  video_institucional_url: string | null;
  config_visibilidad: {
    mostrar_mision?: boolean;
    mostrar_vision?: boolean;
    mostrar_autoridades?: boolean;
    mostrar_directorio?: boolean;
    mostrar_organigrama?: boolean;
  } | null;
}

const getAuthHeader = () => {
  const token = Cookies.get(AUTH_COOKIE_NAME);
  return { Authorization: `Bearer ${token}` };
};

export const unidadPosgradoApi = {
  // === PUBLIC PORTAL API ===
  getPublic: async () => {
    return await fetchPublic<UnidadPosgrado>('portal/unidad-posgrado', { next: { tags: ['unidad-posgrado'] } });
  },

  // === ADMIN API ===
  getAdmin: async () => {
    const response = await axios.get(`${API_URL}/admin/unidad-posgrado`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  update: async (formData: FormData) => {
    const response = await axios.post(`${API_URL}/admin/unidad-posgrado`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
