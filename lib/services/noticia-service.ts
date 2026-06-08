import api from '@/lib/api';
import { Noticia, NoticiaResponse } from '@/types/noticia';
import { NoticiaCategoria } from '@/types/noticia-categoria';
import { fetchPublic } from '@/lib/fetch-public';

// Helper para normalizar respuestas de API
function unwrapResponse<T>(response: unknown): T {
  if (
    response && 
    typeof response === 'object' && 
    'data' in response && 
    !Array.isArray(response) && 
    !('meta' in response)
  ) {
    return (response as { data: T }).data;
  }
  return response as T;
}

export const NoticiaService = {
  // Public Portal Methods
  getAllPublic: async (page = 1, categoria?: string): Promise<NoticiaResponse> => {
    const params: Record<string, string | number> = { page };
    if (categoria) params.categoria = categoria;
    const data = await fetchPublic<unknown>('portal/noticias', { params, next: { tags: ['noticias'] } });
    
    if (Array.isArray(data)) {
        return { data: data as Noticia[], meta: { current_page: 1, last_page: 1, per_page: 100, total: data.length }, links: { first: '', last: '', prev: null, next: null } };
    }
    return data as NoticiaResponse;
  },

  getBySlugPublic: async (slug: string): Promise<Noticia> => {
    const data = await fetchPublic<unknown>(`portal/noticias/${slug}`, { next: { tags: ['noticias'] } });
    return unwrapResponse<Noticia>(data);
  },

  getCategoriesWithNews: async (): Promise<NoticiaCategoria[]> => {
    return await fetchPublic<NoticiaCategoria[]>('portal/noticias-categorias', { next: { tags: ['noticias'] } });
  },

  // Admin Methods
  getAllAdmin: async (page = 1): Promise<NoticiaResponse> => {
    const { data } = await api.get<{ data: Noticia[]; meta: unknown; links: unknown }>(`/admin/noticias?page=${page}`);
    // Laravel Resource Collection devuelve { data: [], links: {}, meta: {} }
    if (data && data.data && data.meta) {
        return data as unknown as NoticiaResponse;
    }
    // Fallback si por alguna razón viene el array directo
    const rawData = data as unknown;
    if (Array.isArray(rawData)) {
        return { 
          data: rawData as Noticia[], 
          meta: { current_page: 1, last_page: 1, per_page: 100, total: rawData.length }, 
          links: { first: '', last: '', prev: null, next: null } 
        };
    }
    return data as unknown as NoticiaResponse;
  },

  getByIdAdmin: async (id: number): Promise<Noticia> => {
    const { data } = await api.get<{ data: Noticia }>(`/admin/noticias/${id}`);
    return unwrapResponse<Noticia>(data);
  },

  create: async (formData: FormData): Promise<Noticia> => {
    const { data } = await api.post<unknown>('/admin/noticias', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return unwrapResponse<Noticia>(data);
  },

  update: async (id: number, formData: FormData): Promise<Noticia> => {
    formData.append('_method', 'PUT');
    const { data } = await api.post<unknown>(`/admin/noticias/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return unwrapResponse<Noticia>(data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/noticias/${id}`);
  },

  // Category Admin Methods
  getAllCategories: async (): Promise<NoticiaCategoria[]> => {
    const response = await api.get<unknown>('/admin/noticias-categorias');
    const data = response.data;
    
    // Si es la estructura de Laravel Resource { data: [] }
    if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as Record<string, unknown>).data)) {
        return (data as { data: NoticiaCategoria[] }).data;
    }
    
    // Si es un array plano
    if (Array.isArray(data)) {
        return data as NoticiaCategoria[];
    }
    
    return [];
  },

  getCategoryById: async (id: number): Promise<NoticiaCategoria> => {
    const { data } = await api.get<unknown>(`/admin/noticias-categorias/${id}`);
    const unwrapped = unwrapResponse<NoticiaCategoria>(data);
    return unwrapped;
  },

  createCategory: async (category: Partial<NoticiaCategoria>): Promise<NoticiaCategoria> => {
    const { data } = await api.post<unknown>('/admin/noticias-categorias', category);
    return unwrapResponse<NoticiaCategoria>(data);
  },

  updateCategory: async (id: number, category: Partial<NoticiaCategoria>): Promise<NoticiaCategoria> => {
    const { data } = await api.put<unknown>(`/admin/noticias-categorias/${id}`, category);
    return unwrapResponse<NoticiaCategoria>(data);
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/admin/noticias-categorias/${id}`);
  },
};
