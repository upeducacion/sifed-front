"use client";

import { Download, FileText } from "lucide-react";

interface QuickInfoItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}

interface DocumentViewerProps {
  title: string;
  subtitle: string;
  description: string;
  documentUrl: string;
  quickInfo: QuickInfoItem[];
}

export default function DocumentViewer({
  title,
  subtitle,
  description,
  documentUrl,
  quickInfo,
}: DocumentViewerProps) {
  return (
    <section className="w-full pt-8 pb-16 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Columna Izquierda: Información */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-brand-600 uppercase bg-brand-50 rounded-full">
                {subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-950 mb-6 leading-tight">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Datos Clave */}
            <div className="bg-white border border-border rounded-xl p-6 shadow-sm space-y-6">
              <h3 className="text-xl font-serif font-semibold text-brand-900 border-b border-border pb-2">
                Información Clave
              </h3>
              <div className="grid gap-6">
                {quickInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-brand-50 text-brand-600 rounded-lg shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <p className="text-base font-bold text-foreground">{item.value}</p>
                      {item.subValue && (
                        <p className="text-sm text-muted-foreground">{item.subValue}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón de Descarga */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={documentUrl}
                download
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white transition-all bg-brand-600 rounded-xl hover:bg-brand-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                <Download className="w-5 h-5" />
                Descargar Guía PDF
              </a>
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-brand-700 transition-all bg-white border-2 border-brand-100 rounded-xl hover:bg-brand-50 hover:border-brand-200"
              >
                <FileText className="w-5 h-5" />
                Ver en Navegador
              </a>
            </div>
          </div>

          {/* Columna Derecha: Previsualización */}
          <div className="lg:col-span-7 bg-muted/30 rounded-2xl p-4 border border-border shadow-inner min-h-[600px] lg:h-[800px]">
            <iframe
              src={`${documentUrl}#toolbar=0`}
              className="w-full h-full rounded-xl shadow-lg border border-border bg-white"
              title="Visor de Documento"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
