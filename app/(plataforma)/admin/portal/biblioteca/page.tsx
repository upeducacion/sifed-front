"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Book,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  Library,
  Tags
} from "lucide-react";
import { bibliotecaApi, BibliotecaRecurso } from "@/lib/api/biblioteca";
import { getStorageUrl, cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/error-handler";
import Loader from "@/components/ui/loader";

export default function BibliotecaAdminPage() {
  const [search, setSearch] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [page, setPage] = useState(1);
  const { showToast } = useToast();

  // Cargar Recursos
  const { data, error, isLoading, mutate } = useSWR(
    ['/api/admin/biblioteca', { search, categoria_id: categoriaId, page, per_page: 10 }],
    ([, params]) => bibliotecaApi.getAll(params),
    { keepPreviousData: true }
  );

  // Cargar Categorías para el filtro
  const { data: categorias } = useSWR('/api/admin/biblioteca-categorias', () => bibliotecaApi.getCategorias());

  const recursos: BibliotecaRecurso[] = data?.data || [];
  const pagination = {
    current_page: data?.current_page || 1,
    last_page: data?.last_page || 1,
    total: data?.total || 0,
  };

  const handleDelete = async (id: number, titulo: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${titulo}"?`)) return;
    try {
      await bibliotecaApi.delete(id);
      showToast("Recurso eliminado", "success");
      mutate();
    } catch (err) {
      handleApiError(err, showToast, "Error al eliminar");
    }
  };

  if (error) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100 font-bold">Error al conectar con la biblioteca</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-brand-950">Biblioteca Virtual</h2>
          <p className="text-muted-foreground text-sm">Gestiona libros, tesis y artículos académicos recomendados.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/portal/biblioteca/categorias"
            className="inline-flex items-center gap-2 bg-white border border-border hover:bg-muted text-brand-950 px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-sm"
          >
            <Tags className="w-4 h-4" />
            Categorías
          </Link>
          <Link 
            href="/admin/portal/biblioteca/nuevo"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Nuevo Recurso
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por título o descripción..."
            className="w-full pl-11 pr-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              className="pl-10 pr-8 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm appearance-none cursor-pointer"
              value={categoriaId}
              onChange={(e) => { setCategoriaId(e.target.value); setPage(1); }}
            >
              <option value="">Todas las categorías</option>
              {categorias?.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900">Recurso</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900">Categoría</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900">Recomendado Por</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900">Estado</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && recursos.length === 0 ? (
                <tr><td colSpan={5}><Loader text="Cargando biblioteca..." /></td></tr>
              ) : recursos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Library className="w-12 h-12 text-muted mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground font-medium">No se encontraron registros</p>
                  </td>
                </tr>
              ) : (
                recursos.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-10 rounded-md bg-brand-50 overflow-hidden border border-brand-100 flex-shrink-0 relative shadow-sm">
                          {item.imagen_portada_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={getStorageUrl(item.imagen_portada_url)} alt="Portada" className="object-cover w-full h-full" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-brand-200">
                              <Book className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-brand-950 truncate max-w-[300px]">{item.titulo}</p>
                          <a href={getStorageUrl(item.archivo_url)} target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-600 font-black uppercase tracking-widest flex items-center gap-1 hover:underline">
                            <FileText className="w-3 h-3" /> Ver PDF
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-brand-50 text-brand-700 border border-brand-100">
                        {item.categoria?.nombre || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                           <User className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-medium text-brand-900">
                          {item.docente ? item.docente.nombre_completo : item.recomendador_externo || 'Institucional'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                        item.estado === "activo" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", item.estado === "activo" ? "bg-emerald-500" : "bg-amber-500")} />
                        {item.estado}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/portal/biblioteca/${item.id}/edit`} className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(item.id, item.titulo)} className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total > 0 && !error && (
          <div className="px-6 py-4 bg-brand-50/30 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Mostrando <span className="font-bold text-brand-950">{(pagination.current_page - 1) * 10 + 1}</span> a <span className="font-bold text-brand-950">{Math.min(pagination.current_page * 10, pagination.total)}</span> de <span className="font-bold text-brand-950">{pagination.total}</span></p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(pagination.current_page - 1)} disabled={pagination.current_page === 1 || isLoading} className="p-2 rounded-xl border border-border bg-white hover:bg-muted disabled:opacity-50 transition-all"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-xs font-bold text-brand-950 px-2">Página {pagination.current_page} de {pagination.last_page}</span>
              <button onClick={() => setPage(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page || isLoading} className="p-2 rounded-xl border border-border bg-white hover:bg-muted disabled:opacity-50 transition-all"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
