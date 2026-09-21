"use client";

import { useState } from "react";
import { UnoptImage } from "@/components/ui/unopt-image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, GraduationCap, Image as ImageIcon } from "lucide-react";
import { ProgramData } from "@/types/programa";
import { getStorageUrl } from "@/lib/utils";

interface ProgramCardProps {
  program: ProgramData;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const [imgError, setImgError] = useState(false);
  
  // Aseguramos que la ruta base coincida con el tipo
  const basePath = program.tipo === "maestria" ? "maestrias" : 
                   program.tipo === "doctorado" ? "doctorados" : 
                   program.tipo === "diplomado" ? "diplomados" : 
                   program.tipo === "taller" ? "talleres" : "cursos";
                   
  const detailHref = `/posgrado/${basePath}/${program.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group container-query-name flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white transition-[border-color,box-shadow] duration-500 hover:border-brand-200 hover:shadow-2xl"
    >
      {/* Portada */}
      <div className="cq-card-image relative max-h-64 overflow-hidden bg-muted/20 flex items-center justify-center">
        {program.imagenPortada && !imgError ? (
          <UnoptImage
            src={getStorageUrl(program.imagenPortada)}
            alt={program.titulo}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-brand-50 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-brand-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
        
        {/* Badge de Categoría */}
        {program.categoria && (
          <div className="absolute top-6 left-6">
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
              {program.categoria}
            </span>
          </div>
        )}

      </div>

      {/* Contenido */}
      <div className="cq-card-content flex flex-1 flex-col">
        <h3 className="cq-card-title mb-3 font-serif font-black leading-tight text-brand-950 transition-colors group-hover:text-brand-600">
          {program.titulo}
        </h3>
        
        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground @[28rem]:mb-8">
          {program.descripcionCorta}
        </p>

        {/* Mini Stats */}
        <div className="cq-card-stats grid grid-cols-1 border-t border-brand-50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase leading-tight">
              {program.infoGeneral.duracion || "No definida"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase leading-tight truncate">
              {program.infoGeneral.certificacion || "No definida"}
            </div>
          </div>
        </div>

        {/* Link Final */}
        <Link 
          href={detailHref}
          className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-950 py-4 text-xs font-black uppercase tracking-widest text-white transition-colors duration-[var(--motion-duration-standard)] ease-[var(--motion-ease)] hover:bg-brand-800 active:bg-brand-900"
        >
          Explorar Programa <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
