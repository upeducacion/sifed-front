"use client";

import { useRef } from "react";
import { UnoptImage } from "@/components/ui/unopt-image";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProgramaResumen {
  id: number;
  titulo: string;
  slug: string;
  tipo: string;
  imagen: string;
}

interface PosgradoRevealProps {
  maestrias: ProgramaResumen[];
  doctorados: ProgramaResumen[];
}

const CARD_WIDTH = 380;
const CARD_GAP = 24;

/**
 * Tarjeta de Programa Unificada y Minimalista
 */
function ProgramCard({ programa }: { programa: ProgramaResumen }) {
  const basePath = programa.tipo === "maestria" ? "/posgrado/maestrias" : "/posgrado/doctorados";
  
  return (
    <Link 
      href={`${basePath}/${programa.slug}`}
      className="group relative block aspect-[16/10] w-[380px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-brand-900 shadow-2xl transition-all duration-500 hover:border-uncp-gold/40"
    >
      <UnoptImage
        src={programa.imagen}
        alt={programa.titulo}
        fill
        sizes="(max-width: 768px) 100vw, 380px"
        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
      />      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 z-20 p-6">
        <h4 className="font-serif text-lg md:text-xl font-black text-white leading-tight drop-shadow-lg group-hover:text-uncp-gold transition-colors">
          {programa.titulo}
        </h4>
        <div className="mt-3 h-0.5 w-0 bg-uncp-gold transition-all duration-500 group-hover:w-16" />
      </div>
    </Link>
  );
}

function ProgressDot({ i, step }: { i: number; step: MotionValue<number> }) {
  const backgroundColor = useTransform(step, (v) => Math.round(v) === i ? "#D4AF37" : "transparent");
  const scale = useTransform(step, (v) => Math.round(v) === i ? 1.4 : 1);
  const opacity = useTransform(step, (v) => Math.round(v) === i ? 1 : 0.3);

  return (
    <div className="group relative flex items-center justify-center">
      <motion.div 
        className="h-2 w-2 rounded-full border border-uncp-gold"
        style={{ backgroundColor, scale, opacity }}
      />
    </div>
  );
}

export default function PosgradoReveal({ maestrias, doctorados }: PosgradoRevealProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // --- LÓGICA DE RANGOS (h-800vh) ---
  
  const opacity0 = useTransform(smoothProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const pointer0 = useTransform<number, "auto" | "none">(smoothProgress, [0, 0.1, 0.2], ["auto", "auto", "none"]);
  const y0 = useTransform(smoothProgress, [0, 0.1, 0.2], [0, 0, -30]);

  const opacity1 = useTransform(smoothProgress, [0.15, 0.2, 0.45, 0.5], [0, 1, 1, 0]);
  const pointer1 = useTransform<number, "auto" | "none">(smoothProgress, [0.15, 0.2, 0.45, 0.5], ["none", "auto", "auto", "none"]);
  const y1 = useTransform(smoothProgress, [0.15, 0.2, 0.45, 0.5], [30, 0, 0, -30]);

  const maestriasX = useTransform(smoothProgress, [0.2, 0.45], [0, -Math.max(0, (maestrias.length * (CARD_WIDTH + CARD_GAP)) - 800)]);

  const opacity2 = useTransform(smoothProgress, [0.45, 0.5, 0.75, 0.8], [0, 1, 1, 0]);
  const pointer2 = useTransform<number, "auto" | "none">(smoothProgress, [0.45, 0.5, 0.75, 0.8], ["none", "auto", "auto", "none"]);
  const y2 = useTransform(smoothProgress, [0.45, 0.5, 0.75, 0.8], [30, 0, 0, -30]);

  const doctoradosX = useTransform(smoothProgress, [0.5, 0.75], [0, -Math.max(0, (doctorados.length * (CARD_WIDTH + CARD_GAP)) - 800)]);

  const opacity3 = useTransform(smoothProgress, [0.75, 0.8, 1], [0, 1, 1]);
  const pointer3 = useTransform<number, "auto" | "none">(smoothProgress, [0.75, 0.8, 1], ["none", "auto", "auto"]);
  const y3 = useTransform(smoothProgress, [0.75, 0.8, 1], [30, 0, 0]);

  const backgroundScale = useTransform(smoothProgress, [0, 1], [1.1, 1]);
  const step = useTransform(smoothProgress, [0, 0.3, 0.6, 0.9], [1, 2, 3, 4]);

  return (
    <div ref={scrollRef} className="relative h-[800vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black font-sans">
        
        <div className="absolute inset-0 bg-brand-950/40 z-0" />
        <motion.div style={{ scale: backgroundScale }} className="absolute inset-0 z-0">
          <UnoptImage src="/images/fondouncp1920x1080.webp" alt="" fill className="object-cover opacity-10 grayscale" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-brand-950/20 to-transparent z-10" />
        </motion.div>

        <div className="container mx-auto h-full px-8 lg:px-16 relative z-20">
          <div className="grid grid-cols-12 h-full items-center">
            
            {/* 25% IDENTIDAD */}
            <div className="col-span-12 lg:col-span-3 flex flex-col justify-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <div className="mb-12 h-16 w-16 relative">
                   <UnoptImage src="/images/logo-posgrado-educacion.webp" alt="Logo" fill className="object-contain" />
                </div>
                <h2 className="font-serif text-5xl md:text-7xl font-black text-white leading-[0.85] tracking-tighter mb-8">
                  OFERTA <br />
                  <span className="text-brand-400">POSGRADO</span>
                </h2>
                <div className="h-1 w-12 bg-uncp-gold mb-6" />
                <p className="text-brand-50/40 text-xs font-bold uppercase tracking-[0.3em] leading-relaxed">
                  Excelencia Académica <br /> Tradición UNCP
                </p>
              </motion.div>
            </div>

            {/* 10% ESPACIADOR */}
            <div className="hidden lg:block lg:col-span-1" />

            {/* 65% CONTENIDO DINÁMICO (VENTANA DE SCROLL) */}
            <div className="col-span-12 lg:col-span-8 relative h-[500px] flex items-center overflow-hidden">
              
              {/* 01. VISIÓN */}
              <motion.div style={{ opacity: opacity0, y: y0, pointerEvents: pointer0 }} className="absolute inset-x-0 flex flex-col justify-center">
                <span className="text-uncp-gold font-mono text-[10px] mb-4 font-bold tracking-[0.4em] uppercase">/ 01 Visión</span>
                <h3 className="text-4xl md:text-6xl font-black text-white mb-6 font-serif leading-tight">Liderazgo que <br /> transforma</h3>
                <p className="text-brand-50/60 text-lg max-w-lg mb-10 leading-relaxed font-medium">
                  Formamos investigadores capaces de rediseñar el futuro de la educación mediante el pensamiento crítico y el rigor científico.
                </p>
                <Link href="/posgrado" className="inline-flex w-fit items-center gap-4 text-white border-b border-white/20 pb-2 font-bold text-sm hover:text-uncp-gold hover:border-uncp-gold transition-all group">
                  Explorar Institución <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>

              {/* 02. MAESTRÍAS */}
              <motion.div style={{ opacity: opacity1, y: y1, pointerEvents: pointer1 }} className="absolute inset-x-0 flex flex-col justify-center">
                <span className="text-uncp-gold font-mono text-[10px] mb-4 font-bold tracking-[0.4em] uppercase">/ 02 Programas</span>
                <h3 className="text-3xl font-black text-white mb-8 font-serif uppercase tracking-tighter">Maestrías Profesionales</h3>
                
                <div className="w-full overflow-hidden">
                    <motion.div style={{ x: maestriasX }} className="flex gap-6">
                        {maestrias.map((m) => (
                            <ProgramCard key={m.id} programa={m} />
                        ))}
                    </motion.div>
                </div>
              </motion.div>

              {/* 03. DOCTORADOS */}
              <motion.div style={{ opacity: opacity2, y: y2, pointerEvents: pointer2 }} className="absolute inset-x-0 flex flex-col justify-center">
                <span className="text-uncp-gold font-mono text-[10px] mb-4 font-bold tracking-[0.4em] uppercase">/ 03 Grados</span>
                <h3 className="text-3xl font-black text-white mb-8 font-serif uppercase tracking-tighter">Doctorados Académicos</h3>
                
                <div className="w-full overflow-hidden">
                    <motion.div style={{ x: doctoradosX }} className="flex gap-6">
                        {doctorados.map((d) => (
                            <ProgramCard key={d.id} programa={d} />
                        ))}
                    </motion.div>
                </div>
              </motion.div>

              {/* 04. COMUNIDAD */}
              <motion.div style={{ opacity: opacity3, y: y3, pointerEvents: pointer3 }} className="absolute inset-x-0 flex flex-col justify-center">
                <span className="text-uncp-gold font-mono text-[10px] mb-4 font-bold tracking-[0.4em] uppercase">/ 04 Comunidad</span>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-6 font-serif leading-tight">Plana Docente <br /> Especializada</h3>
                <p className="text-brand-50/60 text-lg max-w-lg mb-10 leading-relaxed font-medium">
                  Aprende con investigadores certificados por Renacyt que lideran la producción científica del posgrado a nivel nacional.
                </p>
                <Link href="/posgrado/plana-docente" className="inline-flex w-fit items-center gap-4 bg-white text-brand-950 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-uncp-gold transition-all shadow-2xl">
                   Ver Investigadores <Users className="h-4 w-4" />
                </Link>
              </motion.div>

            </div>
          </div>
        </div>

        {/* INDICADORES */}
        <div className="absolute left-8 bottom-12 hidden lg:flex items-center gap-6 z-30">
          {[1, 2, 3, 4].map((i) => (
            <ProgressDot key={i} i={i} step={step} />
          ))}
          <span className="h-px w-12 bg-white/20" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Scroll Vertical para explorar</span>
        </div>
      </div>
    </div>
  );
}
