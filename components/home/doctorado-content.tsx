"use client";

import { useState } from "react";
import PageHero from "@/components/ui/page-hero";
import AdmissionUnifiedSection from "@/components/posgrado/admission-unified-section";
import { ADMISSION_CONFIG } from "@/data/admission-config";
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Calendar,
  ChevronDown,
  Download,
  Lightbulb,
  MessageCircle,
  Microscope,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

/* TIPOS */
type CursoRegular = { tipo: "curso"; nombre: string; creditos: number };
type CursoElectivo = { tipo: "electivo"; creditos: number; opciones: string[] };
type CursoItem = CursoRegular | CursoElectivo;
type Ciclo = { titulo: string; total: string; items: CursoItem[] };

/* HELPER */
const c = (nombre: string, creditos: number): CursoRegular => ({ tipo: "curso", nombre, creditos });
const e = (creditos: number, opciones: string[]): CursoElectivo => ({ tipo: "electivo", creditos, opciones });

const ciclosDoctorado: Ciclo[] = [
  {
    titulo: "Ciclo I",
    total: "12 créditos",
    items: [
      c("Filosofía e historia de la Educación", 4),
      c("Epistemología", 4),
      c("Seminario de Taller de tesis I", 4),
    ],
  },
  {
    titulo: "Ciclo II",
    total: "12 créditos",
    items: [
      c("Sociología y ética de la Educación", 4),
      c("Seminario de Taller de Tesis II", 4),
      c("Seminario de Investigación Cualitativa I", 4),
    ],
  },
  {
    titulo: "Ciclo III",
    total: "12 créditos",
    items: [
      c("Evaluación de la calidad de los sistemas educacionales", 4),
      c("Seminario de taller de tesis III", 4),
      c("Seminario de Investigación cualitativa II", 4),
    ],
  },
  {
    titulo: "Ciclo IV",
    total: "12 créditos",
    items: [
      c("Seminario taller de evaluación y formulación de currículo", 4),
      c("Análisis de datos cuantitativos y cualitativos", 4),
      c("Sistemas educativos y pensamiento pedagógico", 4),
    ],
  },
  {
    titulo: "Ciclo V",
    total: "12 créditos",
    items: [
      c("Neurociencia y cognición", 4),
      c("Política y gestión educativa", 4),
      c("Asesoría de Tesis I", 4),
    ],
  },
  {
    titulo: "Ciclo VI",
    total: "12 créditos",
    items: [
      c("Educación para el desarrollo sostenible", 4),
      c("Asesoramiento de tesis II", 4),
      e(4, [
        "Investigación de las TIC en Educación",
        "Investigación del liderazgo en la gestión del cambio",
        "Investigación de la gestión del conocimiento",
      ]),
    ],
  },
];

const propuestaValor = [
  {
    titulo: "Formación investigadora",
    descripcion: "Desarrolla capacidades de investigación científica de alto impacto en el campo educativo.",
    icono: Microscope,
  },
  {
    titulo: "Producción científica",
    descripcion: "Genera conocimiento original y publica en revistas académicas indexadas.",
    icono: Brain,
  },
  {
    titulo: "Docentes de alto nivel",
    descripcion: "Aprende con una plana académica especializada en investigación y ciencias de la educación.",
    icono: Award,
  },
  {
    titulo: "Liderazgo académico",
    descripcion: "Dirige proyectos educativos y equipos de investigación a nivel nacional e internacional.",
    icono: Lightbulb,
  },
];

export default function DoctoradoContent() {
  const [expandedCiclo, setExpandedCiclo] = useState<string | null>(null);
  const toggleCiclo = (titulo: string) =>
    setExpandedCiclo((prev) => (prev === titulo ? null : titulo));

  return (
    <main className="flex-1 w-full bg-background text-foreground">

      <PageHero
        title="DOCTORADO EN CIENCIAS DE LA EDUCACIÓN"
        subtitle="POSGRADO UNCP · EDUCACIÓN"
        description="Formación doctoral orientada a la investigación científica, producción académica y liderazgo en el campo de las ciencias de la educación."
        imageSrc="/images/fondouncp1920x1080.webp"
        align="left"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Doctorados" }
        ]}
        actions={[
          { 
            label: "Inscribirme ahora", 
            href: "https://uncpadmision.edu.pe/posgrado/registration/login.php",
            variant: "primary",
            icon: <ArrowRight className="h-4 w-4" />
          },
          { 
            label: "Guía de Inscripción", 
            href: "#admision",
            variant: "secondary",
            icon: <Download className="h-4 w-4" />
          }
        ]}
      />

      {/* ── STRIP PROPUESTA DE VALOR ──────────────────────── */}
      <section className="bg-brand-800 py-14">
        <div className="container mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {propuestaValor.map((item) => {
              const Icono = item.icono;
              return (
                <div
                  key={item.titulo}
                  className="flex items-start gap-4 rounded-[1.5rem] border border-white/10 bg-white/8 p-6 backdrop-blur-sm hover:bg-white/12 transition-all"
                >
                  <div className="shrink-0 rounded-xl bg-uncp-gold/15 p-2.5 text-uncp-gold">
                    <Icono className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">{item.titulo}</p>
                    <p className="mt-1 text-xs leading-relaxed text-brand-50/70">{item.descripcion}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PLAN DE ESTUDIOS ──────────────────────────────── */}
      <section className="bg-white py-20 md:py-24" id="plan-estudios">
        <div className="container mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-14 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-600">
              6 Ciclos Académicos
            </p>
            <h2 className="mt-3 font-serif text-4xl font-black leading-tight text-brand-950 md:text-5xl">
              Plan de estudios
              <br />
              <span className="text-brand-600">del doctorado</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Seis semestres de formación doctoral con enfoque en investigación, análisis y producción científica. Despliega cada ciclo para ver las asignaturas.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {ciclosDoctorado.map((ciclo, index) => {
              const isOpen = expandedCiclo === ciclo.titulo;
              const cicloNum = index + 1;

              return (
                <article
                  key={ciclo.titulo}
                  className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm transition-all duration-300 hover:border-brand-200 hover:shadow-xl"
                >
                  {/* CABECERA OSCURA */}
                  <div className="relative bg-brand-950 p-7">
                    <span className="absolute right-6 top-5 select-none text-5xl font-black text-white/6">
                      {String(cicloNum).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-white/20 bg-white/12 p-3">
                        <BookOpen className="h-6 w-6 text-uncp-gold" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-50/50">
                        Semestre {cicloNum}
                      </span>
                    </div>
                    <h3 className="mt-4 font-serif text-2xl font-black text-white md:text-3xl">
                      {ciclo.titulo}
                    </h3>
                    <p className="mt-1.5 text-sm font-bold text-uncp-gold">{ciclo.total}</p>
                  </div>

                  {/* CUERPO */}
                  <div className="p-7">
                    <div className="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3">
                      <Target className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-600">
                          Asignaturas
                        </p>
                        <p className="mt-0.5 text-sm text-brand-950">
                          {ciclo.items.filter((i) => i.tipo === "curso").length} asignaturas
                          {ciclo.items.some((i) => i.tipo === "electivo") ? " + 1 electivo" : ""}
                          {" · "}12 créditos totales
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCiclo(ciclo.titulo)}
                      className="mt-6 flex w-full items-center justify-between rounded-2xl border border-brand-200 bg-brand-50/40 px-5 py-3.5 text-sm font-black text-brand-950 transition hover:border-brand-400 hover:bg-brand-50"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-brand-600" />
                        {isOpen ? "Ocultar asignaturas" : "Ver asignaturas del ciclo"}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-brand-600 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="mt-5 space-y-4 border-t border-brand-100 pt-5">
                        <div className="rounded-2xl border border-border bg-background">
                          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
                            <p className="text-xs font-black uppercase tracking-widest text-brand-950">
                              {ciclo.titulo}
                            </p>
                            <span className="rounded-lg bg-brand-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                              {ciclo.total}
                            </span>
                          </div>

                          <div className="divide-y divide-border">
                            {ciclo.items.map((item, idx) =>
                              item.tipo === "curso" ? (
                                <div key={idx} className="flex items-center justify-between gap-4 px-5 py-3">
                                  <p className="text-sm text-brand-950">{item.nombre}</p>
                                  <span className="shrink-0 rounded-lg border border-brand-100 bg-brand-50 px-2.5 py-1 text-[11px] font-black text-brand-600">
                                    {item.creditos} cr.
                                  </span>
                                </div>
                              ) : (
                                <div key={idx} className="px-5 py-4">
                                  <div className="mb-3 flex items-center gap-2">
                                    <span className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700">
                                      Elige 1 electivo · {item.creditos} cr.
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    {item.opciones.map((op, i) => (
                                      <div
                                        key={i}
                                        className="flex items-center gap-3 rounded-xl border border-dashed border-brand-200 bg-brand-50/40 px-4 py-2.5"
                                      >
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-300 text-[10px] font-black text-brand-600">
                                          {String.fromCharCode(65 + i)}
                                        </span>
                                        <p className="text-sm text-brand-950">{op}</p>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="mt-2 text-[11px] text-muted-foreground">
                                    * El doctorando elige una de las tres asignaturas electivas.
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/50 py-3">
                          <p className="text-[11px] font-black uppercase tracking-widest text-brand-600">
                            Total {ciclo.titulo}
                          </p>
                          <span className="rounded-lg bg-brand-600 px-3 py-1 text-[11px] font-black text-white">12 créditos</span>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* resumen total */}
          <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/50 py-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-brand-600">
              Total plan de estudios
            </p>
            <span className="rounded-lg bg-brand-600 px-3 py-1 text-[11px] font-black text-white">72 créditos</span>
            <span className="text-[11px] text-muted-foreground">· 6 semestres · 3 años</span>
          </div>
        </div>
      </section>

      {/* ── LOGROS ────────────────────────────────────────── */}
      <section className="bg-brand-950 py-20">
        <div className="container mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-uncp-gold">
                Tu transformación académica
              </p>
              <h2 className="mt-4 font-serif text-4xl font-black leading-tight text-white md:text-5xl">
                Lo que vas a construir con este doctorado
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-50/75">
                No es solo un título. Es el más alto grado académico, respaldado por investigación científica y liderazgo en educación.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/51949260658?text=Hola,%20quisiera%20informaci%C3%B3n%20sobre%20el%20Doctorado%20en%20Educaci%C3%B3n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-uncp-gold px-6 py-3 text-sm font-black uppercase tracking-wider text-brand-950 transition hover:brightness-110"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp: 949 260 658
                </a>
                <a
                  href="https://uncpadmision.edu.pe/posgrado/registration/login.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white/20"
                >
                  Inscribirme <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icono: TrendingUp,
                  titulo: "Perfil investigador avanzado",
                  desc: "Mayor competitividad para la academia, la investigación y la dirección de proyectos educativos.",
                },
                {
                  icono: Brain,
                  titulo: "Capacidad científica",
                  desc: "Diseño y ejecución de investigaciones doctorales con rigor metodológico reconocido.",
                },
                {
                  icono: Users,
                  titulo: "Liderazgo en educación",
                  desc: "Gestión de equipos académicos y toma de decisiones basada en evidencia científica.",
                },
                {
                  icono: Award,
                  titulo: "Grado de Doctor",
                  desc: "Titulación oficial por la UNCP con pleno reconocimiento académico nacional.",
                },
              ].map((l) => {
                const Icono = l.icono;
                return (
                  <div
                    key={l.titulo}
                    className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm"
                  >
                    <div className="mb-3 inline-flex rounded-xl bg-uncp-gold/15 p-2.5 text-uncp-gold">
                      <Icono className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-black text-white">{l.titulo}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-brand-50/65">{l.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* GUÍA DE ADMISIÓN UNIFICADA */}
      <AdmissionUnifiedSection data={ADMISSION_CONFIG.doctorado} />

      {/* CTA FINAL */}
      <section className="bg-brand-950 py-20">
        <div className="container mx-auto max-w-5xl px-6 text-center lg:px-12">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-uncp-gold/40 bg-uncp-gold/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-uncp-gold">
            <Calendar className="h-3.5 w-3.5" /> Proceso de Admisión Abierto
          </span>
          <h2 className="font-serif text-4xl font-black text-white md:text-5xl xl:text-6xl">
            Tu próximo grado
            <span className="block text-uncp-gold">empieza con una decisión</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-brand-50/75 md:text-lg">
            Únete al Doctorado en Ciencias de la Educación de la UNCP. Formación orientada a la investigación científica, con acompañamiento académico en cada etapa.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://uncpadmision.edu.pe/posgrado/registration/login.php"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-uncp-gold px-8 py-4 text-sm font-black uppercase tracking-wider text-brand-950 shadow-lg transition hover:brightness-110 active:scale-95"
            >
              Inscribirme ahora <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/51949260658"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" /> 949 260 658
            </a>
            <a
              href="mailto:UPGEDUCACION@UNCP.EDU.PE"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/6 px-8 py-4 text-sm font-black uppercase tracking-wider text-brand-50/80 transition hover:bg-white/12"
            >
              UPGEDUCACION@UNCP.EDU.PE
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
