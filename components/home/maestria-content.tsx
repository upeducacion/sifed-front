"use client";

import { useState } from "react";
import PageHero from "@/components/ui/page-hero";
import AdmissionUnifiedSection from "@/components/posgrado/admission-unified-section";
import { ADMISSION_CONFIG } from "@/data/admission-config";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Brain,
  Building2,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Download,
  Lightbulb,
  MessageCircle,
  Presentation,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

/* TIPOS */
type CursoRegular = { tipo: "curso"; nombre: string; creditos: number };
type CursoElectivo = { tipo: "electivo"; creditos: number; opciones: string[] };
type CursoItem = CursoRegular | CursoElectivo;
type Ciclo = { titulo: string; total: string; items: CursoItem[] };

/* HELPER */
const c = (nombre: string, creditos: number): CursoRegular => ({ tipo: "curso", nombre, creditos });
const e = (creditos: number, opciones: string[]): CursoElectivo => ({ tipo: "electivo", creditos, opciones });

const menciones = [
  {
    slug: "gestion-educativa",
    numero: "01",
    nombre: "Gestión Educativa",
    slogan: "Lidera instituciones y transforma resultados",
    resumen:
      "Dirigida a profesionales que desean liderar instituciones, optimizar procesos académicos y diseñar proyectos de mejora educativa.",
    icono: Building2,
    idealPara: "Directivos, coordinadores y profesionales con enfoque en gestión institucional.",
    perfil: [
      "Gestiona instituciones y equipos con enfoque en calidad educativa.",
      "Formula proyectos educativos innovadores y de inversión.",
      "Aplica análisis de datos para la toma de decisiones en gestión.",
    ],
    ciclos: [
      {
        titulo: "Ciclo I", total: "19 créditos",
        items: [
          c("Teorías científicas de la educación", 5),
          c("Seminario taller de tesis", 4),
          c("Liderazgo, inteligencia emocional y cultura organizacional", 5),
          c("Planificación y organización educativa", 5),
        ],
      },
      {
        titulo: "Ciclo II", total: "19 créditos",
        items: [
          c("Asesoramiento de tesis I", 4),
          c("Proyectos educativos, innovadores y de inversión", 5),
          c("Análisis de datos cuantitativos y cualitativos", 5),
          c("Gestión de recursos humanos", 5),
        ],
      },
      {
        titulo: "Ciclo III", total: "11 créditos",
        items: [
          c("Asesoramiento de tesis II", 7),
          e(4, [
            "Evaluación, supervisión y asesoramiento educacional",
            "Sistemas de evaluación de la calidad institucional",
            "Enfoques y técnicas cualitativas en investigación",
          ]),
        ],
      },
    ] as Ciclo[],
  },
  {
    slug: "educacion-superior",
    numero: "02",
    nombre: "Educación Superior",
    slogan: "Potencia tu impacto en aulas universitarias",
    resumen:
      "Enfocada en docencia universitaria de alto nivel, innovación didáctica y fortalecimiento de competencias para la formación profesional.",
    icono: Presentation,
    idealPara: "Docentes universitarios y profesionales que desean especializarse en enseñanza superior.",
    perfil: [
      "Diseña experiencias de aprendizaje para educación superior.",
      "Integra didáctica universitaria y evaluación por competencias.",
      "Sustenta propuestas pedagógicas con evidencia e investigación.",
    ],
    ciclos: [
      {
        titulo: "Ciclo I", total: "19 créditos",
        items: [
          c("Teorías científicas de la educación", 5),
          c("Seminario taller de tesis", 4),
          c("Filosofía de la educación superior", 5),
          c("Andragogía", 5),
        ],
      },
      {
        titulo: "Ciclo II", total: "19 créditos",
        items: [
          c("Asesoramiento de tesis I", 4),
          c("Didáctica en la educación superior", 5),
          c("Análisis de datos cuantitativos y cualitativos", 5),
          c("Técnicas y estrategias para el desarrollo de la inteligencia emocional", 5),
        ],
      },
      {
        titulo: "Ciclo III", total: "11 créditos",
        items: [
          c("Asesoramiento de tesis II", 7),
          e(4, [
            "Currículo y evaluación educativa",
            "Sistemas de evaluación de la calidad institucional",
            "Enfoques y técnicas cualitativas en investigación",
          ]),
        ],
      },
    ] as Ciclo[],
  },
  {
    slug: "psicologia-educativa",
    numero: "03",
    nombre: "Psicología Educativa",
    slogan: "Comprende el aprendizaje desde la ciencia",
    resumen:
      "Ideal para especialistas interesados en cognición, aprendizaje y estrategias de intervención para mejorar el rendimiento académico.",
    icono: BrainCircuit,
    idealPara: "Profesionales de educación y psicología orientados a intervención pedagógica.",
    perfil: [
      "Analiza procesos cognitivos y socioemocionales del aprendizaje.",
      "Diseña estrategias para atender problemas de aprendizaje.",
      "Propone intervenciones basadas en neuropsicología educativa.",
    ],
    ciclos: [
      {
        titulo: "Ciclo I", total: "19 créditos",
        items: [
          c("Teorías científicas de la educación", 5),
          c("Seminario taller de tesis", 4),
          c("Psicología cognitiva", 5),
          c("Teorías y estrategias de aprendizaje", 5),
        ],
      },
      {
        titulo: "Ciclo II", total: "19 créditos",
        items: [
          c("Asesoramiento de tesis I", 4),
          c("Fundamentos neuropsicológicos de la cognición", 5),
          c("Problemas de aprendizaje", 5),
          c("Análisis de datos cuantitativos y cualitativos", 5),
        ],
      },
      {
        titulo: "Ciclo III", total: "11 créditos",
        items: [
          c("Asesoramiento de tesis II", 7),
          e(4, [
            "Currículo y evaluación educativa",
            "Técnicas y estrategias para el desarrollo de las inteligencias múltiples",
            "Enfoques y técnicas cualitativas en investigación",
          ]),
        ],
      },
    ] as Ciclo[],
  },
  {
    slug: "ensenanza-estrategica",
    numero: "04",
    nombre: "Enseñanza Estratégica",
    slogan: "Diseña experiencias que realmente enseñan",
    resumen:
      "Potencia tu práctica docente con herramientas de pensamiento crítico, neurociencia aplicada y metodologías activas para el aula.",
    icono: Users,
    idealPara: "Docentes que buscan innovar en metodologías y elevar el desempeño de sus estudiantes.",
    perfil: [
      "Diseña procesos de enseñanza centrados en competencias.",
      "Aplica recursos didácticos innovadores en distintos contextos.",
      "Fortalece el pensamiento creativo, crítico y reflexivo.",
    ],
    ciclos: [
      {
        titulo: "Ciclo I", total: "19 créditos",
        items: [
          c("Teorías científicas de la educación", 5),
          c("Seminario taller de tesis", 4),
          c("Herramientas del pensamiento creativo, crítico y reflexivo", 5),
          c("Fundamentos neuropsicológicos de la cognición", 5),
        ],
      },
      {
        titulo: "Ciclo II", total: "19 créditos",
        items: [
          c("Asesoramiento de tesis I", 4),
          c("Técnicas y estrategias para el desarrollo de la inteligencia emocional", 5),
          c("Recursos didácticos para el aprendizaje", 5),
          c("Teorías y estrategias de aprendizaje", 5),
        ],
      },
      {
        titulo: "Ciclo III", total: "11 créditos",
        items: [
          c("Asesoramiento de tesis II", 7),
          e(4, [
            "Currículo y evaluación educativa",
            "Técnicas y estrategias para el desarrollo de la inteligencia lógico-matemática",
            "Enfoques y técnicas cualitativas en investigación",
          ]),
        ],
      },
    ] as Ciclo[],
  },
];

const propuestaValor = [
  {
    titulo: "Formación para liderar",
    descripcion: "Desarrolla capacidades de gestión, investigación y toma de decisiones en escenarios educativos reales.",
    icono: Target,
  },
  {
    titulo: "Investigación aplicada",
    descripcion: "Conecta tu formación con proyectos de tesis y soluciones concretas para instituciones educativas.",
    icono: Brain,
  },
  {
    titulo: "Docentes de alto nivel",
    descripcion: "Aprende con una plana académica especializada en educación, innovación y desarrollo profesional.",
    icono: Award,
  },
  {
    titulo: "Enfoque estratégico",
    descripcion: "Integra pensamiento crítico, creatividad y análisis de datos para potenciar tu perfil.",
    icono: Lightbulb,
  },
];

export default function MaestriaContent() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (slug: string) =>
    setExpanded((prev) => (prev === slug ? null : slug));

  return (
    <main className="flex-1 w-full bg-background text-foreground">

      <PageHero
        title="MAESTRÍA EN CIENCIAS DE LA EDUCACIÓN"
        subtitle="POSGRADO UNCP · EDUCACIÓN"
        description="Formación de posgrado orientada a liderazgo, investigación e innovación educativa. Cuatro menciones diseñadas para transformar tu carrera."
        imageSrc="/images/fondouncp1920x1080.webp"
        align="left"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Maestrías" }
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

      {/* STRIP PROPUESTA DE VALOR */}
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

      {/* MENCIONES */}
      <section className="bg-white py-20 md:py-24" id="menciones">
        <div className="container mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-14 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-600">
              4 Especializaciones
            </p>
            <h2 className="mt-3 font-serif text-4xl font-black leading-tight text-brand-950 md:text-5xl">
              Elige la mención que
              <br />
              <span className="text-brand-600">impulsa tu carrera</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Cada mención tiene malla propia, perfil de egreso y enfoque diferenciado. Despliega cualquier tarjeta para ver la malla curricular completa.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {menciones.map((m) => {
              const Icono = m.icono;
              const isOpen = expanded === m.slug;

              return (
                <article
                  key={m.slug}
                  className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm transition-all duration-300 hover:border-brand-200 hover:shadow-xl"
                >
                  {/* CABECERA OSCURA */}
                  <div className="relative bg-brand-950 p-7">
                    <span className="absolute right-6 top-5 select-none text-5xl font-black text-white/6">
                      {m.numero}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-white/20 bg-white/12 p-3">
                        <Icono className="h-6 w-6 text-uncp-gold" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-50/50">
                        Mención {m.numero}
                      </span>
                    </div>
                    <h3 className="mt-4 font-serif text-2xl font-black text-white md:text-3xl">
                      {m.nombre}
                    </h3>
                    <p className="mt-1.5 text-sm font-bold text-uncp-gold">{m.slogan}</p>
                  </div>

                  {/* CUERPO */}
                  <div className="p-7">
                    <p className="text-sm leading-relaxed text-muted-foreground">{m.resumen}</p>

                    <div className="mt-5 flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3">
                      <Zap className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-600">
                          Ideal para
                        </p>
                        <p className="mt-0.5 text-sm text-brand-950">{m.idealPara}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-600">
                        <BadgeCheck className="h-3.5 w-3.5" /> Perfil de egreso
                      </p>
                      <ul className="space-y-2.5">
                        {m.perfil.map((p) => (
                          <li key={p} className="flex items-start gap-2.5 text-sm text-brand-950">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-uncp-green" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => toggle(m.slug)}
                      className="mt-6 flex w-full items-center justify-between rounded-2xl border border-brand-200 bg-brand-50/40 px-5 py-3.5 text-sm font-black text-brand-950 transition hover:border-brand-400 hover:bg-brand-50"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-brand-600" />
                        {isOpen ? "Ocultar malla curricular" : "Ver malla curricular completa"}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-brand-600 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="mt-5 space-y-4 border-t border-brand-100 pt-5">
                        {m.ciclos.map((ciclo) => (
                          <div key={ciclo.titulo} className="rounded-2xl border border-border bg-background">
                            {/* cabecera del ciclo */}
                            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
                              <p className="text-xs font-black uppercase tracking-widest text-brand-950">
                                {ciclo.titulo}
                              </p>
                              <span className="rounded-lg bg-brand-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                                {ciclo.total}
                              </span>
                            </div>

                            {/* items */}
                            <div className="divide-y divide-border">
                              {ciclo.items.map((item, idx) =>
                                item.tipo === "curso" ? (
                                  /* ── curso regular ── */
                                  <div key={idx} className="flex items-center justify-between gap-4 px-5 py-3">
                                    <p className="text-sm text-brand-950">{item.nombre}</p>
                                    <span className="shrink-0 rounded-lg border border-brand-100 bg-brand-50 px-2.5 py-1 text-[11px] font-black text-brand-600">
                                      {item.creditos} cr.
                                    </span>
                                  </div>
                                ) : (
                                  /* ── electivo ── */
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
                                      * El maestrando elige una de las tres asignaturas electivas.
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center justify-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/50 py-3">
                          <p className="text-[11px] font-black uppercase tracking-widest text-brand-600">
                            Total plan de estudios
                          </p>
                          <span className="rounded-lg bg-brand-600 px-3 py-1 text-[11px] font-black text-white">49 créditos</span>
                          <span className="text-[11px] text-muted-foreground">· 3 semestres</span>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* LOGROS */}
      <section className="bg-brand-950 py-20">
        <div className="container mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-uncp-gold">
                Tu transformación profesional
              </p>
              <h2 className="mt-4 font-serif text-4xl font-black leading-tight text-white md:text-5xl">
                Lo que vas a construir con esta maestría
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-50/75">
                No es solo un grado. Es el siguiente nivel en tu trayectoria como educador, gestor o investigador.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/51949260658?text=Hola,%20quisiera%20informaci%C3%B3n%20sobre%20las%20Maestr%C3%ADas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-uncp-gold px-6 py-3 text-sm font-black uppercase tracking-wider text-brand-950 transition hover:brightness-110"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp: Soporte Posgrado
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
                  titulo: "Perfil profesional diferenciado",
                  desc: "Mayor competitividad para ascenso, dirección de instituciones y nuevos retos docentes.",
                },
                {
                  icono: Brain,
                  titulo: "Capacidad investigadora",
                  desc: "Diseño y ejecución de proyectos de tesis con rigor metodológico reconocido.",
                },
                {
                  icono: Building2,
                  titulo: "Liderazgo institucional",
                  desc: "Gestión de equipos, proyectos de mejora y toma de decisiones basada en evidencia.",
                },
                {
                  icono: Award,
                  titulo: "Grado de Magíster",
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
      <AdmissionUnifiedSection data={ADMISSION_CONFIG.maestria} />

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
            Únete a la Maestría en Ciencias de la Educación de la UNCP. Formación orientada a resultados, con acompañamiento académico en cada etapa.
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
              <MessageCircle className="h-4 w-4" /> Soporte Posgrado
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
