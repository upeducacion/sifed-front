"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { documentosApi } from "@/lib/api/documentos";
import { DocumentoNormativo } from "@/types/documento-normativo";
import { Save, Upload, FileText, Loader2, Hash, AlertCircle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn, getStorageUrl } from "@/lib/utils";
import useSWR from "swr";
import axios from "axios";
import Cookies from "js-cookie";
import { AUTH_COOKIE_NAME } from "@/lib/auth-config";

interface DocumentoFormProps {
  initialData?: DocumentoNormativo;
}

export function DocumentoForm({ initialData }: DocumentoFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [filePreview, setFilePreview] = useState<string | null>(initialData?.archivo_path ? getStorageUrl(initialData.archivo_path) : null);
  const [fileName, setFileName] = useState<string | null>(initialData?.archivo_path ? initialData.archivo_path.split('/').pop() || null : null);
  
  const isEditing = !!initialData;

  const { data: allDocsResponse } = useSWR(
    '/api/admin/documentos-normativos/all',
    () => documentosApi.getAll({ per_page: 1000 })
  );
  const allDocs = allDocsResponse?.data || [];

  const { data: categorias, mutate: mutateCategorias } = useSWR(
    '/api/admin/documento-categorias',
    () => documentosApi.getCategoriasAdmin()
  );

  const handleQuickAddCategory = async () => {
    const nombre = window.prompt("Nombre de la nueva categoría:");
    if (!nombre) return;
    try {
      const token = Cookies.get(AUTH_COOKIE_NAME);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin/documento-categorias`, { nombre, is_active: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      mutateCategorias();
      showToast("Categoría agregada correctamente", "success");
    } catch(e) {
      console.error(e);
      showToast("Error al crear categoría", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});

    const formData = new FormData(e.currentTarget);

    if (!formData.has('is_public')) {
        formData.append('is_public', '0');
    } else {
        formData.set('is_public', '1');
    }

    if (!formData.get('sustituye_a_id')) {
        formData.delete('sustituye_a_id');
    }

    try {
      if (isEditing && initialData) {
        const fileEntry = formData.get('archivo') as File;
        if (fileEntry && fileEntry.size === 0) {
            formData.delete('archivo');
        }

        await documentosApi.update(initialData.id, formData);
        showToast("¡Documento actualizado correctamente!", "success");
      } else {
        await documentosApi.create(formData);
        showToast("¡Documento publicado con éxito!", "success");
      }
      router.push("/admin/portal/documentos-normativos");
      router.refresh();
    } catch (error: unknown) {
      console.error("Error saving document:", error);
      
      const axiosError = error as { response?: { status: number; data: { errors: Record<string, string[]> } } };
      if (axiosError.response?.status === 422) {
        setFormErrors(axiosError.response.data.errors || {});
        showToast("Error de validación. Revisa los campos marcados.", "error");
      } else {
        showToast("Ocurrió un error inesperado al guardar.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert("El archivo no debe superar los 50MB");
        e.target.value = "";
        return;
      }
      
      const validTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!validTypes.includes(file.type)) {
        alert("Formato no compatible. Solo PDF, DOC, DOCX, XLS o XLSX.");
        e.target.value = "";
        return;
      }

      setFileName(file.name);
      setFilePreview("new_file");
    } else {
        setFileName(null);
        setFilePreview(null);
    }
  };

  return (
    <form 
      key={initialData?.id || 'new-doc'}
      onSubmit={handleSubmit} 
      className={cn(
        "bg-white rounded-xl border border-border shadow-sm p-6 md:p-8 space-y-8 relative overflow-hidden",
        loading && "opacity-60 pointer-events-none transition-opacity"
      )}
    >
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
            <div className="bg-brand-950 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-bold">Procesando Documento...</span>
            </div>
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-brand-950">Título del Documento</label>
        <input 
          name="titulo"
          required
          type="text" 
          defaultValue={initialData?.titulo}
          placeholder="Ej: Reglamento de Grados y Títulos"
          className={cn(
            "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand-500 outline-none transition-all",
            formErrors.titulo ? "border-red-500 bg-red-50/30" : "border-input"
          )}
        />
        {formErrors.titulo && (
          <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
            <AlertCircle className="h-3 w-3" /> {formErrors.titulo[0]}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-950 flex items-center gap-2">
            <Hash className="h-3.5 w-3.5 text-brand-600" /> Código
          </label>
          <input 
            name="codigo"
            type="text" 
            defaultValue={initialData?.codigo || ""}
            placeholder="Ej: Res. 001-2026-UPG"
            className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-brand-500 outline-none"
          />
          {formErrors.codigo && (
            <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle className="h-3 w-3" /> {formErrors.codigo[0]}
            </p>
          )}
        </div>

        {/* Categoría Dinámica */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-brand-950">Categoría</label>
            <button 
              type="button" 
              onClick={handleQuickAddCategory}
              className="text-xs flex items-center gap-1 text-brand-600 hover:text-brand-800"
            >
              <Plus className="h-3 w-3" /> Nueva
            </button>
          </div>
          <select 
            name="documento_categoria_id"
            required
            defaultValue={initialData?.documento_categoria_id || ""}
            className={cn(
              "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand-500 outline-none bg-white",
              formErrors.documento_categoria_id ? "border-red-500 bg-red-50/30" : "border-input"
            )}
          >
            <option value="" disabled>Seleccionar categoría...</option>
            {categorias?.map((cat: { id: number; nombre: string }) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          {formErrors.documento_categoria_id && (
            <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle className="h-3 w-3" /> {formErrors.documento_categoria_id[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-950">Sub Categoría</label>
          <input 
            name="sub_categoria"
            type="text" 
            defaultValue={initialData?.sub_categoria || ""}
            placeholder="Ej: Formulario, Infografía..."
            className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-950">Fecha de Emisión</label>
          <input 
            name="fecha_emision"
            type="date"
            defaultValue={initialData?.fecha_emision ? initialData.fecha_emision : ""}
            className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-950">Estado</label>
          <select 
            name="estado"
            defaultValue={initialData?.estado || "vigente"}
            className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-brand-500 outline-none bg-white"
          >
            <option value="vigente">Vigente</option>
            <option value="derogado">Derogado</option>
            <option value="borrador">Borrador</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-950">Deroga o Sustituye a</label>
          <select 
            name="sustituye_a_id"
            defaultValue={initialData?.sustituye_a_id || ""}
            className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-brand-500 outline-none bg-white"
          >
            <option value="">Ninguno</option>
            {allDocs.map((doc: DocumentoNormativo) => (
                <option key={doc.id} value={doc.id.toString()}>{doc.codigo ? `[${doc.codigo}] ` : ''}{doc.titulo}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">Si seleccionas uno, el anterior pasará a estado &quot;Derogado&quot;.</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-brand-950">Descripción Corta</label>
        <textarea 
          name="descripcion"
          rows={3}
          defaultValue={initialData?.descripcion || ""}
          className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-brand-500 outline-none resize-none"
          placeholder="Breve descripción del documento..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-brand-950">Archivo del Documento (PDF, DOCX, XLSX)</label>
        <div className={cn(
            "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer relative overflow-hidden group h-32",
            formErrors.archivo ? "border-red-500 bg-red-50/30" : "border-border"
        )}>
          
          <div className="z-10 flex flex-col items-center text-center p-2">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                  {filePreview ? <FileText className="h-5 w-5 text-brand-600" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
              </div>
              <p className="text-sm font-medium text-brand-950">
                  {fileName ? fileName : (isEditing ? "Clic para reemplazar archivo" : "Clic para subir archivo")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Máx 50MB</p>
          </div>
          
          <input 
              name="archivo"
              type="file" 
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              required={!isEditing}
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
          />
        </div>
        {formErrors.archivo && (
          <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
            <AlertCircle className="h-3 w-3" /> {formErrors.archivo[0]}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 bg-brand-50/50 p-4 rounded-lg border border-brand-100">
          <input 
              type="checkbox" 
              name="is_public"
              id="is_public"
              defaultChecked={initialData ? initialData.is_public : true}
              className="h-5 w-5 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
          />
          <label htmlFor="is_public" className="text-sm font-medium text-brand-950 cursor-pointer">
              Hacer público este documento en el portal
          </label>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
          <Link href="/admin/portal/documentos-normativos" className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-brand-950 transition-colors">
              Cancelar
          </Link>
          <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isEditing ? 'Actualizar Documento' : 'Guardar Documento'}
          </button>
      </div>

    </form>
  );
}
