"use client";

import { useState } from "react";
import useSWR from "swr";
import { 
  Plus, 
  Trash2, 
  Save,
  X,
  Loader2,
  Edit2
} from "lucide-react";
import { bibliotecaApi } from "@/lib/api/biblioteca";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/error-handler";
import Loader from "@/components/ui/loader";

export default function CategoriasBibliotecaPage() {
  const { showToast } = useToast();
  const [isSaving, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [newCat, setNewCat] = useState({ nombre: "", orden: 0 });
  const [editCat, setEditCat] = useState({ nombre: "", orden: 0 });

  const { data: categorias, isLoading, mutate } = useSWR('/api/admin/biblioteca-categorias', () => bibliotecaApi.getCategorias());

  const handleCreate = async () => {
    if (!newCat.nombre) return showToast("Nombre requerido", "error");
    setIsLoading(true);
    try {
      await bibliotecaApi.createCategoria(newCat);
      showToast("Categoría creada", "success");
      setNewCat({ nombre: "", orden: 0 });
      mutate();
    } catch (err) { handleApiError(err, showToast); }
    finally { setIsLoading(false); }
  };

  const handleUpdate = async (id: number) => {
    setIsLoading(true);
    try {
      await bibliotecaApi.updateCategoria(id, editCat);
      showToast("Actualizado", "success");
      setEditingId(null);
      mutate();
    } catch (err) { handleApiError(err, showToast); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Se eliminarán todos los recursos asociados. ¿Continuar?")) return;
    try {
      await bibliotecaApi.deleteCategoria(id);
      showToast("Eliminado", "success");
      mutate();
    } catch (err) { handleApiError(err, showToast); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-brand-950">Categorías</h2>
          <p className="text-muted-foreground text-sm">Define la taxonomía del repositorio académico.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-wrap items-end gap-4">
        <div className="flex-1 space-y-2 min-w-[200px]">
          <label className="text-xs font-bold uppercase tracking-widest text-brand-900">Nombre de Categoría</label>
          <input 
            type="text" className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl outline-none focus:ring-2 focus:ring-brand-500/20"
            placeholder="Ej: Tesis de Maestría"
            value={newCat.nombre} onChange={e => setNewCat({...newCat, nombre: e.target.value})}
          />
        </div>
        <div className="w-24 space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-brand-900">Orden</label>
          <input 
            type="number" className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl outline-none"
            value={newCat.orden} onChange={e => setNewCat({...newCat, orden: parseInt(e.target.value) || 0})}
          />
        </div>
        <button 
          onClick={handleCreate} disabled={isSaving}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Añadir
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {isLoading ? <Loader text="Cargando categorías..." /> : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-brand-50/50 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Orden</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Categoría</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categorias?.map(cat => (
                <tr key={cat.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4">
                    {editingId === cat.id ? (
                      <input 
                        type="number" className="w-16 px-2 py-1 border rounded-lg"
                        value={editCat.orden} onChange={e => setEditCat({...editCat, orden: parseInt(e.target.value) || 0})}
                      />
                    ) : cat.orden}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === cat.id ? (
                      <input 
                        type="text" className="w-full max-w-sm px-3 py-1 border rounded-lg outline-none"
                        value={editCat.nombre} onChange={e => setEditCat({...editCat, nombre: e.target.value})}
                      />
                    ) : (
                      <span className="font-bold text-brand-950">{cat.nombre}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === cat.id ? (
                        <>
                          <button onClick={() => handleUpdate(cat.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"><Save className="w-4 h-4" /></button>
                          <button onClick={() => setEditingId(null)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(cat.id); setEditCat({ nombre: cat.nombre, orden: cat.orden }); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
