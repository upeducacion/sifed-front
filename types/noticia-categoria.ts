import { Noticia } from "./noticia";

export interface NoticiaCategoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  orden: number;
  estilo_visual: 'green' | 'gold' | 'blue' | 'brand';
  activo: boolean;
  noticias_count?: number;
  noticias?: Noticia[];
}
