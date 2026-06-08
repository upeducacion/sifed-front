"use client";

import PageHero from "@/components/ui/page-hero";
import Link from "next/link";
import { ArrowRight, GraduationCap, BookOpen, Download, HelpCircle, CreditCard } from "lucide-react";

export default function AdmisionHubPage() {
  return (
    <>
      <PageHero
        title="ADMISIÓN"
        subtitle="ÚNETE A NOSOTROS"
        description="El primer paso hacia la excelencia académica. Consulta los requisitos, cronogramas y procesos específicos para tu programa de interés."
        imageSrc="/images/fondouncp1920x1080.webp"
        align="center"
        size="compact"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Admisión" }
        ]}
      />

      <section className="py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <div className="text-center mb-16">
            <span className="text-brand-600 font-bold uppercase tracking-[0.2em] text-xs block mb-3">
              Selecciona tu Camino
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-950">
              Programas Académicos
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-20">
            {/* Tarjeta Maestría */}
            <Link href="/posgrado/admision/maestria" className="group block">
              <div className="bg-brand-50 rounded-3xl p-8 lg:p-12 border border-brand-100 h-full transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/5 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:scale-110 transition-transform duration-500">
                  <BookOpen size={160} />
                </div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-600 mb-6 shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <BookOpen size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-950 mb-3">Admisión Maestrías</h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Requisitos, vacantes y cronograma para postulantes a nuestros programas de maestría en educación.
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 uppercase tracking-wider group-hover:gap-4 transition-all">
                    Ver Detalles <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>

            {/* Tarjeta Doctorado */}
            <Link href="/posgrado/admision/doctorado" className="group block">
              <div className="bg-brand-950 rounded-3xl p-8 lg:p-12 border border-brand-800 h-full transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/20 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] text-white group-hover:scale-110 transition-transform duration-500">
                  <GraduationCap size={160} />
                </div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-uncp-gold mb-6 border border-white/10 group-hover:bg-uncp-gold group-hover:text-brand-950 transition-colors">
                    <GraduationCap size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Admisión Doctorados</h3>
                  <p className="text-brand-200 mb-8 leading-relaxed">
                    Proceso de selección para el grado académico más alto. Evalúa tu perfil investigador.
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-uncp-gold uppercase tracking-wider group-hover:gap-4 transition-all">
                    Ver Detalles <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Recursos Comunes */}
          <div className="border-t border-gray-100 pt-16">
            <h3 className="text-xl font-bold text-brand-950 mb-8 text-center">Recursos y Ayuda</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: Download, label: "Prospecto de Admisión", href: "#", desc: "Descargar PDF" },
                { icon: CreditCard, label: "Tasas Educativas", href: "#", desc: "Ver tarifario" },
                { icon: HelpCircle, label: "Preguntas Frecuentes", href: "#", desc: "Centro de ayuda" },
              ].map((item, idx) => (
                <Link key={idx} href={item.href} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-brand-950">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
