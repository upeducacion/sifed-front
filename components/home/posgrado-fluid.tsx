"use client";

import React from "react";
import { UnoptImage } from "@/components/ui/unopt-image";
import { Users, ArrowRight, GraduationCap, Award, Landmark } from "lucide-react";
import Link from "next/link";

interface ProgramaResumen {
  id: number;
  titulo: string;
  slug: string;
  tipo: string;
  imagen: string;
}

interface PosgradoFluidProps {
  maestrias: ProgramaResumen[];
  doctorados: ProgramaResumen[];
}

/**
 * CARD EDITORIAL: El centro del diseño. Visual, compacta y elegante.
 */
function VisualProgramCard({ programa }: { programa: ProgramaResumen }) {
  const basePath = programa.tipo === "maestria" ? "/posgrado/maestrias" : "/posgrado/doctorados";
  
  return (
    <Link 
      href={`${basePath}/${programa.slug}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-brand-900 shadow-lg transition-all duration-500 hover:border-uncp-gold/50 hover:shadow-uncp-gold/5"
    >
      <UnoptImage
        src={programa.imagen}
        alt={programa.titulo}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 z-20 p-4">
        <h4 className="font-serif text-sm md:text-base font-bold text-white group-hover:text-uncp-gold transition-colors leading-tight">
          {programa.titulo}
        </h4>
      </div>
    </Link>
  );
}

export default function PosgradoFluid({ maestrias, doctorados }: PosgradoFluidProps) {
  return (
    <section className="relative w-full bg-brand-950">
      
      {/* ── FONDO ATMOSFÉRICO (FIJO Y VISIBLE) ──────────────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <UnoptImage 
            src="/images/fondouncp1920x1080.webp" 
            alt="" 
            fill 
            className="object-cover opacity-45 grayscale brightness-[0.5]" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-950/60 via-brand-950/10 to-brand-950/90" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LADO IZQUIERDO: ANCLA INSTITUCIONAL (STICKY) */}
          <aside className="lg:col-span-3 py-12 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between border-r border-white/5">
            <div className="space-y-6">
               <div className="h-12 w-12 relative opacity-90">
                  <UnoptImage src="/images/logo-posgrado-educacion.webp" alt="" fill className="object-contain" />
               </div>
               <h2 className="font-serif text-5xl font-black text-white leading-[0.85] tracking-tighter">
                 OFERTA <br /> <span className="text-uncp-gold">ACADÉMICA</span>
               </h2>
               <div className="h-1 w-10 bg-uncp-gold" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 leading-relaxed max-w-[180px]">
                 Investigación y Excelencia Académica.
               </p>
            </div>

            <div className="space-y-4 pb-8">
               <Link href="/posgrado/nosotros" className="group flex items-center gap-3 text-white hover:text-uncp-gold transition-all">
                  <Landmark className="h-4 w-4 text-uncp-gold" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Nuestra Institución</span>
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
               </Link>
            </div>
          </aside>

          {/* LADO DERECHO: FLUJO DE CONTENIDO (COMPACTADO) */}
          <main className="lg:col-span-9 py-12 space-y-12">
            
            {/* 01. INTRO / PROPÓSITO */}
            <article className="max-w-2xl">
               <span className="text-uncp-gold text-[9px] font-black uppercase tracking-[0.5em] mb-3 block">/ Propósito</span>
               <h3 className="text-2xl md:text-3xl font-serif font-black text-white leading-tight mb-3">Liderazgo que Rediseña el Futuro</h3>
               <p className="text-white/60 text-sm font-medium leading-relaxed italic border-l border-uncp-gold/30 pl-4">
                 &quot;Formamos investigadores con pensamiento crítico capaces de transformar la realidad educativa nacional.&quot;
               </p>
            </article>

            {/* 02. MAESTRÍAS (LISTADO COMPLETO) */}
            <article className="space-y-4">
               <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-3">
                     <Award className="h-4 w-4 text-uncp-gold" />
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">Maestrías Profesionales</h4>
                  </div>
                  <Link href="/posgrado/maestrias" className="text-[8px] font-black uppercase tracking-widest text-uncp-gold hover:text-white transition-colors">Ver Directorio</Link>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {maestrias.map(m => <VisualProgramCard key={m.id} programa={m} />)}
               </div>
            </article>

            {/* 03. DOCTORADOS (LISTADO COMPLETO) */}
            <article className="space-y-4">
               <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-3">
                     <GraduationCap className="h-4 w-4 text-uncp-gold" />
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/90">Doctorados Académicos</h4>
                  </div>
                  <Link href="/posgrado/doctorados" className="text-[8px] font-black uppercase tracking-widest text-uncp-gold hover:text-white transition-colors">Ver Directorio</Link>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {doctorados.map(d => <VisualProgramCard key={d.id} programa={d} />)}
               </div>
            </article>

            {/* 04. COMUNIDAD / DOCENTES */}
            <article className="relative overflow-hidden rounded-xl bg-white/[0.03] border border-white/10 p-6 group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Users className="h-20 w-20 text-white" />
               </div>
               <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="h-12 w-12 rounded-xl bg-uncp-gold/10 border border-uncp-gold/20 flex items-center justify-center">
                     <Landmark className="h-6 w-6 text-uncp-gold" />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-1">
                     <h4 className="text-lg font-serif font-black text-white leading-tight">Plana Docente de Excelencia</h4>
                     <p className="text-white/40 text-[10px] font-medium leading-relaxed">Investigadores Renacyt líderes en producción científica nacional e internacional.</p>
                  </div>
                  <Link href="/posgrado/plana-docente" className="shrink-0 px-5 py-2.5 bg-white text-brand-950 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-uncp-gold transition-all">
                     Conocer Investigadores
                  </Link>
               </div>
            </article>

          </main>
        </div>
      </div>
    </section>
  );
}
