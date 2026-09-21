"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import useSWR from "swr";
import { documentosApi } from "@/lib/api/documentos";
import type { DocumentFolder, DocumentoNormativo, DocumentoCategoria } from "@/types/documento-normativo";
import { Plus, Search, FileText, Eye, EyeOff, Edit, Trash2, Loader2, BookOpen, FileSpreadsheet, Tags, Folder, FolderOpen, ChevronRight, Settings2 } from "lucide-react";
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

const procedureOptions = [
  { value: "constancia-egresado", label: "Constancia de egresado" },
  { value: "record-academico", label: "Récord académico" },
  { value: "reserva-matricula", label: "Reserva de matrícula" },
  { value: "mesa-de-partes", label: "Mesa de partes" },
];

export function DocumentosClient() {
  const router = useRouter();
  const { showToast } = useToast();
  const { mutate } = useSWRConfig();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  // Obtener categorías dinámicas para los filtros
  const { data: categoriasResponse } = useSWR(
    '/api/admin/documento-categorias',
    () => documentosApi.getCategoriasAdmin()
  );
  const categorias: DocumentoCategoria[] = categoriasResponse || [];

  const { data: folders = [] } = useSWR<DocumentFolder[]>(
    '/api/admin/document-folders/tree',
    documentosApi.getFolders
  );

  // Obtener los documentos
  const documentKey = ['/api/admin/documentos-normativos', page, search, categoriaId, type, selectedFolderId];
  const { data, isLoading } = useSWR(
    documentKey,
    () => documentosApi.getAll({
      page,
      search: search || undefined,
      documento_categoria_id: categoriaId || undefined,
      type: type || undefined,
      folder_id: selectedFolderId ?? undefined,
    })
  );
  const documentos = data?.data || [];
  const meta = data?.meta;

  const handleToggleVisibility = async (id: number, isPublic: boolean) => {
    try {
      await documentosApi.toggleVisibility(id, !isPublic);
      showToast("Visibilidad actualizada correctamente", "success");
      mutate(documentKey);
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
      mutate(documentKey);
    } catch (error) {
      console.error(error);
      showToast("Error al eliminar el documento", "error");
    }
  };

  return (
    <main className="min-h-full bg-[#f5f7fa] p-5 text-brand-950 md:p-8">
      <div className="page-shell-wide-contained space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">Biblioteca institucional</p>
          <h1 className="mt-2 font-serif text-3xl font-black tracking-tight md:text-4xl">Documentos normativos</h1>
          <p className="mt-2 text-sm text-muted-foreground">Gestiona normativas, formatos oficiales, flujos y guías desde un solo espacio.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/portal/tramites"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-900 shadow-sm transition hover:border-brand-400 hover:bg-brand-50"
          >
            <Folder className="h-4 w-4" /> Organizar carpetas
          </Link>
          <Link 
            href="/admin/portal/documentos-normativos/categorias"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-900 shadow-sm transition hover:border-brand-400 hover:bg-brand-50"
          >
            <Tags className="w-4 h-4" />
            Categorías
          </Link>
          <button 
            type="button"
            onClick={() => router.push("/admin/portal/documentos-normativos/nuevo")}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" /> Nuevo documento
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-xs font-bold text-muted-foreground">Documentos encontrados <FileText className="h-4 w-4 text-brand-400" /></div><p className="mt-2 text-2xl font-black">{meta?.total ?? documentos.length}</p></div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-xs font-bold text-muted-foreground">Carpetas organizadas <Folder className="h-4 w-4 text-amber-500" /></div><p className="mt-2 text-2xl font-black">{folders.length}</p></div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-xs font-bold text-muted-foreground">Visibles en el portal <Eye className="h-4 w-4 text-emerald-500" /></div><p className="mt-2 text-2xl font-black">{documentos.filter((document: DocumentoNormativo) => document.is_public).length}</p></div>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Ubicación rápida</p><p className="mt-1 text-sm font-bold">{selectedFolderId ? "Filtrando por carpeta seleccionada" : "Todos los documentos"}</p></div>
          <Link href="/admin/portal/tramites" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-950"><Settings2 className="h-3.5 w-3.5" /> Gestionar estructura <ChevronRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <button type="button" onClick={() => { setSelectedFolderId(null); setPage(1); }} className={cn("inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition", selectedFolderId === null ? "border-brand-950 bg-brand-950 text-white" : "border-slate-200 text-brand-800 hover:border-brand-300 hover:bg-brand-50")}><FolderOpen className="h-4 w-4" /> Todos</button>
          {folders.filter((folder) => folder.parent_id === null).map((folder) => (
            <button key={folder.id} type="button" onClick={() => { setSelectedFolderId(folder.id); setPage(1); }} className={cn("inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition", selectedFolderId === folder.id ? "border-brand-950 bg-brand-950 text-white" : "border-slate-200 text-brand-800 hover:border-brand-300 hover:bg-brand-50")}><Folder className={cn("h-4 w-4", selectedFolderId === folder.id ? "text-uncp-gold" : "text-amber-500")} /> {folder.name}<span className="text-[10px] opacity-60">{folder.documents_count ?? 0}</span></button>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-5">
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
        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="rounded-lg border border-input bg-white px-4 py-2 text-sm font-medium text-brand-950 focus:ring-2 focus:ring-brand-500 outline-none"
          aria-label="Filtrar por tipo de trámite"
        >
          <option value="">Todos los tipos</option>
          {procedureOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
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
            type="button"
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
            type="button"
            onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
            disabled={page === meta.last_page}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-input hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
      </div>
    </main>
  );
}
