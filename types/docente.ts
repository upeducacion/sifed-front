export interface Docente {
  id: number;
  nombre_completo: string;
  slug: string;
  grados: string;
  foto_url: string | null;
  biografia?: string | null;
  cv_url?: string | null;
  categoria: string;
  estado: string;
  orden?: number;
  detalles_json?: {
    especialidades?: string[];
    enlaces_sociales?: {
      linkedin?: string;
      orcid?: string;
      scholar?: string;
    };
  };
  config_visibilidad?: {
    mostrar_cv: boolean;
    mostrar_bio: boolean;
    mostrar_redes: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedDocentes {
  current_page: number;
  data: Docente[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
