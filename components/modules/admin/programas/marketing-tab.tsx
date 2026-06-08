"use client";

import { Image as ImageIcon, Trash2 } from "lucide-react";
import { ProgramaAdminFormData } from "@/types/admin-programa";
import { useToast } from "@/hooks/use-toast";
import { convertToWebP } from "@/lib/image-utils";

interface MarketingTabProps {
  formData: ProgramaAdminFormData;
  setFormData: (data: ProgramaAdminFormData) => void;
  setFotoHeroFile: (file: File | null) => void;
  fotoHeroPreview: string | null;
  setFotoHeroPreview: (url: string | null) => void;
}

export function MarketingTab({
  formData,
  setFormData,
  setFotoHeroFile,
  fotoHeroPreview,
  setFotoHeroPreview
}: MarketingTabProps) {
  const { showToast, removeToast } = useToast();

  const handleHeroChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("El banner es muy pesado. Máximo 5MB.", "error");
        return;
      }

      const loadingToastId = showToast("Optimizando banner para la web...", "loading");

      try {
        // Usamos el intent HERO (0.90 de calidad) porque son banners muy grandes
        const webpFile = await convertToWebP(file, 'HERO');
        setFotoHeroFile(webpFile);
        setFotoHeroPreview(URL.createObjectURL(webpFile));

        removeToast(loadingToastId);
        showToast("Banner optimizado con éxito", "success");
      } catch (error) {
        console.error("Error optimizando banner:", error);
        removeToast(loadingToastId);
        showToast("Error al optimizar el banner", "error");

        // Fallback al original
        setFotoHeroFile(file);
        setFotoHeroPreview(URL.createObjectURL(file));
      }
    }
  };
  const clearHero = () => {
    setFotoHeroFile(null);
    setFotoHeroPreview(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* SECCIÓN: Contexto */}
      <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
        <h3 className="text-lg font-black text-brand-950 mb-2">Marketing: Carrusel del Home</h3>
        <p className="text-sm text-muted-foreground">
          Aquí configuras cómo se verá este programa en el gran carrusel de la <strong>página principal (Home)</strong> de Posgrado. <br />
          Para que este banner aparezca públicamente, debes encender el interruptor &quot;Hero del Home&quot; en la pestaña de <em>Visibilidad</em>.
        </p>
      </div>

      {/* SECCIÓN: Imagen del Hero Home */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
        <h3 className="text-lg font-black text-brand-950 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-brand-600" /> Imagen del Banner (Home)
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-brand-950 block">Sube la imagen de fondo</label>
            <p className="text-xs text-muted-foreground">Resolución recomendada: 1920x1080px. Se usará como fondo del slide en la página principal.</p>
          </div>
          
          <div className="relative h-64 rounded-2xl border-2 border-dashed border-border bg-muted/30 overflow-hidden group hover:border-brand-500 transition-colors flex items-center justify-center">
            {fotoHeroPreview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fotoHeroPreview} alt="Preview Hero Home" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    clearHero();
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
              onChange={handleHeroChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN: Textos del Banner */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
        <h3 className="text-lg font-black text-brand-950">Contenido Textual del Slide</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Pre-título (Pequeño superior)</label>
            <input
              type="text"
              value={formData.detalles_json.hero_pre_title || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                detalles_json: { ...formData.detalles_json, hero_pre_title: e.target.value } 
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm uppercase"
              placeholder="Ej: ADMISIÓN 2026-I"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Título del Banner (Grande)</label>
            <input
              type="text"
              value={formData.detalles_json.hero_titulo || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                detalles_json: { ...formData.detalles_json, hero_titulo: e.target.value } 
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
              placeholder={`Ej: ${formData.titulo}`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Subtítulo (Medio)</label>
            <input
              type="text"
              value={formData.detalles_json.hero_subtitle || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                detalles_json: { ...formData.detalles_json, hero_subtitle: e.target.value } 
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
              placeholder="Ej: Mención en Gestión Educativa"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-brand-950">Descripción / Slogan (Home)</label>
            <textarea
              value={formData.detalles_json.hero_descripcion || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                detalles_json: { ...formData.detalles_json, hero_descripcion: e.target.value } 
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm resize-none"
              placeholder="Descripción emotiva que aparece en el banner grande del inicio..."
              rows={3}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
