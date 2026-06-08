"use client";

import { MessageCircle, Info, Printer, Maximize2 } from "lucide-react";
import { AdmissionData } from "@/data/admission-config";

interface AdmissionUnifiedSectionProps {
  data: AdmissionData;
}

export default function AdmissionUnifiedSection({ data }: AdmissionUnifiedSectionProps) {
  const whatsappNumber = data.whatsappNumber || "51949260658";
  const whatsappMessage = encodeURIComponent(`Hola, necesito ayuda con el proceso de inscripción para ${data.type === 'maestria' ? 'la Maestría' : 'el Doctorado'}.`);

  return (
    <section id="admision" className="w-full pt-16 pb-24 px-4 md:px-8 bg-neutral-50 border-t border-border">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado Simplificado */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-black tracking-[0.2em] text-brand-600 uppercase bg-brand-50 border border-brand-200 rounded-full">
            <Info className="h-4 w-4" /> Información Oficial {data.period}
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-black text-brand-950 mb-6 leading-tight">
            Guía de Inscripción y Admisión
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-medium">
            Toda la información sobre <span className="text-brand-950 font-bold">requisitos, costos, cronograma y pasos a seguir</span> se encuentra detallada en el siguiente documento oficial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Columna Izquierda: Visor de PDF (Más grande) */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-3 border-4 border-white shadow-2xl overflow-hidden min-h-[500px] lg:h-[850px]">
            <iframe
              src={`${data.documentUrl}#toolbar=0`}
              className="w-full h-full rounded-2xl border border-border"
              title="Visor de Guía de Admisión"
            />
          </div>

          {/* Columna Derecha: Acciones Intuitivas */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Botón Descargar (Principal) */}
            <a
              href={data.documentUrl}
              download
              className="group flex flex-col items-center justify-center gap-4 p-8 text-center bg-brand-950 text-white rounded-[2rem] hover:bg-brand-800 transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Printer className="h-8 w-8 text-uncp-gold" />
              </div>
              <div>
                <span className="block text-xl font-black uppercase tracking-wider mb-1">Descargar Guía</span>
                <span className="text-sm font-medium text-brand-200">Para leer en su PC o Imprimir</span>
              </div>
            </a>

            {/* Botón WhatsApp (Soporte) */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-4 p-8 text-center bg-emerald-600 text-white rounded-[2rem] hover:bg-emerald-500 transition-all hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="h-8 w-8" />
              </div>
              <div>
                <span className="block text-xl font-black uppercase tracking-wider mb-1">¿Necesita Ayuda?</span>
                <span className="text-sm font-medium text-emerald-50 italic">WhatsApp: {whatsappNumber}</span>
              </div>
            </a>

            {/* Botón Ver Pantalla Completa (Secundario) */}
            <a
              href={data.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-6 bg-white border-2 border-brand-100 text-brand-950 rounded-[2rem] hover:border-brand-300 hover:bg-brand-50 transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <Maximize2 className="h-6 w-6 text-brand-600" />
              </div>
              <span className="text-lg font-bold">Ver en pantalla completa</span>
            </a>

            {/* Aviso de Confianza */}
            <div className="mt-auto p-6 bg-brand-50/50 border border-brand-100 rounded-[2rem] text-center">
               <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-3">Documento Verificado</p>
               <p className="text-sm font-medium text-brand-900 leading-relaxed">
                  Esta es la última versión oficial emitida por la Unidad de Posgrado de la Facultad de Educación - UNCP.
               </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
