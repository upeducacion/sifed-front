import { Suspense } from "react";
import ProgramExplorer from "@/components/posgrado/program-explorer";

export const metadata = {
  title: "Planes de Estudio | Posgrado Educación - UNCP",
  description: "Explora las mallas curriculares actualizadas de nuestras Maestrías y Doctorado. Conoce las asignaturas, créditos y duración de cada programa académico.",
};

export default function PlanesEstudioPage() {
  return (
    <section className="w-full pt-20 pb-24 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-brand-600 uppercase bg-brand-50 rounded-full">
            Mallas Curriculares
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-950 mb-6 tracking-tight">
            Planes de Estudio
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Programas diseñados con rigor científico y pertinencia social para formar
            los líderes que la educación del siglo XXI demanda.
          </p>
        </div>

        {/* Componente Interactivo */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted-foreground text-sm">Cargando planes de estudio…</div>}>
          <ProgramExplorer />
        </Suspense>

      </div>
    </section>
  );
}
