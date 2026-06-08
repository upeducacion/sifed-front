"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR, { useSWRConfig } from "swr";
import { NoticiaService } from "@/lib/services/noticia-service";
import { Noticia } from "@/types/noticia";
import { NoticiaCategoria } from "@/types/noticia-categoria";
import { cn } from "@/lib/utils";
import Loader from "@/components/ui/loader";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/error-handler";
import {
  Plus,
  Pencil,
  Trash2,
  Layers,
  Newspaper,
  Layout
} from "lucide-react";

export default function AdminNoticiasPage() {
  const [activeTab, setActiveTab] = useState<'noticias' | 'categorias'>('noticias');
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();
  const { mutate: globalMutate } = useSWRConfig();

  // Hook SWR 1: Paginación de Noticias con caché
  const { 
    data: noticiasResponse, 
    isLoading: loadingNoticias,
    mutate: mutateNoticias 
  } = useSWR(
    ['/admin/noticias', currentPage],
    () => NoticiaService.getAllAdmin(currentPage),
    { keepPreviousData: true }
  );

  // Hook SWR 2: Listado de Categorías
  const { 
    data: categorias = [], 
    isLoading: loadingCategorias,
    mutate: mutateCategorias
  } = useSWR(
    '/admin/noticias-categorias',
    NoticiaService.getAllCategories
  );

  const loading = loadingNoticias || loadingCategorias;
  const noticias = noticiasResponse?.data || [];
  const meta = noticiasResponse?.meta || null;

  const handleDeleteNoticia = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta noticia?")) {
      // 1. Mutación Optimista (UI se actualiza instantáneamente)
      const optimisticData = {
        ...noticiasResponse,
        data: noticias.filter((n: Noticia) => n.id !== id)
      };
      // @ts-expect-error ignoramos tipado complejo de SWR en optimismo
      mutateNoticias(optimisticData, false);

      try {
        // 2. Petición real
        await NoticiaService.delete(id);
        showToast("Crónica eliminada exitosamente", "success");
        // 3. Revalidar con el servidor (en caso de que la paginación haya cambiado drásticamente)
        mutateNoticias();
      } catch (error) {
        // 4. Rollback en caso de error
        mutateNoticias();
        handleApiError(error, showToast, "Error al eliminar noticia");
      }
    }
  };

  const handleDeleteCategoria = async (cat: NoticiaCategoria) => {
    if (confirm(`¿Estás seguro de eliminar la categoría "${cat.nombre}"?`)) {
      const optimisticCategorias = categorias.filter((c: NoticiaCategoria) => c.id !== cat.id);
      mutateCategorias(optimisticCategorias, false);

      try {
        await NoticiaService.deleteCategory(cat.id);
        showToast("Sección eliminada exitosamente", "success");
        mutateCategorias();
        // Si eliminamos una categoría, la data de noticias de la vista pública en SWR se podría ver afectada, revalidamos:
        globalMutate('/portal/noticias-categorias'); 
      } catch (error) {
        mutateCategorias();
        handleApiError(error, showToast, "Error al eliminar categoría");
      }
    }
  };

  if (loading && (!noticias.length && !categorias.length)) {
    return <Loader text="Cargando gestión editorial..." size="lg" />;
  }

  return (
    <div className="space-y-8">
      {/* HEADER DINÁMICO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-serif font-black text-brand-950 tracking-tight">Gestión Editorial</h2>
          <p className="text-sm text-muted-foreground font-medium">Control maestro de noticias y secciones del portal.</p>
        </div>
        
        <div className="flex items-center gap-3">
            {activeTab === 'noticias' ? (
                <Link 
                    href="/admin/portal/noticias/nuevo" 
                    className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2.5 rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 font-bold text-sm"
                >
                    <Plus className="h-4 w-4" /> Nueva Crónica
                </Link>
            ) : (
                <Link 
                    href="/admin/portal/noticias/secciones/nueva" 
                    className="flex items-center gap-2 bg-brand-950 text-white px-6 py-2.5 rounded-xl hover:bg-black transition-all shadow-lg shadow-black/20 font-bold text-sm"
                >
                    <Plus className="h-4 w-4" /> Nueva Sección
                </Link>
            )}
        </div>
      </div>

      {/* TABS EDITORIALES */}
      <div className="flex items-center gap-1 bg-brand-50 p-1.5 rounded-2xl w-fit border border-brand-100/50">
        <button
          onClick={() => setActiveTab('noticias')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
            activeTab === 'noticias' 
              ? "bg-white text-brand-600 shadow-sm border border-brand-100" 
              : "text-brand-950/40 hover:text-brand-950"
          )}
        >
          <Newspaper className="h-4 w-4" /> Crónicas
        </button>
        <button
          onClick={() => setActiveTab('categorias')}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all",
            activeTab === 'categorias' 
              ? "bg-white text-brand-600 shadow-sm border border-brand-100" 
              : "text-brand-950/40 hover:text-brand-950"
          )}
        >
          <Layers className="h-4 w-4" /> Secciones (Exhibición)
        </button>
      </div>

      {activeTab === 'noticias' ? (
        /* VISTA: LISTADO DE NOTICIAS */
        <div className="bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden relative min-h-[400px]">
            {loadingNoticias && noticias.length > 0 && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <Loader text="Actualizando grilla..." size="sm" fullHeight={false} />
                </div>
            )}
            <table className="w-full text-sm text-left">
                <thead className="bg-brand-50/50 text-brand-950/40 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                        <th className="px-8 py-5">Título de la Crónica</th>
                        <th className="px-6 py-5">Sección</th>
                        <th className="px-6 py-5">Publicación</th>
                        <th className="px-6 py-5 text-center">Estado</th>
                        <th className="px-6 py-5 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                    {noticias.length > 0 ? noticias.map((noticia: Noticia) => (
                        <tr key={noticia.id} className="hover:bg-brand-50/20 transition-colors group">
                            <td className="px-8 py-5 font-bold text-brand-950 max-w-md truncate">
                                {noticia.titulo}
                            </td>
                            <td className="px-6 py-5">
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border",
                                    noticia.categoria?.estilo_visual === 'gold' ? "bg-uncp-gold/5 text-uncp-gold border-uncp-gold/20" :
                                    noticia.categoria?.estilo_visual === 'blue' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                    noticia.categoria?.estilo_visual === 'green' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                    noticia.categoria?.estilo_visual === 'brand' ? "bg-brand-50 text-brand-600 border-brand-100" :
                                    "bg-neutral-50 text-neutral-600 border-neutral-100"
                                )}>
                                    {noticia.categoria?.nombre || "Sin sección"}
                                </span>
                            </td>
                            <td className="px-6 py-5 text-brand-950/40 font-medium">
                                {noticia.fecha_humana}
                            </td>
                            <td className="px-6 py-5 text-center">
                                <span className={cn(
                                    "inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                    noticia.estado === 'publicado' 
                                        ? 'bg-green-50 text-green-600 border border-green-100' 
                                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                                )}>
                                    {noticia.estado}
                                </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link 
                                        href={`/admin/portal/noticias/${noticia.id}`}
                                        className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                    <button 
                                        onClick={() => handleDeleteNoticia(noticia.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="px-8 py-12 text-center text-muted-foreground font-medium">
                                <div className="flex flex-col items-center gap-2">
                                    <Newspaper className="h-8 w-8 opacity-20" />
                                    <p>No se encontraron crónicas publicadas.</p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* PAGINACIÓN */}
            {meta && (meta.last_page > 1 || meta.total > 10) && (
                <div className="px-8 py-4 bg-brand-50/30 border-t border-brand-50 flex items-center justify-between">
                    <p className="text-xs text-brand-950/40 font-bold uppercase tracking-widest">
                        Página {meta.current_page} de {meta.last_page}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1 || loadingNoticias}
                            className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-white border border-brand-100 rounded-xl disabled:opacity-30 hover:bg-brand-50 transition-colors"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(meta.last_page, prev + 1))}
                            disabled={currentPage === meta.last_page || loadingNoticias}
                            className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-white border border-brand-100 rounded-xl disabled:opacity-30 hover:bg-brand-50 transition-colors"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
      ) : (
        /* VISTA: GESTIÓN DE CATEGORÍAS */
        <div className="bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden relative min-h-[400px]">
            {loadingCategorias && categorias.length > 0 && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <Loader text="Actualizando..." size="sm" fullHeight={false} />
                </div>
            )}
            <table className="w-full text-sm text-left">
                <thead className="bg-brand-50/50 text-brand-950/40 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                        <th className="px-8 py-5">Orden</th>
                        <th className="px-6 py-5">Nombre de la Sección</th>
                        <th className="px-6 py-5">Estilo Visual</th>
                        <th className="px-6 py-5 text-center">Noticias</th>
                        <th className="px-6 py-5 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                    {categorias.map((cat: NoticiaCategoria) => (
                        <tr key={cat.id} className="hover:bg-brand-50/20 transition-colors group">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                    <Layout className="h-3 w-3 text-brand-950/20" />
                                    <span className="font-black text-brand-950">{cat.orden}</span>
                                </div>
                            </td>
                            <td className="px-6 py-5 font-bold text-brand-950">
                                {cat.nombre}
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "h-3 w-3 rounded-full border border-black/10",
                                        cat.estilo_visual === 'gold' ? 'bg-uncp-gold' :
                                        cat.estilo_visual === 'green' ? 'bg-uncp-green' :
                                        cat.estilo_visual === 'blue' ? 'bg-blue-600' : 'bg-brand-800'
                                    )} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-950/40">
                                        {cat.estilo_visual}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center font-black text-brand-600">
                                {cat.noticias_count || 0}
                            </td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link 
                                        href={`/admin/portal/noticias/secciones/${cat.id}`}
                                        className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                    <button 
                                        onClick={() => handleDeleteCategoria(cat)}
                                        className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            (cat.noticias_count || 0) > 0 
                                                ? "text-gray-300 cursor-not-allowed" 
                                                : "text-red-500 hover:bg-red-50"
                                        )}
                                        disabled={(cat.noticias_count || 0) > 0}
                                        title={(cat.noticias_count || 0) > 0 ? "No se puede eliminar una sección con noticias" : "Eliminar sección"}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
}
