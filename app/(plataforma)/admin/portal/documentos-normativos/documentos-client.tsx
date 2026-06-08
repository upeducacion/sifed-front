"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import useSWR from "swr";
import { documentosApi } from "@/lib/api/documentos";
import { DocumentoNormativo, DocumentoCategoria } from "@/types/documento-normativo";
import { Plus, Search, FileText, Eye, EyeOff, Edit, Trash2, Loader2, BookOpen, FileSpreadsheet, Tags } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { cn, getStorageUrl } from "@/lib/utils";

// Mapeo simple de iconos según el slug de la categoría
const getIconForCategory = (slug?: string) => {
  if (!slug) return <FileText className="h-5 w-5 text-brand-600" />;
  if (slug.includes('ley') || slug.includes('normativa')) return <BookOpen className="h-5 w-5 text-brand-600" />;
  if (slug.includes('formato') || slug.includes('plantilla')) return <FileSpreadsheet className="h-5 w-5 text-uncp-gold" />;
  return <FileText className="h-5 w-5 text-brand-600" />;
};

export function DocumentosClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const { mutate } = useSWRConfig();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [categoriaId, setCategoriaId] = useState<string>("");

  // Obtener categorías dinámicas para los filtros
  const { data: categoriasResponse } = useSWR(
    '/api/admin/documento-categorias',
    () => documentosApi.getCategoriasAdmin()
  );
  const categorias: DocumentoCategoria[] = categoriasResponse || [];

  // Obtener los documentos
  const { data, isLoading } = useSWR(
    ['/api/admin/documentos-normativos', page, search, categoriaId],
    () => documentosApi.getAll({
      page,
      search: search || undefined,
      documento_categoria_id: categoriaId || undefined
    })
  );
  const documentos = data?.data || [];
  const meta = data?.meta;

  const handleToggleVisibility = async (id: number, isPublic: boolean) => {
    try {
      await documentosApi.toggleVisibility(id, !isPublic);
      showToast("Visibilidad actualizada correctamente", "success");
      mutate(['/api/admin/documentos-normativos', page, search, categoriaId]);
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar visibilidad", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Está seguro de eliminar este documento? Esta acción no se puede deshacer.")) return;
    
    try {
      await documentosApi.delete(id);
      showToast("Documento eliminado correctamente", "success");
      mutate(['/api/admin/documentos-normativos', page, search, categoriaId]);
    } catch (error) {
      console.error(error);
      showToast("Error al eliminar el documento", "error");
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Documentos Normativos</h2>
          <p className="text-muted-foreground text-sm">Gestiona normativas, formatos oficiales, flujos y guías.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link 
            href="/admin/portal/documentos-normativos/categorias"
            className="inline-flex items-center gap-2 bg-white border border-border hover:bg-muted text-brand-950 px-4 py-2 rounded-lg font-medium transition-all text-sm shadow-sm"
          >
            <Tags className="w-4 h-4" />
            Categorías
          </Link>
          <button 
            type="button"
            onClick={() => router.push("/admin/portal/documentos-normativos/nuevo")}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-all text-sm font-medium shadow-sm"
          >
            <Plus className="h-4 w-4" /> Nuevo Documento
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Buscar por título, código..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          <button 
            type="button"
            className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all border whitespace-nowrap", categoriaId === "" ? "bg-brand-950 text-white border-brand-950" : "bg-white text-brand-950 hover:bg-brand-50")}
            onClick={() => { setCategoriaId(""); setPage(1); }}
          >
            Todos
          </button>
          {categorias.map(cat => (
            <button 
              key={cat.id}
              type="button"
              className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all border whitespace-nowrap", categoriaId === cat.id.toString() ? "bg-brand-950 text-white border-brand-950" : "bg-white text-brand-950 hover:bg-brand-50")}
              onClick={() => { setCategoriaId(cat.id.toString()); setPage(1); }}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        ) : documentos.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground font-medium">
            No se encontraron documentos.
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-neutral-50/80 border-b border-border text-brand-950 font-semibold">
                <tr>
                  <th className="h-12 px-6 align-middle">Tipo</th>
                  <th className="h-12 px-6 align-middle">Código</th>
                  <th className="h-12 px-6 align-middle">Título</th>
                  <th className="h-12 px-6 align-middle">Ext.</th>
                  <th className="h-12 px-6 align-middle">Estado</th>
                  <th className="h-12 px-6 text-center align-middle">Público</th>
                  <th className="h-12 px-6 text-right align-middle">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {documentos.map((doc: DocumentoNormativo) => (
                  <tr key={doc.id} className="transition-colors hover:bg-muted/30">
                    <td className="p-6 align-middle">
                       <div className="h-10 w-10 bg-brand-50 rounded-lg flex items-center justify-center border border-brand-100">
                          {getIconForCategory(doc.categoria?.slug)}
                       </div>
                    </td>
                    <td className="px-6 py-4 align-middle font-medium whitespace-nowrap text-brand-950">{doc.codigo || '-'}</td>
                    <td className="px-6 py-4 align-middle min-w-[250px]">
                      <div className="font-bold text-brand-950 mb-1">{doc.titulo}</div>
                      <div className="text-[10px] font-black text-brand-600 uppercase tracking-wider">{doc.categoria?.nombre || 'General'}</div>
                    </td>
                    <td className="px-6 py-4 align-middle uppercase text-[10px] font-black tracking-widest text-brand-400">{doc.extension_archivo}</td>
                    <td className="px-6 py-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold ring-1 ring-inset ${
                        doc.estado === 'vigente' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                        doc.estado === 'derogado' ? 'bg-red-50 text-red-700 ring-red-600/20' : 
                        'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                      }`}>
                        {doc.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-middle text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(doc.id, doc.is_public)}
                        className={cn("p-2 rounded-lg transition-colors", doc.is_public ? "text-green-600 hover:bg-green-50" : "text-muted-foreground hover:bg-neutral-100")}
                        title={doc.is_public ? "Ocultar en el portal" : "Mostrar en el portal"}
                      >
                        {doc.is_public ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </button>
                    </td>
                    <td className="px-6 py-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => window.open(getStorageUrl(doc.archivo_path), '_blank')}
                          className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-100"
                          title="Ver Archivo"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/portal/documentos-normativos/${doc.id}/edit`)}
                          className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors border border-transparent hover:border-brand-100"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Eliminar"
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

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-end gap-4 py-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-input hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <div className="text-sm font-medium text-brand-950">
            Página {page} de {meta.last_page}
          </div>
          <button
            onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
            disabled={page === meta.last_page}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-input hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
