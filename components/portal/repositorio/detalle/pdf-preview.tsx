"use client";

import { useState } from "react";
import { FileText, FileWarning } from "lucide-react";
import { cn } from "@/lib/utils";

/** Previsualización perezosa del PDF con fallback accesible si el visor falla. */
export default function PdfPreview({ src, titulo }: Readonly<{ src: string; titulo: string }>) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-lg border border-border bg-neutral-50 p-8 text-center sm:aspect-[16/10]">
        <FileWarning className="h-8 w-8 text-neutral-300" aria-hidden="true" />
        <p className="text-sm text-neutral-500">No pudimos cargar la vista previa.</p>
        <a href={src} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-700 hover:underline">
          Abrir el PDF en una pestaña nueva
        </a>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-neutral-50 sm:aspect-[16/10]">
      {/* Capa de reserva: nunca queda un vacío detrás del iframe mientras carga (o si el
          visor del navegador nunca dispara onLoad, como en navegadores automatizados). */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <FileText className="h-8 w-8 text-neutral-300" aria-hidden="true" />
        <p className="text-sm text-neutral-500">Cargando vista previa…</p>
        <a href={src} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-700 hover:underline">
          Abrir PDF
        </a>
      </div>
      <iframe
        src={src}
        title={`Vista previa de ${titulo}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          "absolute inset-0 h-full w-full border-0 bg-white transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
