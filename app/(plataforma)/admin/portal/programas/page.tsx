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
  GraduationCap,
  Loader2
} from "lucide-react";
import { programasApi, Programa } from "@/lib/api/programas";
import { getStorageUrl, cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/error-handler";
import Loader from "@/components/ui/loader";

const fetcher = async ([, params]: [string, Record<string, unknown>]) => {
  return await programasApi.getAll(params);
};
export default function ProgramasAdminPage() {
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("");
  const [page, setPage] = useState(1);
  const [updatingOrdenId, setUpdatingOrdenId] = useState<number | null>(null);
  const { showToast } = useToast();

  const swrKey = ['/api/admin/programas', { search, tipo, page, per_page: 10 }];

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    fetcher,
    { keepPreviousData: true }
  );

  const programas: Programa[] = data?.data || [];
  const pagination = {
    current_page: data?.current_page || 1,
    last_page: data?.last_page || 1,
    total: data?.total || 0,
  };

  const handleToggleVisibility = async (id: number, field: string, currentValue: boolean) => {
    const optimisticData = {
      data: programas.map(p => 
        p.id === id 
          ? { ...p, config_visibilidad: { ...p.config_visibilidad, [field]: !currentValue } }
          : p
      ),
      current_page: pagination.current_page,
      last_page: pagination.last_page,
      total: pagination.total
    };

    try {
      await mutate(optimisticData, { revalidate: false }); 
      await programasApi.toggleVisibility(id, field, !currentValue);
      showToast("Visibilidad actualizada", "success");
      mutate(); 
    } catch (err) {
      handleApiError(err, showToast, "Error al actualizar visibilidad");
      mutate(); 
    }
  };

  const handleUpdateOrden = async (id: number, newOrden: number, oldOrden: number) => {
    if (newOrden === oldOrden) return;

    setUpdatingOrdenId(id);
    const optimisticData = {
      data: programas.map(p => p.id === id ? { ...p, orden: newOrden } : p),
      current_page: pagination.current_page,
      last_page: pagination.last_page,
      total: pagination.total
    };

    try {
      await mutate(optimisticData, { revalidate: false });
      await programasApi.updateOrden(id, newOrden);
      showToast("Prioridad actualizada.", "success");
      mutate();
    } catch (err) {
      handleApiError(err, showToast, "Error al actualizar la prioridad");
      mutate();
    } finally {
      setUpdatingOrdenId(null);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar el programa "${nombre}"?`)) return;
    
    const optimisticData = {
      data: programas.filter(p => p.id !== id),
      current_page: pagination.current_page,
      last_page: pagination.last_page,
      total: pagination.total - 1
    };

    try {
      await mutate(optimisticData, { revalidate: false });
      await programasApi.delete(id);
      showToast("Programa eliminado exitosamente", "success");
      mutate();
    } catch (err) {
      handleApiError(err, showToast, "Error al eliminar programa");
      mutate();
    }
  };

  if (error) {
    return (
      <div className="w-full py-20 text-center bg-red-50 rounded-2xl border border-red-200">
        <p className="text-red-600 font-bold mb-2">Error de conexión</p>
        <p className="text-red-500/80 text-sm">No se pudo cargar la lista de programas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-brand-950">Oferta Académica</h2>
          <p className="text-muted-foreground">Gestiona maestrías, doctorados, diplomados y cursos del portal público.</p>
        </div>
        <Link 
          href="/admin/portal/programas/nuevo"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-5 h-5" />
          Nuevo Programa
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
              value={tipo}
              onChange={(e) => { setTipo(e.target.value); setPage(1); }}
            >
              <option value="">Todos los tipos</option>
              <option value="maestria">Maestrías</option>
              <option value="doctorado">Doctorados</option>
              <option value="diplomado">Diplomados</option>
              <option value="curso">Cursos</option>
              <option value="taller">Talleres</option>
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
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900">Programa</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900">Tipo</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900 text-center">Hero Slider</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900 text-center">Estado</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-brand-900 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && programas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-0">
                    <Loader text="Cargando oferta académica..." size="md" />
                  </td>
                </tr>
              ) : programas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">No se encontraron programas</p>
                  </td>
                </tr>
              ) : (
                programas.map((programa) => (
                  <tr key={programa.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      {updatingOrdenId === programa.id ? (
                        <div className="flex justify-center items-center w-16 h-[34px]">
                          <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                        </div>
                      ) : (
                        <input 
                          type="number" 
                          defaultValue={programa.orden}
                          onBlur={(e) => handleUpdateOrden(programa.id, parseInt(e.target.value) || 0, programa.orden)}
                          className="w-16 px-2 py-1 text-center bg-white border border-border rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm font-medium"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-16 rounded-lg bg-brand-50 overflow-hidden border border-brand-100 flex-shrink-0 relative">
                          {programa.imagen_portada_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={getStorageUrl(programa.imagen_portada_url)} 
                              alt={programa.titulo} 
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-brand-300">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-brand-950 truncate max-w-[300px]">{programa.titulo}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                            {programa.detalles_json?.categoria || programa.tipo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        programa.tipo === "maestria" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                        programa.tipo === "doctorado" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                        "bg-slate-50 text-slate-700 border border-slate-100"
                      )}>
                        {programa.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <button 
                          onClick={() => handleToggleVisibility(programa.id, 'mostrar_en_hero', programa.config_visibilidad?.mostrar_en_hero ?? false)}
                          className={cn(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
                            programa.config_visibilidad?.mostrar_en_hero ? "bg-uncp-gold" : "bg-muted-foreground/30"
                          )}
                        >
                          <span className="sr-only">Mostrar en Hero</span>
                          <span
                            aria-hidden="true"
                            className={cn(
                              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                              programa.config_visibilidad?.mostrar_en_hero ? "translate-x-2" : "-translate-x-2"
                            )}
                          />
                        </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-border">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          programa.estado === "activo" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
                          programa.estado === "borrador" ? "bg-amber-500" : "bg-red-500"
                        )} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{programa.estado}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/portal/programas/${programa.id}/edit`}
                          className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(programa.id, programa.titulo)}
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
