import axios from "axios";
import Cookies from "js-cookie";
import { AUTH_COOKIE_NAME } from "@/lib/auth-config";
import { ProgramType, ProgramData } from "@/types/programa";
import { getStorageUrl } from "@/lib/utils";
import { ProgramaDetallesJson, ProgramaPlanEstudioJson, ProgramaConfigVisibilidad, HorarioModulo } from "@/types/admin-programa";
import { fetchPublic } from "@/lib/fetch-public";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("ADVERTENCIA: NEXT_PUBLIC_API_URL no está definida en las variables de entorno.");
}

export interface Programa {
  id: number;
  titulo: string;
  slug: string;
  tipo: ProgramType;
  descripcion_corta: string;
  imagen_portada_url: string;
  estado: string;
  orden: number;
  detalles_json: ProgramaDetallesJson;
  plan_estudio_json: ProgramaPlanEstudioJson;
  horarios_json: HorarioModulo[];
  config_visibilidad: ProgramaConfigVisibilidad;
  created_at: string;
  updated_at?: string;
}

export const mapToProgramData = (programa: Programa): ProgramData => {
  const d = programa.detalles_json || {};
  const info = d.info_general || {};

  return {
    id: programa.id,
    slug: programa.slug,
    tipo: programa.tipo,
    categoria: d.categoria || programa.tipo,
    titulo: programa.titulo,
    descripcionCorta: programa.descripcion_corta,
    imagenPortada: programa.imagen_portada_url ? getStorageUrl(programa.imagen_portada_url) : "",
    
    // Marketing & Hero
    preTitle: d.hero_pre_title || "",
    tituloHero: d.hero_titulo || programa.titulo,
    subtitleHero: d.hero_subtitle || "",
    descripcionHero: d.hero_descripcion || "",
    imagenHero: d.hero_imagen_url ? getStorageUrl(d.hero_imagen_url) : "",
    
    contenidoPreTitle: d.contenido_pre_title || "",
    contenidoTitulo: d.contenido_titulo || programa.titulo,

    infoGeneral: {
      duracion: info.duracion || "",
      modalidad: info.modalidad || "",
      certificacion: info.certificacion || "",
      totalCreditos: Number(info.totalCreditos) || 0,
    },

    acercaDe: d.acerca_de || "",
    objetivos: Array.isArray(d.objetivos) ? d.objetivos : [],
    perfilEstudiante: Array.isArray(d.perfil_estudiante) ? d.perfil_estudiante : [],
    perfilEgresado: Array.isArray(d.perfil_egresado) ? d.perfil_egresado : [],
    planEstudios: programa.plan_estudio_json?.ciclos || [],
    horarios: Array.isArray(programa.horarios_json) ? programa.horarios_json : [],
    
    certificacionDetalle: d.certificacion_detalle || "",
    admision: d.admision || undefined,
    configVisibilidad: programa.config_visibilidad || undefined,
  };
}

export const programasApi = {
  // Admin Methods
  getAll: async (params: Record<string, unknown> = {}) => {
    const token = Cookies.get(AUTH_COOKIE_NAME);
    const response = await axios.get(`${API_URL}/admin/programas`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return response.data;
  },

  getOne: async (id: string | number): Promise<Programa> => {
    const token = Cookies.get(AUTH_COOKIE_NAME);
    const response = await axios.get(`${API_URL}/admin/programas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  create: async (data: FormData) => {
    const token = Cookies.get(AUTH_COOKIE_NAME);
    const response = await axios.post(`${API_URL}/admin/programas`, data, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  update: async (id: string | number, data: FormData) => {
    const token = Cookies.get(AUTH_COOKIE_NAME);
    // Laravel bug with PUT and FormData: use POST with _method=PUT
    data.append('_method', 'PUT');
    const response = await axios.post(`${API_URL}/admin/programas/${id}`, data, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  delete: async (id: number) => {
    const token = Cookies.get(AUTH_COOKIE_NAME);
    await axios.delete(`${API_URL}/admin/programas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  toggleVisibility: async (id: number, field: string, value: boolean) => {
    const token = Cookies.get(AUTH_COOKIE_NAME);
    const response = await axios.patch(`${API_URL}/admin/programas/${id}/toggle-visibility`, {
      field,
      value
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  updateOrden: async (id: number, orden: number) => {
    const token = Cookies.get(AUTH_COOKIE_NAME);
    const response = await axios.patch(`${API_URL}/admin/programas/${id}/orden`, {
      orden
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Public Methods
  getPublicAll: async (params: Record<string, unknown> = {}) => {
    return await fetchPublic<Programa[]>('portal/programas', { params: params as Record<string, string | number | boolean>, next: { tags: ['programas'] } });
  },

  getPublicBySlug: async (slug: string): Promise<Programa> => {
    return await fetchPublic<Programa>(`portal/programas/${slug}`, { next: { tags: ['programas'] } });
  }
};
