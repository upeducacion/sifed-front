"use client";

import { LayoutTemplate, Image as ImageIcon, Trash2 } from "lucide-react";
import { ProgramaAdminFormData } from "@/types/admin-programa";
import { useToast } from "@/hooks/use-toast";
import { convertToWebP } from "@/lib/image-utils";

interface HeroContenidoTabProps {
  formData: ProgramaAdminFormData;
  setFormData: (data: ProgramaAdminFormData) => void;
  fotoPortadaFile: File | null;
  setFotoPortadaFile: (file: File | null) => void;
  fotoPortadaPreview: string | null;
  setFotoPortadaPreview: (url: string | null) => void;
}

export function HeroContenidoTab({
  formData, 
  setFormData,
  setFotoPortadaFile,
  fotoPortadaPreview,
  setFotoPortadaPreview
}: HeroContenidoTabProps) {
  const { showToast, removeToast } = useToast();

  const handlePortadaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("La imagen es muy pesada. Máximo 5MB.", "error");
        return;
      }

      const loadingToastId = showToast("Optimizando cabecera para la web...", "loading");

      try {
        const webpFile = await convertToWebP(file, 'HERO');
        setFotoPortadaFile(webpFile);
        setFotoPortadaPreview(URL.createObjectURL(webpFile));

        removeToast(loadingToastId);
        showToast("Cabecera optimizada con éxito", "success");
      } catch (error) {
        console.error("Error optimizando cabecera:", error);
        removeToast(loadingToastId);
        showToast("Error al optimizar la cabecera", "error");

        // Fallback al original
        setFotoPortadaFile(file);
        setFotoPortadaPreview(URL.createObjectURL(file));
      }
    }
  };
  const clearPortada = () => {
    setFotoPortadaFile(null);
    setFotoPortadaPreview(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* SECCIÓN: Contexto */}
      <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
        <h3 className="text-lg font-black text-brand-950 mb-2">Cabecera del Programa (Contenido)</h3>
        <p className="text-sm text-muted-foreground">
          Configura los textos y la imagen que aparecerán en el gran bloque oscuro al inicio de la página individual de este programa. <br className="mb-2" />
          <strong>Nota:</strong> Esta imagen panorámica también se reutilizará automáticamente como la &quot;miniatura&quot; o tarjeta principal del programa en los listados generales.
        </p>
      </div>

      {/* SECCIÓN: Imagen del Hero Contenido y Tarjeta */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
        <h3 className="text-lg font-black text-brand-950 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-brand-600" /> Imagen Principal (Fondo y Tarjeta)
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-brand-950 block">Sube la imagen panorámica</label>
            <p className="text-xs text-muted-foreground">Resolución recomendada: 1920x1080px. Se usará de fondo aquí y como portada en las tarjetas.</p>
          </div>
          
          <div className="relative h-80 rounded-2xl border-2 border-dashed border-border bg-muted/30 overflow-hidden group hover:border-brand-500 transition-colors flex items-center justify-center">
            {fotoPortadaPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fotoPortadaPreview} alt="Preview Hero Contenido" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    clearPortada();
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-20"
                  title="Eliminar imagen seleccionada"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageIcon className="w-10 h-10 mb-3 opacity-50" />
                <span className="text-sm font-medium">Click para subir imagen (WebP, JPG)</span>
              </div>
            )}
            
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp" 
              onChange={handlePortadaChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN: Textos del Hero Contenido */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
        <h3 className="text-lg font-black text-brand-950 flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-brand-600" /> Textos de la Cabecera Interna
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Pre-título (Pequeño superior)</label>
            <input
              type="text"
              value={formData.detalles_json.contenido_pre_title || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                detalles_json: { ...formData.detalles_json, contenido_pre_title: e.target.value } 
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm uppercase"
              placeholder="Ej: MAESTRÍA EN MENCIÓN EN"
            />
            <p className="text-xs text-muted-foreground">Aparece en letras doradas pequeñas arriba del título.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Título Principal (Sobreescribir)</label>
            <input
              type="text"
              value={formData.detalles_json.contenido_titulo || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                detalles_json: { ...formData.detalles_json, contenido_titulo: e.target.value } 
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
              placeholder={`Ej: ${formData.titulo}`}
            />
            <p className="text-xs text-muted-foreground">Si lo dejas en blanco, se usará el título general: <strong>{formData.titulo || "Título del programa"}</strong>.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
