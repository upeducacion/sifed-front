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
      className="group bg-white rounded-[2.5rem] border border-border overflow-hidden hover:border-brand-200 hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      {/* Portada */}
      <div className="relative h-64 overflow-hidden bg-muted/20 flex items-center justify-center">
        {program.imagenPortada && !imgError ? (
          <UnoptImage
            src={getStorageUrl(program.imagenPortada)}
            alt={program.titulo}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
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
      <div className="p-8 flex flex-col flex-1">
        <h3 className="font-serif text-2xl font-black text-brand-950 mb-4 group-hover:text-brand-600 transition-colors leading-tight">
          {program.titulo}
        </h3>
        
        <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-2">
          {program.descripcionCorta}
        </p>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-brand-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase leading-tight">
              {program.infoGeneral.duracion || "No definida"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
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
          className="mt-auto inline-flex items-center justify-center gap-2 w-full py-4 bg-brand-50 text-brand-950 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-brand-950 group-hover:text-white transition-all duration-300"
        >
          Explorar Programa <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
