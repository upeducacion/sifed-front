"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, Users, Globe } from "lucide-react";

const axes = [
  {
    title: "Investigación Renacyt",
    description: "Contamos con una plana docente calificada y certificada para liderar proyectos de alto impacto científico.",
    icon: Award,
    index: "01"
  },
  {
    title: "Calidad Certificada",
    description: "Procesos académicos y administrativos bajo estándares internacionales ISO 9001 para asegurar tu formación.",
    icon: BookOpen,
    index: "02"
  },
  {
    title: "Comunidad Académica",
    description: "Red de contactos con expertos y egresados líderes en el sector educativo a nivel regional y nacional.",
    icon: Users,
    index: "03"
  },
  {
    title: "Visión Global",
    description: "Convenios internacionales que permiten la movilidad y el intercambio de conocimientos con universidades del mundo.",
    icon: Globe,
    index: "04"
  }
];

export default function StrategicAxes() {
  return (
    <section className="min-h-screen flex items-center py-20 bg-brand-950 text-white overflow-hidden relative">
      {/* Background patterns and glows */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-brand-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-800/20 rounded-full blur-[120px]" />
        {/* Subtle geometric pattern placeholder */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* INTRO DE SECCIÓN */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-uncp-gold text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              Nuestra Excelencia
            </div>
            <h2 className="text-5xl md:text-6xl xl:text-7xl font-black text-white mb-8 leading-[0.95] tracking-tighter">
              PILARES QUE <br />
              DEFINEN NUESTRO <br />
              <span className="text-brand-300">LIDERAZGO</span>
            </h2>
            <p className="text-brand-50/40 max-w-md text-lg leading-relaxed font-medium mb-12">
              Garantizamos una formación de posgrado que trasciende el aula, enfocada en la producción de conocimiento y la transformación social con estándares globales.
            </p>
            
            <div className="flex items-center gap-6">
               <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-brand-950 bg-brand-800 flex items-center justify-center text-[10px] font-bold">
                       UNCP
                    </div>
                  ))}
               </div>
               <span className="text-xs font-bold text-brand-100 uppercase tracking-widest">Acreditación Institucional</span>
            </div>
          </motion.div>

          {/* GRID DE EJES (2x2) */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {axes.map((axis, index) => (
              <motion.div
                key={axis.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 lg:p-10 rounded-[2.5rem] hover:bg-white/10 hover:border-brand-400/30 transition-all duration-500 overflow-hidden"
              >
                {/* Accent number behind */}
                <span className="absolute -top-4 -right-2 text-8xl font-black text-white/[0.03] group-hover:text-uncp-gold/[0.05] transition-colors leading-none">
                   {axis.index}
                </span>

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-400/20 flex items-center justify-center mb-8 group-hover:bg-uncp-gold group-hover:border-uncp-gold transition-all duration-500">
                    <axis.icon className="h-7 w-7 text-uncp-gold group-hover:text-brand-950 transition-colors" />
                  </div>
                  
                  <h3 className="font-serif text-2xl lg:text-3xl font-black text-white mb-4 tracking-tight">
                    {axis.title}
                  </h3>
                  
                  <p className="text-brand-50/40 text-sm lg:text-base leading-relaxed font-medium">
                    {axis.description}
                  </p>
                </div>

                {/* Corner accent decorative */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-brand-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
