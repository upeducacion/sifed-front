"use client";

import { UnoptImage } from "@/components/ui/unopt-image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Noticia } from "@/types/noticia";

interface EditorialCardProps {
  noticia: Noticia;
}

export default function EditorialCard({ noticia }: EditorialCardProps) {
  // Normalización de la URL de la imagen para asegurar que sea absoluta
  const getFullImageUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    
    if (!backendUrl) {
      console.warn("NEXT_PUBLIC_BACKEND_URL no está definida");
      return url;
    }
    
    return `${backendUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  };

  const imageUrl = getFullImageUrl(noticia.imagen_url);

  // Formateador de fecha en español
  const fechaEspañol = noticia.fecha_publicacion 
    ? new Date(noticia.fecha_publicacion).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : "";

  return (
    <Link href={`/noticias/${noticia.slug}`} className="block w-full h-screen border-b border-brand-100 last:border-0 group">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-col h-full w-full"
      >
        {/* IMAGEN DOMINANTE (80% DE LA VISTA) */}
        <div className="relative w-full h-[80vh] overflow-hidden bg-brand-50">
          {imageUrl ? (
            <UnoptImage
              src={imageUrl}
              alt={noticia.titulo}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-200">
              <span className="font-serif italic uppercase tracking-widest text-[10px]">Sin imagen de portada</span>
            </div>
          )}
          
          {/* Tag de Categoría Minimalista sobre la imagen */}
          <div className="absolute top-0 left-0 p-6 md:p-8">
            <span className="px-4 py-1 border border-white/20 bg-black/30 backdrop-blur-md text-[8px] font-black text-white uppercase tracking-[0.4em]">
              {noticia.categoria?.nombre || "Actualidad"}
            </span>
          </div>
        </div>

        {/* INFORMACIÓN COMPACTA Y PROPORCIONADA (20% DE LA VISTA) */}
        <div className="h-[20vh] px-8 md:px-12 lg:px-16 flex flex-col justify-center space-y-3 bg-white">
          <div className="flex items-center gap-4 text-[9px] font-black text-brand-400 uppercase tracking-[0.3em]">
            <span className="text-uncp-gold">{fechaEspañol}</span>
            {noticia.tiempo_lectura && (
              <span className="opacity-40">/ {noticia.tiempo_lectura} MIN LECTURA</span>
            )}
          </div>

          <div className="space-y-2 max-w-6xl">
            <h3 className="font-serif font-black text-brand-950 text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tighter group-hover:text-brand-600 transition-colors duration-500 line-clamp-1">
              {noticia.titulo}
            </h3>

            <p className="text-xs md:text-sm text-brand-950/40 leading-relaxed font-medium line-clamp-1 max-w-4xl">
              {noticia.resumen}
            </p>
          </div>

          {/* Micro-indicador de acción elegante */}
          <div className="flex items-center gap-3 pt-1">
             <div className="h-[1px] w-6 bg-brand-100 group-hover:w-12 group-hover:bg-uncp-gold transition-all duration-500" />
             <span className="text-[8px] font-black uppercase tracking-[0.5em] text-brand-950/20 group-hover:text-brand-950 transition-colors">
                Explorar crónica
             </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
