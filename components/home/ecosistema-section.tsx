"use client";

import Link from "next/link";
import { UnoptImage } from "@/components/ui/unopt-image";
import { Newspaper, MonitorPlay, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { EXTERNAL_LINKS } from "@/lib/constants";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: i * 0.15 },
  }),
};

export default function EcosistemaSection() {
  return (
    <section className="w-full bg-brand-50 flex items-center py-20 px-6 lg:px-12 border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">

        <motion.div
          className="mb-12 text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-uncp-gold mb-2 block">Ecosistema Digital</span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-950 leading-tight">Plataformas Académicas</h2>
          <p className="text-base text-muted-foreground font-medium mt-3">Sistemas integrados para la gestión universitaria.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* CARD 1: PORTAL */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.35, ease: EASE } }}
            className="group relative flex flex-col rounded-[2rem] border-2 border-transparent bg-background p-8 shadow-sm cursor-pointer overflow-hidden
              transition-all duration-500
              hover:shadow-[0_20px_60px_rgba(59,130,246,0.25)]"
            style={{ border: "2px solid transparent", backgroundClip: "padding-box" }}
          >
            {/* Borde degradado al hover */}
            <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1, #b4913c)", padding: "2px", borderRadius: "2rem" }} />
            <div className="absolute inset-[2px] rounded-[calc(2rem-2px)] bg-background pointer-events-none -z-10" />

            {/* Brillo en hover — barre la card */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]"
              style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.07) 0%, rgba(99,102,241,0.04) 50%, rgba(180,145,60,0.06) 100%)" }} />

            {/* Logo watermark */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.04] group-hover:opacity-[0.12] transition-opacity duration-700 pointer-events-none group-hover:scale-110 origin-top-right transform-gpu">
              <UnoptImage src="/images/logo-posgrado-educacion.webp" alt="" width={180} height={180} />
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <motion.div
                  className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100"
                  whileHover={{ scale: 1.18, rotate: -8, transition: { duration: 0.3, ease: "backOut" } }}
                >
                  <Newspaper className="h-7 w-7" strokeWidth={1.5} />
                </motion.div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-brand-950 mb-3 transition-colors duration-300 group-hover:text-brand-600">
                  Portal Informativo
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 transition-colors duration-300 group-hover:text-brand-800">
                  Espacio de acceso público. Consulta reglamentos, cronogramas, noticias y comunicados oficiales.
                </p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {['Transparencia', 'Noticias', 'Eventos', 'Calendario'].map((item, i) => (
                    <li key={item} className="flex items-center gap-2 text-brand-800 font-bold text-xs md:text-sm
                      transition-transform duration-300 group-hover:translate-x-1"
                      style={{ transitionDelay: `${i * 40}ms` }}>
                      <div className="h-1.5 w-1.5 rounded-full bg-uncp-gold shrink-0 transition-all duration-300 group-hover:scale-150" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 pt-6 border-t border-border transition-colors duration-300 group-hover:border-brand-200">
                <Link href="/posgrado" className="inline-flex items-center gap-2 text-base font-bold text-brand-600 underline decoration-2 underline-offset-4 hover:text-brand-800 transition-colors group/link">
                  Visitar Portal Público
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-2" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* CARD 2: INTRANET */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.35, ease: EASE } }}
            className="group relative flex flex-col rounded-[2rem] p-8 text-white cursor-pointer overflow-hidden
              transition-shadow duration-500
              hover:shadow-[0_28px_70px_rgba(30,49,82,0.7),0_0_0_1px_rgba(180,145,60,0.4)]"
            style={{ background: "linear-gradient(135deg, #1e3152 0%, #0d1623 60%, #050810 100%)" }}
          >
            {/* Glow base */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-50 transition-opacity duration-600 pointer-events-none" />

            {/* Glow superior — aparece en hover */}
            <div className="absolute -top-10 -left-10 w-60 h-60 bg-brand-400 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-600 pointer-events-none" />

            {/* Logo watermark */}
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 origin-top-right transform-gpu pointer-events-none grayscale group-hover:grayscale-0">
              <UnoptImage src="/images/logo-posgrado-educacion.webp" alt="" width={160} height={160} className="object-contain" />
            </div>

            {/* Línea dorada top — aparece en hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, #b4913c, #d4a853, #b4913c, transparent)" }} />

            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <motion.div
                  className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white border border-white/10 backdrop-blur-md"
                  whileHover={{ scale: 1.18, rotate: 8, transition: { duration: 0.3, ease: "backOut" } }}
                >
                  <MonitorPlay className="h-7 w-7" strokeWidth={1.5} />
                </motion.div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">Intranet UP Educación</h3>
                <p className="text-sm md:text-base leading-relaxed mb-6 transition-colors duration-300 text-brand-50/80 group-hover:text-white/90">
                  Gestión académica privada. Accede de forma segura a tus cursos, notas, matrícula y trámites digitales.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl transition-all duration-300
                    bg-white/5 border border-white/10
                    group-hover:bg-white/10 group-hover:border-brand-400/40 group-hover:-translate-y-1">
                    <div className="text-xl font-bold text-uncp-gold mb-0.5">24/7</div>
                    <div className="text-[10px] text-brand-300 uppercase tracking-widest font-bold">Disponibilidad</div>
                  </div>
                  <div className="p-3 rounded-xl transition-all duration-300 delay-75
                    bg-white/5 border border-white/10
                    group-hover:bg-white/10 group-hover:border-brand-400/40 group-hover:-translate-y-1">
                    <div className="text-xl font-bold text-brand-400 mb-0.5">100%</div>
                    <div className="text-[10px] text-brand-300 uppercase tracking-widest font-bold">Seguro</div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 transition-colors duration-300 group-hover:border-white/20">
                <a href={EXTERNAL_LINKS.AULA_VIRTUAL} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-base shadow-xl
                  transition-all duration-300 bg-brand-600 text-white hover:bg-white hover:text-brand-950 group-hover:shadow-brand-600/40">
                  Iniciar Sesión Segura
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
