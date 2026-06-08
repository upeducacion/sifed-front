export interface Noticia {
  id: number;
  titulo: string;
  slug: string;
  categoria: {
    id: number;
    nombre: string;
    estilo_visual: string;
  } | null;
  noticia_categoria_id: number | null;
  resumen: string | null;
  contenido: string;
  autor_nombre: string | null;
  tiempo_lectura: number | null;
  imagen_url: string | null;
  fecha_publicacion: string;
  fecha_humana: string;
  destacada: boolean;
  estado: 'borrador' | 'publicado';
  created_at?: string;
  updated_at?: string;
}

export interface NoticiaResponse {
  data: Noticia[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}
