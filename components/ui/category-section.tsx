"use client";

import { motion } from "framer-motion";
import { Noticia } from "@/types/noticia";
import EditorialCard from "./editorial-card";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";

interface CategorySectionProps {
  titulo: string;
  descripcion: string;
  noticias: Noticia[];
  colorScheme: {
    accent: string;
    bg: string;
    text: string;
    border: string;
  };
  isReversed?: boolean;
}

export default function CategorySection({ 
  titulo, 
  descripcion, 
  noticias, 
  colorScheme,
  isReversed = false 
}: CategorySectionProps) {
  if (noticias.length === 0) return null;

  return (
    <section className={cn(
      "relative flex min-h-screen w-full flex-col border-b lg:flex-row",
      colorScheme.bg,
      colorScheme.border
    )}>
      {/* COLUMNA DE IDENTIDAD (STICKY) */}
      <div className={cn(
        "flex w-full flex-col justify-between overflow-hidden p-6 sm:p-8 lg:sticky lg:top-0 lg:h-screen lg:w-[35%] lg:p-16 xl:w-[30%]",
        isReversed ? "lg:order-last border-l" : "border-r",
        colorScheme.border
      )}>
        <motion.div
          initial={{ opacity: 0, x: isReversed ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <span className={cn("text-[10px] font-black uppercase tracking-[0.4em]", colorScheme.accent)}>
              Sección Editorial
            </span>
            <h2 className="font-serif text-4xl font-black leading-none tracking-tighter text-brand-950 sm:text-5xl xl:text-7xl">
              {titulo}
            </h2>
          </div>
          
          <p className="text-sm md:text-base text-brand-950/60 font-medium leading-relaxed max-w-xs">
            {descripcion}
          </p>
        </motion.div>

        {/* Indicador de Continuidad */}
        <div className="hidden lg:flex items-center gap-4">
          <div className={cn("h-12 w-px", colorScheme.accent.replace('text', 'bg'))} />
          <span className="text-[9px] font-black uppercase tracking-widest text-brand-950/30">Desliza para ver más</span>
          <ArrowDown className={cn("h-3 w-3 animate-bounce", colorScheme.accent)} />
        </div>
      </div>

      {/* COLUMNA DE CONTENIDO (SCROLLABLE CON SNAP) */}
      <div className="min-w-0 flex-1 snap-y snap-mandatory overflow-y-auto">
        <div className="flex flex-col">
          {noticias.map((noticia) => (
            <div key={noticia.id} className="snap-start snap-always">
                <EditorialCard 
                    noticia={noticia} 
                />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
