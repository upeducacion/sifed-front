"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import PageHero from "@/components/ui/page-hero";
import { UnoptImage } from "@/components/ui/unopt-image";
import {
  PORTALES_INSTITUCIONALES,
  CATEGORIAS_PORTAL,
  type CategoriaPortal,
} from "@/data/portales-institucionales";

function PortalLogo({ nombre, logoUrl }: { nombre: string; logoUrl: string }) {
  const [hasError, setHasError] = useState(false);
  const logoLabel = nombre.includes("SUNEDU")
    ? "SUNEDU"
    : nombre.includes("MINEDU")
      ? "MINEDU"
      : nombre.includes("UNESCO")
        ? "UNESCO"
        : nombre.includes("OECD")
          ? "OECD"
          : nombre.includes("CONCYTEC") || nombre.includes("ALICIA")
            ? "CONCYTEC"
            : nombre.includes("UNCP")
              ? "UNCP"
              : nombre;

  if (!logoUrl || hasError) {
    return <span className="text-[10px] font-black tracking-tight text-brand-600">{logoLabel}</span>;
  }

  return (
    <UnoptImage
      src={logoUrl}
      alt={`Logo de ${nombre}`}
      width={112}
      height={48}
      unoptimized
      className="h-auto max-h-10 w-auto max-w-24 object-contain"
      onError={() => setHasError(true)}
    />
  );
}

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
      <section className="page-shell-wide relative z-30 -mt-10">
        <div className="container-query-name cq-toolbar flex flex-col items-center gap-4 rounded-xl border border-brand-100 bg-white/90 p-2 shadow-2xl backdrop-blur-xl lg:flex-row">
          <div className="cq-toolbar-tabs flex items-center gap-1 overflow-x-auto rounded-md bg-brand-50 p-1 no-scrollbar">
            <button
              onClick={() => setFiltroActivo("Todos")}
              className={cn(
                "whitespace-nowrap rounded-md px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all",
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
                  "whitespace-nowrap rounded-md px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all",
                  filtroActivo === cat
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                    : "text-brand-900/40 hover:text-brand-950"
                )}
              >
                {cat}
              </button>
            ))}
            <div className="ml-auto flex shrink-0 items-center gap-3 rounded-md bg-brand-950 px-5 py-3 text-white">
              <ExternalLink className="w-4 h-4 text-uncp-gold" />
              <span className="text-xs font-black text-uncp-gold">{portalsFiltrados.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de cards */}
      <section className="page-shell-wide py-16">
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
                className="group flex flex-col gap-5 rounded-xl border border-brand-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg"
              >
                {/* Header de card */}
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-28 shrink-0 items-center justify-center rounded-md bg-brand-50 px-3 text-brand-600">
                    <PortalLogo nombre={portal.nombre} logoUrl={portal.logoUrl} />
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
