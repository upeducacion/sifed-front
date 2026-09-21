export type EstadoDocumento = 'vigente' | 'derogado' | 'borrador';

export interface DocumentoCategoria {
  id: number;
  nombre: string;
  slug: string;
  orden: number;
  is_active: boolean;
}

export interface DocumentFolder {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  type: string | null;
  sort_order: number;
  children_count?: number;
  documents_count?: number;
}

export interface DocumentoNormativo {
  id: number;
  type: string | null;
  titulo: string;
  descripcion: string | null;
  codigo: string | null;
  documento_categoria_id: number;
  categoria?: DocumentoCategoria;
  sub_categoria: string | null;
  fecha_emision: string | null; // YYYY-MM-DD
  fecha_año: string | null; // YYYY
  archivo_path: string;
  extension_archivo: string; // pdf, docx, xlsx
  slug: string;
  folder_id?: number | null;
  folder?: Pick<DocumentFolder, 'id' | 'name' | 'parent_id'> | null;
  estado: EstadoDocumento;
  is_public: boolean;
  sustituye_a_id: number | null;
  created_at: string;
  updated_at: string;
}
