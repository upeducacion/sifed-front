"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { UnoptImage } from "@/components/ui/unopt-image";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "¿Cuáles son los requisitos para postular?",
    answer: (
      <div className="space-y-3 text-sm">
        <p>Los interesados deben cumplir con los siguientes requisitos generales:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Grado académico:</strong> Título de licenciatura o equivalente.</li>
          <li><strong>Formulario:</strong> Completar la ficha de inscripción web.</li>
          <li><strong>Documentación:</strong> CV actualizado, copia de DNI y bachiller.</li>
          <li><strong>Pago:</strong> Derecho de inscripción en entidades autorizadas.</li>
          <li><strong>Evaluación:</strong> Entrevista personal o evaluación según programa.</li>
        </ul>
      </div>
    )
  },
  {
    question: "¿Qué modalidades de estudio ofrecen?",
    answer: (
      <div className="space-y-3 text-sm">
        <p>Contamos con tres modalidades adaptadas a su disponibilidad:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Presenciales:</strong> Interacción directa en nuestras aulas.</li>
          <li><strong>Virtuales:</strong> Flexibilidad total desde cualquier lugar.</li>
          <li><strong>Híbridos:</strong> Combinación equilibrada de sesiones remotas y físicas.</li>
        </ul>
      </div>
    )
  },
  {
    question: "¿Cuándo inicia el próximo proceso?",
    answer: (
      <p className="text-sm">Realizamos dos procesos de admisión al año (uno por semestre). Los nuevos postulantes pueden ingresar al inicio de cada ciclo académico. Le invitamos a estar atento a los plazos en nuestra web.</p>
    )
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="pt-20 pb-0 bg-brand-50 border-b border-border overflow-hidden relative">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          
          {/* Columna Izquierda: Imagen (Cutout alineado al fondo) */}
          <div className="lg:col-span-5 relative order-2 lg:order-1 flex justify-center lg:justify-start items-end">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-[450px] lg:max-w-none flex items-end"
            >
              <UnoptImage 
                src="/images/Img-alumnos-Admision.webp" 
                alt="Estudiantes de Posgrado UNCP" 
                width={600} 
                height={800} 
                className="w-full h-auto drop-shadow-[-20px_0_50px_rgba(0,0,0,0.1)] translate-y-[1px]" 
                priority
              />
            </motion.div>
            {/* Resplandor de fondo */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[100%] bg-gradient-to-t from-uncp-gold/20 via-transparent to-transparent blur-[80px] -z-0 opacity-40" />
          </div>

          {/* Columna Derecha: Acordeón (Con padding inferior para compensar) */}
          <div className="lg:col-span-7 order-1 lg:order-2 pb-16">
            <div className="mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-uncp-gold mb-2 block">Soporte Académico</span>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-950 mb-4 leading-tight">
                Preguntas Frecuentes
              </h2>
              <p className="text-base text-muted-foreground font-medium max-w-xl">
                Resolvemos sus dudas principales sobre el proceso de admisión.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div 
                    key={index}
                    className={cn(
                      "rounded-2xl border transition-all duration-300",
                      isOpen ? "bg-white border-brand-200 shadow-xl" : "bg-white/50 border-border hover:border-brand-200"
                    )}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                    >
                      <span className={cn(
                        "text-base font-bold transition-colors",
                        isOpen ? "text-brand-950" : "text-brand-950/70"
                      )}>
                        {faq.question}
                      </span>
                      <div className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                        isOpen ? "bg-brand-950 text-white" : "bg-brand-50 text-brand-600"
                      )}>
                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-brand-50 pt-4">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center gap-4">
               <div className="h-px flex-1 bg-border" />
               <a 
                href="https://wa.me/51949260658" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-black uppercase tracking-widest text-brand-600 hover:text-brand-950 transition-colors flex items-center gap-2"
               >
                 ¿Más dudas? WhatsApp <Plus className="w-3 h-3" />
               </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
