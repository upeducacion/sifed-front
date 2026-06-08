"use client"

import { Noticia } from '@/types/noticia';
import { Calendar, ImageIcon } from 'lucide-react';
import { UnoptImage } from "@/components/ui/unopt-image";
import Link from 'next/link';
import { cn, getStorageUrl } from '@/lib/utils';

interface NewsCardProps {
  noticia: Noticia;
  className?: string;
  featured?: boolean;
}

export function NewsCard({ noticia, className, featured = false }: NewsCardProps) {
  const hasImage = !!noticia.imagen_url;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-neutral-900 shadow-md hover:shadow-2xl w-full h-full min-h-[250px]",
        "border border-white/5 hover:border-white/20 transition-all duration-400 ease-out",
        "hover:-translate-y-1 hover:scale-[1.005]",
        featured ? "md:min-h-[500px]" : "md:min-h-[300px]",
        className
      )}
    >
      <Link href={`/noticias/${noticia.slug}`} className="block h-full w-full">
        
        {/* Layer 1: Image */}
        <div className="absolute inset-0 z-0">
          {hasImage ? (
            <UnoptImage
              src={getStorageUrl(noticia.imagen_url!)}
              alt={noticia.titulo}
              fill
              className="object-cover transition-all duration-700 ease-out brightness-[0.85] group-hover:scale-105 group-hover:brightness-100"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
            />          ) : (
            <div className="h-full w-full bg-neutral-800 flex items-center justify-center relative overflow-hidden">
               <ImageIcon className="h-12 w-12 text-white/20" />
            </div>
          )}
          
          {/* Layer 2: Gradient Refinado */}
          <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />
        </div>

        {/* Layer 3: Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 md:p-8">
          
          {/* Badges Minimalistas */}
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-white">
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
              <Calendar className="h-3 w-3 text-white/70" />
              <span className="text-white/90 tracking-wide">{noticia.fecha_humana}</span>
            </span>
            {noticia.destacada && (
              <span className="bg-white/90 text-black px-3 py-1 rounded-full font-bold shadow-sm backdrop-blur-sm">
                Destacada
              </span>
            )}
          </div>

          {/* Title - Blanco Puro */}
          <h3 className={cn(
            "font-serif font-bold text-white leading-tight drop-shadow-md transition-all duration-300",
            "group-hover:-translate-y-1",
            featured ? "text-3xl md:text-4xl lg:text-5xl mb-4" : "text-lg md:text-xl mb-3"
          )}>
            {noticia.titulo}
          </h3>

          {/* Summary - Oculto si es featured, visible si no */}
          {!featured && (
            <div className="overflow-hidden transition-all duration-500 ease-in-out max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100">
              <p className="text-white/80 text-sm md:text-base line-clamp-2 leading-relaxed font-light tracking-wide drop-shadow-sm">
                {noticia.resumen}
              </p>
            </div>
          )}

        </div>
      </Link>
    </div>
  );
}
