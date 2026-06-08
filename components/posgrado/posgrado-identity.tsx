"use client";

import { motion } from "framer-motion";

const identityItems = [
  {
    title: "Nuestra Misión",
    content: "Formar maestros y doctores con rigor científico, tecnológico y humanístico, capaces de generar conocimiento innovador que contribuya a la solución de problemas educativos regionales y nacionales.",
    label: "Propósito"
  },
  {
    title: "Nuestra Visión",
    content: "Ser la unidad de posgrado líder y referente en investigación educativa a nivel nacional e internacional, reconocida por su excelencia académica y la calidad de su producción científica.",
    label: "Futuro"
  },
  {
    title: "Valores",
    content: "Excelencia, integridad científica, compromiso social y transparencia. Pilares que guían nuestra labor docente e investigativa.",
    label: "Cultura"
  }
];

export default function PosgradoIdentity() {
  return (
    <section className="bg-neutral-50 py-24 border-b border-border overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* COLUMNA IZQUIERDA - Título e Impacto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 w-fit">
              Sobre Nosotros
            </div>
            <h2 className="text-5xl md:text-6xl xl:text-7xl font-black text-brand-950 mb-10 leading-[0.95] tracking-tighter">
              COMPROMETIDOS <br />
              CON EL <span className="text-uncp-gold">DESARROLLO</span> <br />
              EDUCATIVO
            </h2>
            
            <div className="flex gap-8 items-start mb-10">
              <div className="flex items-start gap-4">
                <div className="w-1 h-12 bg-uncp-gold rounded-full" />
                <div>
                  <span className="text-4xl font-black text-brand-950 block leading-none mb-1">65+</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground leading-tight block max-w-[100px]">
                    Años de liderazgo
                  </span>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-1 h-12 bg-brand-200 rounded-full" />
                <div>
                  <span className="text-4xl font-black text-brand-950 block leading-none mb-1">Renacyt</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground leading-tight block max-w-[100px]">
                    Investigadores calificados
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground text-lg leading-relaxed max-w-sm font-medium">
              La Unidad de Posgrado se fundamenta en la tradición académica de la UNCP, adaptándose a los desafíos de la investigación de vanguardia.
            </p>
          </motion.div>

          {/* COLUMNA DERECHA - Bloques de Identidad */}
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-5">
            {identityItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="group relative bg-brand-50/40 p-8 rounded-[1.5rem] border border-transparent hover:border-brand-100 hover:bg-white hover:shadow-xl transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] font-black text-uncp-gold uppercase tracking-[0.3em]">
                    {item.label}
                  </span>
                  <span className="text-brand-950/10 font-serif text-3xl font-black group-hover:text-brand-600/20 transition-colors">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-brand-950 mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm font-medium">
                  {item.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
