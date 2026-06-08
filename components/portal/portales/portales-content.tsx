"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Globe,
  FlaskConical,
  GraduationCap,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PageHero from "@/components/ui/page-hero";
import {
  PORTALES_INSTITUCIONALES,
  CATEGORIAS_PORTAL,
  type CategoriaPortal,
} from "@/data/portales-institucionales";

const CATEGORIA_ICONS: Record<CategoriaPortal, React.ReactNode> = {
  "Regulación Nacional":        <Scale className="w-5 h-5" />,
  "Organismos Internacionales": <Globe className="w-5 h-5" />,
  "Ciencia y Tecnología":       <FlaskConical className="w-5 h-5" />,
  "Universidad":                <GraduationCap className="w-5 h-5" />,
};

export default function PortalesContent() {
  const [filtroActivo, setFiltroActivo] = useState<CategoriaPortal | "Todos">("Todos");

  const portalsFiltrados =
    filtroActivo === "Todos"
      ? PORTALES_INSTITUCIONALES
      : PORTALES_INSTITUCIONALES.filter((p) => p.categoria === filtroActivo);

  return (
    <div className="min-h-screen bg-white pb-32">
      <PageHero
        title="Portales Institucionales"
        subtitle="Recursos Académicos"
        description="Accede a los principales organismos de regulación, ciencia y cooperación para fortalecer tu investigación y formación."
        imageSrc="/images/fondouncp1920x1080.webp"
        size="compact"
        breadcrumbs={[{ label: "Portales Institucionales" }]}
      />

      {/* Barra de filtros flotante */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-30">
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-brand-100 p-2">
          <div className="flex items-center gap-1 p-1 bg-brand-50 rounded-2xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFiltroActivo("Todos")}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[9px] font-black transition-all whitespace-nowrap uppercase tracking-[0.2em]",
                filtroActivo === "Todos"
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                  : "text-brand-900/40 hover:text-brand-950"
              )}
            >
              Todos
            </button>
            {CATEGORIAS_PORTAL.map((cat) => (
              <button
                key={cat}
                onClick={() => setFiltroActivo(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[9px] font-black transition-all whitespace-nowrap uppercase tracking-[0.2em]",
                  filtroActivo === cat
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                    : "text-brand-900/40 hover:text-brand-950"
                )}
              >
                {cat}
              </button>
            ))}
            <div className="ml-auto bg-brand-950 text-white px-5 py-3 rounded-2xl flex items-center gap-3 shrink-0">
              <ExternalLink className="w-4 h-4 text-uncp-gold" />
              <span className="text-xs font-black text-uncp-gold">{portalsFiltrados.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {portalsFiltrados.map((portal) => (
              <motion.a
                key={portal.id}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="group bg-white rounded-[2rem] border border-brand-100 shadow-sm hover:shadow-xl hover:border-brand-200 hover:-translate-y-1 transition-all duration-500 p-8 flex flex-col gap-5"
              >
                {/* Header de card */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                    {CATEGORIA_ICONS[portal.categoria]}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-brand-300 opacity-0 group-hover:opacity-100 group-hover:text-uncp-gold transition-all duration-300" />
                </div>

                {/* Nombre y utilidad */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="font-serif font-black text-xl text-brand-950 leading-tight">
                    {portal.nombre}
                  </h3>
                  <p className="text-sm text-brand-900/60 leading-relaxed font-medium">
                    {portal.utilidad}
                  </p>
                </div>

                {/* Footer de card */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-50">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-600/60 group-hover:text-uncp-gold transition-colors duration-300">
                    {portal.categoria}
                  </span>
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-brand-950/40 group-hover:text-brand-950 transition-colors duration-300">
                    Visitar <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Watermark */}
      <section className="py-20 opacity-20 text-center select-none">
        <h2 className="text-2xl font-serif font-bold text-brand-950 uppercase tracking-[0.5em]">
          Portales Institucionales
        </h2>
      </section>
    </div>
  );
}
