"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ProgramData, HorarioModulo, HorarioClase } from "@/types/programa";
import ProgramHero from "./program-hero";
import CurriculumTable from "./curriculum-table";
import AdmissionUnifiedSection from "./admission-unified-section";
import { ADMISSION_CONFIG, AdmissionData } from "@/data/admission-config";
import {
  Target,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Clock,
  Calendar,
  CreditCard,
  FileCheck
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProgramDetailLayoutProps {
  program: ProgramData;
  globalAdmissionData?: AdmissionData;
}

type TabId = "info" | "perfiles" | "curriculum" | "horarios" | "inversion";

export default function ProgramDetailLayout({ program, globalAdmissionData }: ProgramDetailLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabId>("info");

  const fallbackAdmissionData = program.tipo === "maestria" ? ADMISSION_CONFIG.maestria : ADMISSION_CONFIG.doctorado;
  const admissionData = globalAdmissionData || {
    ...fallbackAdmissionData,
    // Aquí se podrían sobrescribir datos de admissionData con program.admision si fuera necesario
  };

  // Generar tabs dinámicamente basados en configVisibilidad
  const config = program.configVisibilidad || {};
  
  const allTabs: { id: TabId; label: string; icon: React.ReactNode; show: boolean }[] = [
    { id: "info", label: "Acerca del Programa", icon: <BookOpen className="w-4 h-4" />, show: true }, // Siempre visible
    { id: "perfiles", label: "Perfiles y Objetivos", icon: <Users className="w-4 h-4" />, show: config.mostrar_perfiles !== false },
    { id: "curriculum", label: "Plan de Estudios", icon: <Target className="w-4 h-4" />, show: config.mostrar_plan_estudio !== false },
    { id: "horarios", label: "Horarios", icon: <Clock className="w-4 h-4" />, show: config.mostrar_horarios !== false },
    { id: "inversion", label: "Inversión y Requisitos", icon: <Wallet className="w-4 h-4" />, show: config.mostrar_admision !== false },
  ];

  const tabs = allTabs.filter(t => t.show);

  return (
    <main className="flex-1 w-full bg-white">
      <ProgramHero program={program} />

      {/* Navigation Tabs (Pills flotantes) */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="container mx-auto px-4 lg:px-12 max-w-7xl">
          <div className="flex overflow-x-auto hide-scrollbar justify-start md:justify-center gap-2 py-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-3 rounded-full text-xs md:text-sm font-bold transition-colors whitespace-nowrap",
                    isActive ? "text-white" : "text-muted-foreground hover:text-brand-950 hover:bg-brand-50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-brand-950 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content Sections */}
      <div className="py-16 md:py-24 container mx-auto px-6 lg:px-12 max-w-7xl min-h-[50vh]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ACERCA DEL PROGRAMA */}
          {activeTab === "info" && (
            <motion.div 
              key="info"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-600 mb-4 block">Descripción Académica</span>
                <h2 className="text-4xl md:text-5xl font-serif font-black text-brand-950 mb-8 leading-tight">Acerca del Programa</h2>
              </div>
              
              <div className="prose prose-lg md:prose-xl text-muted-foreground mx-auto font-medium leading-relaxed mb-16 text-justify">
                {program.acercaDe?.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>

              {(program.configVisibilidad?.mostrar_certificacion !== false && program.certificacionDetalle) && (
                <div className="mt-10 p-8 md:p-10 rounded-[2rem] bg-brand-50 border border-brand-100 flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-uncp-gold/20 flex items-center justify-center">
                    <Award className="w-8 h-8 text-uncp-gold" />
                  </div>
                  <div>
                    <h4 className="font-serif text-2xl font-black text-brand-950 mb-4 text-center md:text-left">
                      Certificación
                    </h4>
                    <p className="text-base text-brand-800 leading-relaxed text-center md:text-left">
                      {program.certificacionDetalle}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: PERFILES Y OBJETIVOS */}
          {activeTab === "perfiles" && (
            <motion.div 
              key="perfiles"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-24"
            >
              {/* Objetivos */}
              {program.objetivos && program.objetivos.length > 0 && (
                <section>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-black text-brand-950 mb-4">Objetivos Estratégicos</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">Metas académicas y profesionales que alcanzarás al cursar este programa.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {program.objetivos.map((obj, i) => (
                      <div key={i} className="p-6 rounded-2xl border border-border bg-white shadow-sm hover:shadow-md transition-shadow flex items-start gap-4">
                        <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                          <Target className="w-4 h-4" />
                        </div>
                        <p className="text-sm font-semibold text-brand-900 leading-relaxed">{obj}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Split View Perfiles */}
              {(program.perfilEstudiante?.length > 0 || program.perfilEgresado?.length > 0) && (
                <section className="grid lg:grid-cols-2 gap-8 lg:gap-0 rounded-[3rem] overflow-hidden shadow-2xl border border-border">
                  {/* Ingreso */}
                  <div className="p-10 md:p-16 bg-brand-950 text-white relative group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 transition-transform group-hover:scale-110 duration-700">
                      <Users size={200} />
                    </div>
                    <div className="relative z-10">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-uncp-gold mb-8">
                        Perfil de Ingreso
                      </span>
                      <h3 className="text-3xl font-serif font-black mb-10">
                        ¿A quién va dirigido?
                      </h3>
                      <ul className="space-y-6">
                        {program.perfilEstudiante.map((item, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <ArrowRight className="w-5 h-5 text-uncp-gold shrink-0 mt-1" />
                            <p className="text-brand-100/90 font-medium leading-relaxed">{item}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Egreso */}
                  <div className="p-10 md:p-16 bg-white relative group">
                    <div className="absolute bottom-0 right-0 p-10 opacity-[0.03] transition-transform group-hover:scale-110 duration-700">
                      <Award size={200} />
                    </div>
                    <div className="relative z-10">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 mb-8">
                        Perfil de Egreso
                      </span>
                      <h3 className="text-3xl font-serif font-black text-brand-950 mb-10">
                        ¿Qué lograrás?
                      </h3>
                      <ul className="space-y-6">
                        {program.perfilEgresado.map((item, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-1" />
                            <p className="text-muted-foreground font-medium leading-relaxed">{item}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {/* TAB 3: PLAN DE ESTUDIOS */}
          {activeTab === "curriculum" && (
            <motion.div 
              key="curriculum"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif font-black text-brand-950 mb-4">Malla Curricular</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Estructura curricular diseñada bajo estándares de calidad internacional, enfocada en la investigación y el desarrollo profesional.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {program.planEstudios?.map((ciclo) => (
                  <CurriculumTable key={ciclo.numero} ciclo={ciclo} />
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: HORARIOS */}
          {activeTab === "horarios" && (
            <motion.div 
              key="horarios"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif font-black text-brand-950 mb-4">Horarios de Clases</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Conoce nuestra programación de clases flexible, pensada en profesionales.
                </p>
              </div>

              {(!program.horarios || program.horarios.length === 0) ? (
                <div className="text-center py-12 bg-neutral-50 rounded-3xl border border-dashed border-border">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Los horarios para este programa serán publicados próximamente.</p>
                </div>
              ) : (
                <div className="grid gap-8 max-w-4xl mx-auto">
                  {program.horarios.map((modulo: HorarioModulo, i: number) => (
                    <div key={i} className="bg-white border border-border shadow-sm rounded-[2rem] overflow-hidden">
                      <div className="p-8 bg-brand-50/50 border-b border-border">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="p-2.5 bg-brand-100 rounded-xl text-brand-600">
                            <Calendar className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-serif font-black text-brand-950">{modulo.titulo_modulo}</h3>
                        </div>
                        <p className="text-brand-800 font-medium leading-relaxed">{modulo.descripcion_general}</p>
                      </div>

                      {modulo.clases_especificas && modulo.clases_especificas.length > 0 && (
                        <div className="p-8">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b-2 border-border">
                                  <th className="pb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Asignatura</th>
                                  <th className="pb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Día y Hora</th>
                                  <th className="pb-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Docente</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {modulo.clases_especificas.map((clase: HorarioClase, idx: number) => (
                                  <tr key={idx} className="hover:bg-neutral-50 transition-colors">
                                    <td className="py-4 text-sm font-bold text-brand-900 pr-4">{clase.asignatura}</td>
                                    <td className="py-4 text-sm text-muted-foreground pr-4 whitespace-nowrap">{clase.dia_hora}</td>
                                    <td className="py-4 text-sm text-muted-foreground">{clase.docente}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: INVERSIÓN Y REQUISITOS */}
          {activeTab === "inversion" && (
            <motion.div 
              key="inversion"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto space-y-12"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-serif font-black text-brand-950 mb-4">Inversión y Requisitos</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Detalles sobre los costos del programa y los documentos necesarios para tu admisión.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Costos */}
                <div className="bg-white border border-border shadow-sm rounded-[2rem] p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-serif font-black text-brand-950">Estructura de Costos</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-6 border-b border-border">
                      <span className="text-muted-foreground font-medium">Inscripción</span>
                      <span className="text-xl font-black text-brand-950">{program.admision?.costo_inscripcion || "Consultar"}</span>
                    </div>
                    <div className="flex justify-between items-center pb-6 border-b border-border">
                      <span className="text-muted-foreground font-medium">Matrícula</span>
                      <span className="text-xl font-black text-brand-950">{program.admision?.matricula || "Consultar"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Pensión</span>
                      <span className="text-xl font-black text-brand-950">{program.admision?.pension || "Consultar"}</span>
                    </div>
                    {program.admision?.costo_adicional && (
                      <div className="flex justify-between items-center pt-6 border-t border-border">
                        <span className="text-muted-foreground font-medium">Otros (Certificados, etc)</span>
                        <span className="text-xl font-black text-brand-950">{program.admision.costo_adicional}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-8 p-4 bg-brand-50 rounded-xl text-sm text-brand-800 text-center font-medium">
                    * Los costos pueden estar sujetos a variaciones según el tarifario vigente de la UNCP.
                  </div>
                </div>

                {/* Requisitos */}
                <div className="bg-brand-950 text-white shadow-2xl rounded-[2rem] p-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                    <FileCheck size={160} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-uncp-gold">
                        <FileCheck className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-serif font-black text-white">Requisitos</h3>
                    </div>

                    {(!program.admision?.requisitos || program.admision.requisitos.length === 0) ? (
                      <p className="text-brand-200">Revise la guía de admisión en la parte inferior para conocer los requisitos detallados.</p>
                    ) : (
                      <ul className="space-y-4">
                        {program.admision.requisitos.map((req, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-uncp-gold shrink-0 mt-0.5" />
                            <span className="text-brand-100 font-medium leading-relaxed">{req}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón ancla hacia la guía de admisión */}
              <div className="text-center pt-8">
                <a 
                  href="#admision" 
                  className="inline-flex items-center justify-center gap-2 bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-900 px-6 py-3 rounded-full font-bold transition-colors"
                >
                  Ver Cronograma y Guía Completa de Admisión
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Admission Section (Always visible at the bottom) */}
      {/* Esto se mantiene para que los enlaces ancla (#admision) desde el Hero sigan funcionando y el usuario pueda descargar la guía oficial */}
      <AdmissionUnifiedSection data={admissionData} />
    </main>
  );
}
