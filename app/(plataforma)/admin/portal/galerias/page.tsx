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
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Camera,
  Calendar
} from "lucide-react";
import { galeriasApi, Galeria } from "@/lib/api/galerias";
import { getStorageUrl, cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/error-handler";
import Loader from "@/components/ui/loader";

const fetcher = async ([, params]: [string, Record<string, unknown>]) => {
  return await galeriasApi.getAll(params);
};

export default function GaleriasAdminPage() {
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [page, setPage] = useState(1);
  const [updatingOrdenId, setUpdatingOrdenId] = useState<number | null>(null);
  const { showToast } = useToast();

  const swrKey = ['/api/admin/galerias', { search, categoria, page, per_page: 10 }];

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    fetcher,
    { keepPreviousData: true }
  );

  const galerias: Galeria[] = data?.data || [];
  const pagination = {
    current_page: data?.current_page || 1,
    last_page: data?.last_page || 1,
    total: data?.total || 0,
  };

  const handleUpdateOrden = async (id: number, newOrden: number, oldOrden: number) => {
    if (newOrden === oldOrden) return;

    setUpdatingOrdenId(id);
    try {
      await galeriasApi.updateOrden(id, newOrden);
      showToast("Prioridad actualizada.", "success");
      mutate();
    } catch (err) {
      handleApiError(err, showToast, "Error al actualizar la prioridad");
    } finally {
      setUpdatingOrdenId(null);
    }
  };

  const handleDelete = async (id: number, titulo: string) => {
    if (!confirm(`¿Estás seguro de eliminar el álbum "${titulo}"?`)) return;
    
    try {
      await galeriasApi.delete(id);
      showToast("Álbum eliminado exitosamente", "success");
      mutate();
    } catch (err) {
      handleApiError(err, showToast, "Error al eliminar álbum");
    }
  };

  if (error) {
    return (
      <div className="w-full py-20 text-center bg-red-50 rounded-2xl border border-red-200">
        <p className="text-red-600 font-bold mb-2">Error de conexión</p>
        <p className="text-red-500/80 text-sm">No se pudo cargar la galería de fotos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-brand-950">Galería Institucional</h2>
          <p className="text-muted-foreground">Gestiona álbumes de fotos para sustenciones, investigación y eventos.</p>
        </div>
        <Link 
          href="/admin/portal/galerias/nuevo"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-5 h-5" />
          Nuevo Álbum
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar por título..."
            className="w-full pl-11 pr-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              className="pl-10 pr-8 py-2.5 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm appearance-none cursor-pointer"
              value={categoria}
              onChange={(e) => { setCategoria(e.target.value); setPage(1); }}
            >
              <option value="">Todas las categorías</option>
              <option value="sustentaciones">Sustentaciones</option>
              <option value="investigacion">Investigación</option>
              <option value="eventos">Eventos</option>
              <option value="institucional">Institucional</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-50/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900 w-24">
                  <div className="flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3" />
                    Prioridad
                  </div>
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900">Álbum</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900">Categoría</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900">Fecha</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900 text-center">Estado</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && galerias.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-0">
                    <Loader text="Cargando galerías..." size="md" />
                  </td>
                </tr>
              ) : galerias.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">No se encontraron álbumes</p>
                  </td>
                </tr>
              ) : (
                galerias.map((galeria) => (
                  <tr key={galeria.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      {updatingOrdenId === galeria.id ? (
                        <div className="flex justify-center items-center w-16 h-[34px]">
                          <Loader fullHeight={false} size="sm" text="" />
                        </div>
                      ) : (
                        <input 
                          type="number" 
                          defaultValue={galeria.orden}
                          onBlur={(e) => handleUpdateOrden(galeria.id, parseInt(e.target.value) || 0, galeria.orden)}
                          className="w-16 px-2 py-1 text-center bg-white border border-border rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm font-medium"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-16 rounded-lg bg-brand-50 overflow-hidden border border-brand-100 flex-shrink-0 relative">
                          {galeria.imagen_portada_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={getStorageUrl(galeria.imagen_portada_url)} 
                              alt={galeria.titulo} 
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-brand-300">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-brand-950 truncate max-w-[300px]">{galeria.titulo}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                            {galeria.fotos_count || 0} imágenes
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        galeria.categoria === "sustentaciones" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        galeria.categoria === "investigacion" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                        galeria.categoria === "eventos" ? "bg-uncp-gold/10 text-brand-700 border border-uncp-gold/20" :
                        "bg-slate-50 text-slate-700 border border-slate-100"
                      )}>
                        {galeria.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(galeria.fecha_evento).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-border">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          galeria.estado === "activo" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500"
                        )} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{galeria.estado}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/portal/galerias/${galeria.id}/edit`}
                          className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(galeria.id, galeria.titulo)}
                          className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
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
            <p className="text-xs text-muted-foreground">
              Mostrando <span className="font-bold text-brand-950">{(pagination.current_page - 1) * 10 + 1}</span> a <span className="font-bold text-brand-950">{Math.min(pagination.current_page * 10, pagination.total)}</span> de <span className="font-bold text-brand-950">{pagination.total}</span>
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setPage(pagination.current_page - 1)}
                disabled={pagination.current_page === 1 || isLoading}
                className="p-2 rounded-xl border border-border bg-white hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-brand-950 px-2">
                Página {pagination.current_page} de {pagination.last_page}
              </span>
              <button 
                onClick={() => setPage(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page || isLoading}
                className="p-2 rounded-xl border border-border bg-white hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
