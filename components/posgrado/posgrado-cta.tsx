"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, GraduationCap, Award, Search, BookOpen, Zap } from "lucide-react";

export default function PosgradoCTA() {
  return (
    <section className="min-h-screen flex items-center py-12 lg:py-16 bg-white relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-brand-950 rounded-full" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-10 lg:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-950 mb-4 leading-[0.9] tracking-tighter">
              COMIENZA TU <br />
              <span className="text-brand-600">FUTURO</span> HOY
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed">
              Selecciona el nivel de especialización que transformará tu trayectoria profesional y científica.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* TARJETA MAESTRÍAS */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group"
          >
            <Link href="/posgrado/maestrias" className="block h-full">
              <div className="relative h-full bg-brand-50 rounded-[2rem] p-8 lg:p-10 border border-brand-100 shadow-xl shadow-brand-950/5 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-600/10 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity text-brand-950 group-hover:scale-110 transition-transform duration-700">
                  <BookOpen size={180} strokeWidth={1} />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  
                  <h3 className="text-3xl font-black text-brand-950 mb-3 tracking-tight">Maestrías</h3>
                  <p className="text-brand-950/60 text-sm lg:text-base leading-relaxed mb-8 font-medium">
                    Programas diseñados para la especialización avanzada, liderando procesos de cambio pedagógico y administrativo.
                  </p>
                  
                  <div className="mt-auto flex items-center gap-3 text-brand-600 font-black uppercase tracking-widest text-[10px] group-hover:gap-5 transition-all">
                    Explorar Programas <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* TARJETA DOCTORADOS */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group"
          >
            <Link href="/posgrado/doctorados" className="block h-full">
              <div className="relative h-full bg-brand-950 rounded-[2rem] p-8 lg:p-10 border border-white/5 shadow-2xl transition-all duration-500 hover:shadow-uncp-gold/10 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity text-white group-hover:scale-110 transition-transform duration-700">
                  <GraduationCap size={180} strokeWidth={1} />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-uncp-gold group-hover:text-brand-950 transition-all duration-500">
                    <GraduationCap className="h-6 w-6 text-uncp-gold group-hover:text-brand-950" />
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Doctorados</h3>
                  <p className="text-white/40 text-sm lg:text-base leading-relaxed mb-8 font-medium">
                    El máximo nivel académico orientado a la generación de conocimiento original con estándares internacionales.
                  </p>
                  
                  <div className="mt-auto flex items-center gap-3 text-uncp-gold font-black uppercase tracking-widest text-[10px] group-hover:gap-5 transition-all">
                    Ver Grados Académicos <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* TARJETA DIPLOMADOS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group"
          >
            <Link href="/posgrado/diplomados" className="block h-full">
              <div className="relative h-full bg-white rounded-[2rem] p-8 lg:p-10 border border-border shadow-xl shadow-brand-950/5 transition-all duration-500 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-600/5 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity text-brand-950 group-hover:scale-110 transition-transform duration-700">
                  <Award size={180} strokeWidth={1} />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">
                    <Award className="h-6 w-6 text-brand-600 group-hover:text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-black text-brand-950 mb-3 tracking-tight">Diplomados</h3>
                  <p className="text-muted-foreground text-sm lg:text-base leading-relaxed mb-8 font-medium">
                    Programas de corta duración enfocados en la actualización profesional y desarrollo de habilidades prácticas.
                  </p>
                  
                  <div className="mt-auto flex items-center gap-3 text-brand-600 font-black uppercase tracking-widest text-[10px] group-hover:gap-5 transition-all">
                    Explorar Diplomados <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* TARJETA FORMACIÓN CONTINUA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group"
          >
            <Link href="/posgrado/formacion-continua" className="block h-full">
              <div className="relative h-full bg-white rounded-[2rem] p-8 lg:p-10 border border-border shadow-xl shadow-brand-950/5 transition-all duration-500 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-600/5 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity text-brand-950 group-hover:scale-110 transition-transform duration-700">
                  <Zap size={180} strokeWidth={1} />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">
                    <Zap className="h-6 w-6 text-brand-600 group-hover:text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-black text-brand-950 mb-3 tracking-tight">Formación Continua</h3>
                  <p className="text-muted-foreground text-sm lg:text-base leading-relaxed mb-8 font-medium">
                    Cursos y talleres dinámicos orientados a potenciar competencias específicas y metodologías modernas.
                  </p>
                  
                  <div className="mt-auto flex items-center gap-3 text-brand-600 font-black uppercase tracking-widest text-[10px] group-hover:gap-5 transition-all">
                    Ver Cursos y Talleres <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex justify-center items-center gap-6 text-brand-950/20"
        >
          <div className="h-px w-16 bg-current" />
          <Search size={16} />
          <div className="h-px w-16 bg-current" />
        </motion.div>
      </div>
    </section>
  );
}
