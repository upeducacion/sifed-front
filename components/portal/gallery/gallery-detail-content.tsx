"use client";

import { useState } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2,
  Download
} from "lucide-react";
import Link from "next/link";
import { UnoptImage } from "@/components/ui/unopt-image";
import { Galeria } from "@/lib/api/galerias";
import { getStorageUrl, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryDetailContentProps {
  galeria: Galeria;
}

export default function GalleryDetailContent({ galeria }: GalleryDetailContentProps) {
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  const fotos = galeria.fotos || [];

  const nextPhoto = () => {
    if (photoIndex !== null) {
      setPhotoIndex((photoIndex + 1) % fotos.length);
    }
  };

  const prevPhoto = () => {
    if (photoIndex !== null) {
      setPhotoIndex((photoIndex - 1 + fotos.length) % fotos.length);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link 
            href="/galeria-fotos" 
            className="group flex items-center gap-2 text-sm font-bold text-brand-950 hover:text-brand-600 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center group-hover:bg-brand-100 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Volver
          </Link>
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">{galeria.categoria}</span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </nav>

      {/* Album Info */}
      <header className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 text-brand-600 font-bold text-sm"
        >
          <Calendar className="w-4 h-4" />
          {new Date(galeria.fecha_evento).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-serif font-bold text-brand-950 leading-tight"
        >
          {galeria.titulo}
        </motion.h1>
        {galeria.descripcion && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            {galeria.descripcion}
          </motion.p>
        )}
      </header>

      {/* Photo Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {fotos.map((foto, index) => (
            <motion.div
              key={foto.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setPhotoIndex(index)}
              className="relative group cursor-zoom-in rounded-2xl overflow-hidden border border-border bg-brand-50 break-inside-avoid"
            >
              <div className="relative w-full h-auto min-h-[200px]">
                <UnoptImage 
                  src={getStorageUrl(foto.archivo_url)} 
                  alt={foto.titulo_foto || galeria.titulo} 
                  width={800}
                  height={600}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-brand-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                    <Maximize2 className="w-5 h-5" />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {photoIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-950 flex flex-col items-center justify-center p-4 md:p-10 select-none"
          >
            {/* Close button */}
            <button 
              onClick={() => setPhotoIndex(null)}
              className="absolute top-6 right-6 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            <button 
              onClick={prevPhoto}
              className="absolute left-4 md:left-10 z-[110] w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/5"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={nextPhoto}
              className="absolute right-4 md:right-10 z-[110] w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/5"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Main Image */}
            <motion.div 
              key={photoIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full flex items-center justify-center p-4 md:p-20"
            >
              <div className="relative w-full h-full max-w-[90vw] max-h-[80vh]">
                <UnoptImage 
                  src={getStorageUrl(fotos[photoIndex].archivo_url)} 
                  alt="Lightbox View" 
                  fill
                  priority
                  className="object-contain shadow-2xl rounded-lg"
                />
              </div>
              
              {/* Image info bar */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between text-white/70 px-8">
                 <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Foto {photoIndex + 1} de {fotos.length}</p>
                    <p className="text-xs">{galeria.titulo}</p>
                 </div>
                 <a 
                   href={getStorageUrl(fotos[photoIndex].archivo_url)} 
                   download 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors"
                 >
                    <Download className="w-4 h-4" />
                    Descargar
                 </a>
              </div>
            </motion.div>

            {/* Thumbnail Strip */}
            <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 gap-2 p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
               {fotos.map((f, i) => (
                 <button 
                  key={f.id}
                  onClick={() => setPhotoIndex(i)}
                  className={cn(
                    "w-12 h-12 rounded-lg overflow-hidden transition-all relative",
                    photoIndex === i ? "ring-2 ring-uncp-gold scale-110" : "opacity-40 hover:opacity-100"
                  )}
                 >
                   <UnoptImage 
                    src={getStorageUrl(f.archivo_url)} 
                    alt="Thumbnail" 
                    fill
                    sizes="48px"
                    className="object-cover" 
                   />
                 </button>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
