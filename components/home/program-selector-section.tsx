"use client";

import { BookOpen, GraduationCap, Award, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    title: "Maestrías",
    desc: "Especializaciones avanzadas con enfoque en investigación y gestión.",
    icon: <BookOpen aria-hidden="true" className="w-8 h-8" />,
    href: "/posgrado/maestrias",
    count: "04 Menciones",
    color: "bg-brand-50 text-brand-600 border-brand-100"
  },
  {
    title: "Doctorados",
    desc: "Máximo grado académico para líderes en la producción científica.",
    icon: <GraduationCap aria-hidden="true" className="w-8 h-8" />,
    href: "/posgrado/doctorados",
    count: "01 Programa",
    color: "bg-brand-950 text-uncp-gold border-brand-800"
  },
  {
    title: "Diplomados",
    desc: "Programas de actualización profesional de corta duración.",
    icon: <Award aria-hidden="true" className="w-8 h-8" />,
    href: "/posgrado/diplomados",
    count: "Especialización",
    color: "bg-white text-brand-950 border-border"
  },
  {
    title: "Formación Continua",
    desc: "Cursos y talleres para potenciar habilidades específicas.",
    icon: <Zap aria-hidden="true" className="w-8 h-8" />,
    href: "/posgrado/formacion-continua",
    count: "Capacitación",
    color: "bg-white text-brand-950 border-border"
  }
];

export default function ProgramSelectorSection() {
  return (
    <section className="py-24 bg-neutral-50 border-b border-border overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            {/* A11y: Cambio a text-amber-700 en lugar de uncp-gold sobre fondo claro para pasar contraste WCAG AA */}
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700 mb-2 block">
              Oferta Académica
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-950 leading-tight">
              Encuentre el programa ideal <br />
              <span className="text-brand-600">para su crecimiento</span>
            </h2>
          </div>
          <Link 
            href="/posgrado/programas" 
            aria-label="Explorar todos los programas académicos y grados"
            className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-brand-950 hover:text-brand-600 transition-colors"
          >
            Explorar todos <ArrowRight aria-hidden="true" className="w-4 h-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.title} 
              href={cat.href}
              aria-label={`Ver información sobre ${cat.title}`}
              className={`group p-8 rounded-[2.5rem] border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between min-h-[320px] ${cat.color}`}
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 ${cat.title === 'Doctorados' ? 'bg-white/10' : 'bg-brand-50'}`}>
                  {cat.icon}
                </div>
                <h3 className={`text-2xl font-black mb-3 tracking-tighter ${cat.title === 'Doctorados' ? 'text-white' : 'text-brand-950'}`}>{cat.title}</h3>
                {/* A11y: Mejorada la opacidad de text-brand-100/70 a text-brand-100/90 para legibilidad */}
                <p className={`text-sm font-medium leading-relaxed ${cat.title === 'Doctorados' ? 'text-brand-100/90' : 'text-muted-foreground'}`}>
                  {cat.desc}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between">
                {/* A11y: Cambio de text-brand-400 (muy claro) a text-brand-600 o amber-500 para contraste seguro */}
                <span className={`text-[10px] font-black uppercase tracking-widest ${cat.title === 'Doctorados' ? 'text-uncp-gold' : 'text-brand-600'}`}>
                  {cat.count}
                </span>
                <div aria-hidden="true" className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${cat.title === 'Doctorados' ? 'bg-white/10 group-hover:bg-uncp-gold group-hover:text-brand-950' : 'bg-brand-950 text-white group-hover:bg-brand-600'}`}>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
