import api from "@/lib/api";
import { fetchPublic } from "@/lib/fetch-public";

export type Coleccion = "investigacion" | "biblioteca";

export type TipoRecurso =
  | "tesis_maestria"
  | "tesis_doctorado"
  | "articulo"
  | "libro"
  | "capitulo_libro"
  | "ponencia"
  | "informe"
  | "guia"
  | "otro";

export type RepositorioSort = "recientes" | "antiguos" | "titulo" | "descargas" | "relevancia";

export interface BibliotecaCategoria {
  id: number;
  nombre: string;
  icono?: string | null;
  orden: number;
}

export interface RecursoPrograma {
  id: number;
  slug: string;
  titulo: string;
  tipo: string;
}

export interface RecursoDocente {
  id: number;
  nombre_completo: string;
  slug: string;
  foto_url: string | null;
}

export interface Recurso {
  id: number;
  titulo: string;
  slug: string;
  descripcion?: string | null;
  archivo_url?: string | null;
  imagen_portada_url?: string | null;
  categoria_id: number;
  coleccion: Coleccion;
  tipo: TipoRecurso;
  autores: string[];
  asesor?: string | null;
  anio: number;
  palabras_clave: string[];
  idioma?: string | null;
  editorial?: string | null;
  doi?: string | null;
  url_externa?: string | null;
  programa_id?: number | null;
  licencia?: string | null;
  paginas?: number | null;
  descargas: number;
  fecha_subida: string;
  estado: "activo" | "borrador";
  orden: number;
  docente_id?: number | null;
  categoria?: BibliotecaCategoria;
  docente?: RecursoDocente | null;
  recomendador_externo?: string | null;
  programa?: RecursoPrograma | null;
}

/** @deprecated usar {@link Recurso} — se mantiene por compatibilidad con el admin existente. */
export type BibliotecaRecurso = Recurso;

export interface LaravelPaginator<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page?: number;
  from?: number | null;
  to?: number | null;
}

/** @deprecated usar {@link LaravelPaginator}. */
export type BibliotecaResponse = LaravelPaginator<Recurso>;

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface FacetAnioOption {
  value: number;
  count: number;
}

export interface FacetProgramaOption {
  id: number;
  titulo: string;
  count: number;
}

export interface FacetCategoriaOption {
  id: number;
  nombre: string;
  count: number;
}

export interface RepositorioFacets {
  coleccion: FacetOption[];
  tipo: FacetOption[];
  anio: FacetAnioOption[];
  programa: FacetProgramaOption[];
  categoria: FacetCategoriaOption[];
}

export interface RepositorioStats {
  total_obras: number;
  total_autores: number;
  total_descargas: number;
  anio_min: number;
  anio_max: number;
}

export interface RepositorioPublicResponse {
  recursos: LaravelPaginator<Recurso>;
  categorias: BibliotecaCategoria[];
  facets: RepositorioFacets;
  stats: RepositorioStats;
}

/** @deprecated usar {@link RepositorioPublicResponse}. */
export type PublicBibliotecaResponse = RepositorioPublicResponse;

export interface RepositorioDetailResponse {
  recurso: Recurso;
  relacionados: Recurso[];
}

export interface RepositorioOpciones {
  tipos: { value: string; label: string }[];
  colecciones: { value: string; label: string }[];
  programas: { id: number; titulo: string }[];
}

export interface RepositorioSearchParams {
  q?: string;
  coleccion?: Coleccion;
  tipo?: string;
  categoria_id?: number | string;
  programa_id?: number | string;
  anio_desde?: number | string;
  anio_hasta?: number | string;
  autor?: string;
  sort?: RepositorioSort;
  page?: number | string;
  per_page?: number | string;
}

function cleanParams(params?: Record<string, unknown>) {
  if (!params) return undefined;
  const cleaned: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    cleaned[key] = value as string | number | boolean;
  }
  return cleaned;
}

export const bibliotecaApi = {
  // --- Gestión de Recursos (admin) ---
  getAll: async (params?: Record<string, unknown>) => {
    const response = await api.get<LaravelPaginator<Recurso>>("/admin/biblioteca", { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Recurso>(`/admin/biblioteca/${id}`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await api.post<Recurso>("/admin/biblioteca", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id: number, data: FormData) => {
    data.append("_method", "PUT");
    const response = await api.post<Recurso>(`/admin/biblioteca/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/admin/biblioteca/${id}`);
  },

  // --- Gestión de Categorías (admin) ---
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

  /** Opciones para poblar los selects del formulario admin (tipos, colecciones, programas). */
  getOpciones: async () => {
    const response = await api.get<RepositorioOpciones>("/admin/biblioteca-opciones");
    return response.data;
  },

  /**
   * Obtener recursos para el repositorio público (con cache e ISR).
   */
  getPublic: async (params?: RepositorioSearchParams) => {
    return await fetchPublic<RepositorioPublicResponse>("portal/biblioteca", {
      params: cleanParams(params as Record<string, unknown>),
      next: { tags: ["biblioteca"] },
    });
  },

  /**
   * Obtener el detalle público de un recurso por su slug.
   */
  getPublicBySlug: async (slug: string) => {
    return await fetchPublic<RepositorioDetailResponse>(`portal/biblioteca/${slug}`, {
      next: { tags: ["biblioteca", `biblioteca:${slug}`] },
    });
  },

  /**
   * Registra una descarga/lectura (throttled en el backend). Pensado para
   * dispararse "fire-and-forget" desde el cliente antes de abrir el archivo.
   */
  registrarDescarga: async (slug: string) => {
    try {
      return await fetchPublic<{ descargas: number }>(`portal/biblioteca/${slug}/descarga`, {
        method: "POST",
      });
    } catch {
      return null;
    }
  },
};
