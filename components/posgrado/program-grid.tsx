"use client";

import { ProgramData, ProgramType } from "@/types/programa";
import ProgramCard from "./program-card";

interface ProgramGridProps {
  programs: ProgramData[];
  type: ProgramType;
}

export default function ProgramGrid({ programs, type }: ProgramGridProps) {
  const getTitle = () => {
    switch (type) {
      case 'maestria': return 'MAESTRÍA';
      case 'doctorado': return 'DOCTORADO';
      case 'diplomado': return 'DIPLOMADO';
      case 'curso': return 'CURSO O TALLER';
      case 'taller': return 'TALLER';
      default: return 'PROGRAMA';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'maestria': return 'Explora nuestras maestrías diseñadas para impulsar tu crecimiento profesional y capacidad investigadora.';
      case 'doctorado': return 'Explora nuestros doctorados diseñados para llevar tu investigación al más alto nivel académico.';
      case 'diplomado': return 'Explora nuestros diplomados enfocados en la actualización profesional de alto impacto.';
      case 'curso': return 'Explora nuestra formación continua diseñada para potenciar tus habilidades específicas.';
      case 'taller': return 'Explora nuestros talleres prácticos diseñados para aplicar nuevas metodologías directamente.';
      default: return 'Explora nuestros programas diseñados para impulsar tu crecimiento profesional.';
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">

        {/* Título de Sección */}
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-600 mb-4 block">Nuestros Programas</span>
          <h2 className="text-4xl md:text-5xl font-serif font-black text-brand-950 mb-6 uppercase">
            ELIGE TU {getTitle()}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {getDescription()}
          </p>
        </div>

        {/* Grid de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-brand-100 rounded-[3rem]">
            <p className="text-muted-foreground font-medium">Aún no hay programas disponibles.</p>
          </div>
        )}
      </div>
    </section>
  );
}
