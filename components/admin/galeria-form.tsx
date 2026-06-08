"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UnoptImage } from "@/components/ui/unopt-image";
import { 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Plus,
  Loader2,
  Calendar
} from "lucide-react";
import { galeriasApi, Galeria, GaleriaFoto } from "@/lib/api/galerias";
import { getStorageUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/error-handler";
import { AxiosError } from "axios";
import { convertToWebP } from "@/lib/image-utils";

interface GaleriaFormProps {
  initialData?: Galeria;
  isEditing?: boolean;
}

export default function GaleriaForm({ initialData, isEditing = false }: GaleriaFormProps) {
  const router = useRouter();
  const { showToast, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    titulo: initialData?.titulo || "",
    categoria: initialData?.categoria || "eventos",
    descripcion: initialData?.descripcion || "",
    fecha_evento: initialData?.fecha_evento 
      ? initialData.fecha_evento.split('T')[0] 
      : new Date().toLocaleDateString('en-CA'), // Formato YYYY-MM-DD local
    estado: (initialData?.estado as "activo" | "borrador") || "activo",
    orden: initialData?.orden || 0,
  });

  // Assets State
  const [portadaFile, setPortadaFile] = useState<File | null>(null);
  const [portadaPreview, setPortadaPreview] = useState<string>(initialData?.imagen_portada_url ? getStorageUrl(initialData.imagen_portada_url) : "");
  
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newPhotosPreviews, setNewPhotosPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<GaleriaFoto[]>(initialData?.fotos || []);

  const portadaInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handlePortadaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        showToast(`La portada es muy pesada. Máximo 5MB.`, "error");
        return;
      }
      
      const loadingToastId = showToast("Optimizando portada para la web...", "loading");
      
      try {
        const webpFile = await convertToWebP(file, 'GALLERY');
        setPortadaFile(webpFile);
        setPortadaPreview(URL.createObjectURL(webpFile));
        
        removeToast(loadingToastId);
        showToast("Portada optimizada con éxito", "success");
      } catch (error) {
        console.error("Error optimizando portada:", error);
        removeToast(loadingToastId);
        showToast("Error al optimizar la portada", "error");
        
        // Fallback
        setPortadaFile(file);
        setPortadaPreview(URL.createObjectURL(file));
      }
    }
  };

  const handlePhotosChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const loadingToastId = showToast(`Optimizando ${files.length} imagen(es)...`, "loading");

    const validFiles: File[] = [];
    const validPreviews: string[] = [];
    
    let rejectedCount = 0;
    let duplicateCount = 0;

    // Procesamos en serie o en paralelo, Promise.all es mejor para velocidad
    const processPromises = files.map(async (file) => {
      // 1. Validar Peso
      if (file.size > MAX_FILE_SIZE) {
        rejectedCount++;
        return null;
      }

      // 2. Validar Duplicados
      const isDuplicate = newPhotos.some(p => p.name === file.name && p.size === file.size);
      if (isDuplicate) {
        duplicateCount++;
        return null;
      }

      try {
         const webpFile = await convertToWebP(file, 'GALLERY');
         return webpFile;
      } catch (error) {
         console.error("Error convirtiendo foto a WebP:", error);
         return file;
      }
    });

    const processedFiles = await Promise.all(processPromises);

    processedFiles.forEach(file => {
       if (file) {
          validFiles.push(file);
          validPreviews.push(URL.createObjectURL(file));
       }
    });

    removeToast(loadingToastId);

    if (rejectedCount > 0) {
      showToast(`${rejectedCount} imágenes fueron rechazadas por superar los 5MB.`, "error");
    }
    if (duplicateCount > 0) {
      showToast(`${duplicateCount} imágenes ya están en la lista de subida.`, "warning");
    }
    
    if (validFiles.length > 0) {
      showToast(`${validFiles.length} imágenes optimizadas y listas.`, "success");
      setNewPhotos(prev => [...prev, ...validFiles]);
      setNewPhotosPreviews(prev => [...prev, ...validPreviews]);
    }
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index));
    setNewPhotosPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = async (fotoId: number) => {
    if (!confirm("¿Eliminar esta foto permanentemente del álbum?")) return;
    
    setIsDeletingPhoto(fotoId);
    try {
      await galeriasApi.removePhoto(fotoId);
      setExistingPhotos(prev => prev.filter(f => f.id !== fotoId));
      showToast("Foto eliminada", "success");
    } catch (err) {
      handleApiError(err, showToast, "Error al eliminar la foto");
    } finally {
      setIsDeletingPhoto(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("titulo", formData.titulo);
    data.append("categoria", formData.categoria);
    data.append("descripcion", formData.descripcion || "");
    data.append("fecha_evento", formData.fecha_evento);
    data.append("estado", formData.estado);
    data.append("orden", formData.orden.toString());

    if (portadaFile) {
      data.append("imagen_portada", portadaFile);
    }

    newPhotos.forEach((file) => {
      data.append("fotos[]", file);
    });

    try {
      if (isEditing && initialData) {
        await galeriasApi.update(initialData.id, data);
        showToast("Galería actualizada con éxito", "success");
      } else {
        await galeriasApi.create(data);
        showToast("Galería creada con éxito", "success");
      }
      router.push("/admin/portal/galerias");
      router.refresh();
    } catch (err) {
      // Manejo inteligente de errores de validación de Laravel para archivos
      if (err instanceof AxiosError && err.response?.status === 422) {
        const errors = err.response.data.errors;
        Object.keys(errors).forEach(key => {
          if (key.startsWith('fotos.')) {
            const index = parseInt(key.split('.')[1]);
            const fileName = newPhotos[index]?.name || `Archivo #${index + 1}`;
            showToast(`Error en ${fileName}: ${errors[key][0]}`, "error");
          } else {
            showToast(errors[key][0], "error");
          }
        });
      } else {
        handleApiError(err, showToast, "Error al guardar la galería");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Info */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-brand-500" />
            Información General
          </h3>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-900">Título del Álbum</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
              placeholder="Ej: Sustentación de Tesis - Maestría en Educación"
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Categoría</label>
              <select 
                className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                value={formData.categoria}
                onChange={e => setFormData({...formData, categoria: e.target.value})}
              >
                <option value="sustentaciones">Sustentaciones</option>
                <option value="investigacion">Investigación</option>
                <option value="eventos">Eventos</option>
                <option value="institucional">Institucional</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Fecha del Evento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  required
                  type="date" 
                  className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
                  value={formData.fecha_evento}
                  onChange={e => setFormData({...formData, fecha_evento: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-900">Descripción (Opcional)</label>
            <textarea 
              rows={4}
              className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none"
              placeholder="Breve contexto sobre este álbum..."
              value={formData.descripcion}
              onChange={e => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>
        </div>

        {/* Multi-photo upload Section */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-brand-950 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-500" />
              Fotos del Álbum
            </h3>
            <button 
              type="button"
              onClick={() => photosInputRef.current?.click()}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <Upload className="w-4 h-4" />
              Subir Imágenes
            </button>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={photosInputRef}
              onChange={handlePhotosChange}
            />
          </div>

          {newPhotos.length === 0 && existingPhotos.length === 0 && (
            <div className="py-10 text-center border-2 border-dashed border-muted rounded-2xl">
               <ImageIcon className="w-10 h-10 text-muted mx-auto mb-2" />
               <p className="text-xs text-muted-foreground">No hay fotos seleccionadas</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Existing Photos */}
            {existingPhotos.map((foto) => (
              <div key={foto.id} className="aspect-square rounded-xl border border-border overflow-hidden relative group bg-muted/20">
                <UnoptImage 
                  src={getStorageUrl(foto.archivo_url)} 
                  alt="Foto" 
                  fill
                  className="w-full h-full object-cover" 
                />
                <button 
                  type="button"
                  disabled={isDeletingPhoto === foto.id}
                  onClick={() => removeExistingPhoto(foto.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeletingPhoto === foto.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                </button>
              </div>
            ))}

            {/* New Photos Previews */}
            {newPhotosPreviews.map((preview, index) => (
              <div key={`new-${index}`} className="aspect-square rounded-xl border-2 border-brand-200 overflow-hidden relative group bg-brand-50/30">
                <UnoptImage 
                  src={preview} 
                  alt="Nuevo" 
                  fill
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-2 left-2">
                   <span className="bg-brand-600/90 backdrop-blur-sm text-[8px] text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Nueva</span>
                </div>
                <button 
                  type="button"
                  onClick={() => removeNewPhoto(index)}
                  className="absolute top-2 right-2 p-1.5 bg-brand-950 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Add Trigger */}
            <button 
              type="button"
              onClick={() => photosInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-brand-500/50 hover:bg-brand-50/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Añadir más</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Settings & Portada */}
      <div className="space-y-6">
        {/* Portada Section */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-brand-500" />
            Portada
          </h3>
          
          <div 
            onClick={() => portadaInputRef.current?.click()}
            className="aspect-[4/3] rounded-2xl border-2 border-dashed border-border overflow-hidden relative group cursor-pointer hover:border-brand-500 transition-all bg-muted/30"
          >
            {portadaPreview ? (
              <UnoptImage 
                src={portadaPreview} 
                alt="Portada" 
                fill
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                <Upload className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs font-bold">Haz clic para subir portada</p>
                <p className="text-[10px] opacity-60 mt-1">Recomendado: 800x600px (Máx 5MB)</p>
              </div>
            )}
            <div className="absolute inset-0 bg-brand-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-bold bg-brand-600 px-3 py-1.5 rounded-full">Cambiar Imagen</span>
            </div>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={portadaInputRef}
            onChange={handlePortadaChange}
          />
        </div>

        {/* Publish Settings */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-brand-950">Publicación</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-brand-950">Estado</p>
                <p className="text-[10px] text-muted-foreground">Visible en el portal</p>
              </div>
              <select 
                className="bg-white border border-border rounded-lg text-xs font-bold py-1.5 pl-2 pr-6 outline-none focus:ring-2 focus:ring-brand-500/20"
                value={formData.estado}
                onChange={e => setFormData({...formData, estado: e.target.value as "activo" | "borrador"})}
              >
                <option value="activo">Activo</option>
                <option value="borrador">Borrador</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900">Prioridad (Orden)</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-brand-500/20 outline-none text-sm"
                value={formData.orden}
                onChange={e => setFormData({...formData, orden: parseInt(e.target.value) || 0})}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-muted disabled:text-muted-foreground text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditing ? "Actualizar Galería" : "Crear Galería"}
                </>
              )}
            </button>
            
            <button 
              type="button"
              onClick={() => router.back()}
              className="w-full bg-white border border-border hover:bg-muted text-brand-950 py-3 rounded-xl font-bold text-sm transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
