"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Home, Clock, Hash, GraduationCap, MessageCircle } from "lucide-react";
import { ProgramData } from "@/types/programa";
import { cn } from "@/lib/utils";

interface ProgramHeroProps {
  program: ProgramData;
}

export default function ProgramHero({ program }: ProgramHeroProps) {
  const breadcrumbs = [
    { label: "Posgrado", href: "/posgrado" },
    { label: `${program.tipo.charAt(0).toUpperCase()}${program.tipo.slice(1)}s`, href: `/posgrado/${program.tipo}s` },
    { label: program.titulo }
  ];

  return (
    <section className="relative w-full h-[calc(100vh-80px)] min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale opacity-60 contrast-110 brightness-50 z-0 transition-transform duration-[20s] hover:scale-105"
          style={{ backgroundImage: `url('${program.imagenPortada}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-transparent z-10" />
      </div>

      {/* Breadcrumbs */}
      <div className="absolute top-8 left-0 w-full z-30 px-6 lg:px-12">
        <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/90 shadow-sm">
          <Link href="/" className="hover:text-uncp-gold transition-colors"><Home className="w-3.5 h-3.5 mb-0.5" /></Link>
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-white/40" />
              {item.href ? (
                <Link href={item.href} className="hover:text-uncp-gold transition-colors">{item.label}</Link>
              ) : (
                <span className="text-uncp-gold drop-shadow-sm">{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {program.contenidoPreTitle && (
              <span className="block text-uncp-gold font-bold uppercase tracking-[0.3em] text-xs mb-6 drop-shadow-md">
                {program.contenidoPreTitle}
              </span>
            )}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.05] tracking-tighter drop-shadow-xl">
              {program.contenidoTitulo}
            </h1>
            <p className="text-lg text-brand-50/90 leading-relaxed max-w-xl mb-10 font-medium drop-shadow-md">
              {program.descripcionCorta}
            </p>
          </motion.div>

          {/* Stats Box & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-3 max-w-sm ml-auto w-full"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Clock, label: "Duración", value: program.infoGeneral.duracion },
                { icon: Hash, label: "Créditos", value: `${program.infoGeneral.totalCreditos || 0} Totales` },
                { icon: GraduationCap, label: "Grado", value: program.infoGeneral.certificacion, className: "col-span-2" },
              ].map((stat, idx) => (
                <div key={idx} className={cn("p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl", stat.className)}>
                  <stat.icon className="w-5 h-5 text-uncp-gold mb-2" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/50 mb-0.5">{stat.label}</p>
                  <p className="text-xs font-black text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Contact CTA */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-uncp-gold/20 to-uncp-gold/5 border border-uncp-gold/30 backdrop-blur-md relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                <MessageCircle className="w-16 h-16 text-uncp-gold" />
              </div>
              <div className="relative z-10">
                <h3 className="text-white font-serif text-lg font-bold mb-1.5 drop-shadow-md">¿Tienes dudas sobre el programa?</h3>
                <p className="text-white/80 text-xs mb-4 max-w-[240px] leading-relaxed">
                  Habla con un asesor académico para resolver tus consultas.
                </p>
                <a 
                  href={`https://wa.me/51949260658?text=Hola,%20quisiera%20información%20sobre%20el%20programa%20de%20${encodeURIComponent(program.titulo)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-uncp-gold text-brand-950 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Contactar Asesor
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
