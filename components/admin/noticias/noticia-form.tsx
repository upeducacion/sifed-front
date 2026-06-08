"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NoticiaService } from "@/lib/services/noticia-service";
import { Noticia } from "@/types/noticia";
import { NoticiaCategoria } from "@/types/noticia-categoria";
import { Save, Upload, ImageIcon, Loader2, Clock, User, Hash, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { convertToWebP } from "@/lib/image-utils";

interface NoticiaFormProps {
  initialData?: Noticia;
}

export function NoticiaForm({ initialData }: NoticiaFormProps) {
  const router = useRouter();
  const { showToast, removeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [preview, setPreview] = useState<string | null>(initialData?.imagen_url || null);
  const [categorias, setCategorias] = useState<NoticiaCategoria[]>([]);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<string>(initialData?.noticia_categoria_id?.toString() || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isEditing = !!initialData;
  useEffect(() => {
    // Cargamos categorías para el selector
    const fetchCategories = async () => {
        try {
            const data = await NoticiaService.getAllCategories();
            setCategorias(data);
            
            // Si estamos editando y ya tenemos el ID inicial, aseguramos que el estado se mantenga
            if (initialData?.noticia_categoria_id) {
                setSelectedCategoriaId(initialData.noticia_categoria_id.toString());
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Error desconocido";
            console.error("Error detallado al cargar categorías:", message);
        }
    };
    fetchCategories();
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormErrors({});

    const formData = new FormData(e.currentTarget);

    // Inyectar el archivo de imagen convertido (si existe)
    if (imageFile) {
        formData.set('imagen', imageFile);
    } else {
        const originalFile = formData.get('imagen') as File;
        if (!originalFile || originalFile.size === 0) {
           formData.delete('imagen');
        }
    }

    // Manejo de checkbox
    if (!formData.has('destacada')) {
        formData.append('destacada', '0');
    } else {
        formData.set('destacada', '1');
    }

    try {
      if (isEditing && initialData) {
        await NoticiaService.update(initialData.id, formData);
        showToast("¡Noticia actualizada correctamente!", "success");
      } else {
        await NoticiaService.create(formData);
        showToast("¡Noticia publicada con éxito!", "success");
      }
      router.push("/admin/portal/noticias");
      router.refresh();
    } catch (error: unknown) {
      console.error("Error saving noticia:", error);

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (5MB) del original
      if (file.size > 5 * 1024 * 1024) {
        showToast("La imagen no debe superar los 5MB", "warning");
        e.target.value = "";
        return;
      }

      // Validar tipo
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        showToast("Formato no compatible. Solo JPG, PNG o WEBP.", "warning");
        e.target.value = "";
        return;
      }

      const loadingToastId = showToast("Optimizando imagen para la web...", "loading");

      try {
        // Convertir a WebP inteligentemente según la intención (Noticias = CONTENT = 0.80)
        const webpFile = await convertToWebP(file, 'CONTENT');

        setImageFile(webpFile);
        const url = URL.createObjectURL(webpFile);
        setPreview(url);

        removeToast(loadingToastId);
        showToast("Imagen optimizada con éxito", "success");
      } catch (error) {
        console.error("Error optimizando imagen:", error);
        removeToast(loadingToastId);
        showToast("Error al optimizar la imagen", "error");

        // Fallback: usar original si falla la conversión
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
      }
    } else {
        setImageFile(null);
    }
  };
  return (
    <form 
      key={initialData?.id || 'new-noticia'}
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
                <span className="text-sm font-bold">Procesando Crónica...</span>
            </div>
        </div>
      )}
      
      {/* Título */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-brand-950">Título de la noticia</label>
        <input 
          name="titulo"
          required
          type="text" 
          defaultValue={initialData?.titulo}
          placeholder="Ej: Ceremonia de Graduación 2026"
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Categoría Dinámica */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-950 flex items-center gap-2">
            <Hash className="h-3.5 w-3.5 text-brand-600" /> Categoría Editorial
          </label>
          <select 
            name="noticia_categoria_id"
            required
            value={selectedCategoriaId}
            onChange={(e) => setSelectedCategoriaId(e.target.value)}
            className={cn(
              "w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand-500 outline-none bg-white",
              formErrors.noticia_categoria_id ? "border-red-500 bg-red-50/30" : "border-input"
            )}
          >
            <option value="" disabled>Seleccionar categoría...</option>
            {categorias.map(cat => (
                <option key={cat.id} value={cat.id.toString()}>{cat.nombre}</option>
            ))}
          </select>
          {formErrors.noticia_categoria_id && (
            <p className="text-xs text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle className="h-3 w-3" /> {formErrors.noticia_categoria_id[0]}
            </p>
          )}
        </div>

        {/* Autor */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-950 flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-brand-600" /> Nombre del Autor
          </label>
          <input 
            name="autor_nombre"
            type="text" 
            defaultValue={initialData?.autor_nombre || ""}
            placeholder="Ej: Dr. Pérez"
            className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        {/* Tiempo Lectura */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-950 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-brand-600" /> Tiempo de Lectura (min)
          </label>
          <input 
            name="tiempo_lectura"
            type="number" 
            defaultValue={initialData?.tiempo_lectura || ""}
            placeholder="Ej: 5"
            className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Fecha */}
         <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-950">Fecha de Publicación</label>
          <input 
            name="fecha_publicacion"
            required
            type="date"
            // Formato YYYY-MM-DD necesario para input date
            defaultValue={initialData?.fecha_publicacion ? initialData.fecha_publicacion.split('T')[0] : new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-brand-950">Estado</label>
          <select 
            name="estado"
            defaultValue={initialData?.estado || "borrador"}
            className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-brand-500 outline-none bg-white"
          >
            <option value="borrador">Borrador (Oculto)</option>
            <option value="publicado">Publicado (Visible)</option>
          </select>
        </div>
      </div>

      {/* Resumen */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-brand-950">Resumen corto</label>
        <textarea 
          name="resumen"
          rows={3}
          defaultValue={initialData?.resumen || ""}
          className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-brand-500 outline-none resize-none"
          placeholder="Breve descripción para la tarjeta (máx 500 caracteres)..."
        />
      </div>

      {/* Contenido */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-brand-950">Contenido Completo</label>
        <div className="relative">
           <textarea 
              name="contenido"
              required
              rows={12}
              defaultValue={initialData?.contenido}
              className="w-full px-4 py-2 rounded-lg border border-input focus:ring-2 focus:ring-brand-500 outline-none font-mono text-sm leading-relaxed"
              placeholder="Escribe aquí el contenido principal..."
           />
           <div className="flex justify-between mt-1 px-1">
             <p className="text-xs text-muted-foreground">Tip: Usa &lt;b&gt;negrita&lt;/b&gt;, &lt;i&gt;cursiva&lt;/i&gt; o &lt;br&gt; para saltos.</p>
             <p className="text-xs text-muted-foreground text-right">Soporta HTML básico</p>
           </div>
        </div>
      </div>

      {/* Imagen */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-brand-950">Imagen de Portada</label>
        <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer relative overflow-hidden group h-64">
          
          {preview ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity" />
          ) : null}

          <div className={`z-10 flex flex-col items-center text-center p-4 rounded-xl ${preview ? 'bg-white/90 backdrop-blur-sm shadow-sm' : ''}`}>
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                  {preview ? <ImageIcon className="h-5 w-5 text-brand-600" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
              </div>
              <p className="text-sm font-medium text-brand-950">
                  {preview ? "Clic para cambiar imagen" : "Clic para subir imagen"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, WEBP (Máx 5MB)
              </p>
          </div>
          
          <input 
              name="imagen"
              type="file" 
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
          />
        </div>
      </div>

      {/* Checks */}
      <div className="flex items-center gap-3 bg-uncp-gold/10 p-4 rounded-lg border border-uncp-gold/20">
          <input 
              type="checkbox" 
              name="destacada"
              id="destacada"
              defaultChecked={initialData?.destacada}
              className="h-5 w-5 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
          />
          <label htmlFor="destacada" className="text-sm font-medium text-brand-950 cursor-pointer">
              Destacar esta noticia (aparecerá más grande en el portal)
          </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
          <Link href="/admin/portal/noticias" className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-brand-950 transition-colors">
              Cancelar
          </Link>
          <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isEditing ? 'Actualizar Noticia' : 'Guardar Noticia'}
          </button>
      </div>

    </form>
  );
}
