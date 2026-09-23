"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { Copy, Download, X } from "lucide-react";
import type { Recurso } from "@/lib/api/biblioteca";
import { citaApa, citaBibtex, citaRis, claveCitacion } from "@/lib/repositorio/citas";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Tab = "apa" | "bibtex" | "ris";

const TAB_LABEL: Record<Tab, string> = { apa: "APA 7", bibtex: "BibTeX", ris: "RIS" };

/**
 * Diálogo accesible (dialog nativo: atrapa foco, Esc cierra, devuelve el foco)
 * con pestañas APA 7 / BibTeX / RIS, copiar al portapapeles y descarga .bib/.ris.
 */
export default function CitarDialog({
  recurso,
  triggerClassName,
  children,
}: Readonly<{ recurso: Recurso; triggerClassName?: string; children: ReactNode }>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<Tab>("apa");
  const { showToast } = useToast();
  const tabsId = useId();

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const contenido = {
    apa: citaApa(recurso, origin),
    bibtex: citaBibtex(recurso, origin),
    ris: citaRis(recurso, origin),
  }[tab];

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(contenido);
      showToast("Cita copiada al portapapeles", "success");
    } catch {
      showToast("No se pudo copiar la cita", "error");
    }
  };

  const descargar = () => {
    const ext = tab === "bibtex" ? "bib" : "ris";
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${claveCitacion(recurso)}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()} className={triggerClassName}>
        {children}
      </button>
      <dialog
        ref={dialogRef}
        aria-label="Citar este recurso"
        className="m-auto w-[min(34rem,92vw)] rounded-lg border border-border bg-white p-0 shadow-sm backdrop:bg-brand-950/50 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-serif text-lg font-semibold text-brand-950">Citar este recurso</h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Cerrar"
            className="rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-muted hover:text-neutral-700"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div role="tablist" aria-label="Formato de cita" className="flex gap-1 border-b border-border px-5 pt-3">
          {(Object.keys(TAB_LABEL) as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              id={`${tabsId}-tab-${t}`}
              aria-selected={tab === t}
              aria-controls={`${tabsId}-panel`}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-t-md border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                tab === t ? "border-brand-600 text-brand-800" : "border-transparent text-neutral-500 hover:text-neutral-800"
              )}
            >
              {TAB_LABEL[t]}
            </button>
          ))}
        </div>

        <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${tab}`} className="px-5 py-4">
          <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-md border border-border bg-neutral-50 p-3 text-[13px] leading-relaxed text-neutral-700">
            {contenido}
          </pre>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copiar}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
            >
              <Copy className="h-4 w-4" aria-hidden="true" /> Copiar
            </button>
            {tab !== "apa" && (
              <button
                type="button"
                onClick={descargar}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-brand-950 transition-colors hover:bg-muted"
              >
                <Download className="h-4 w-4" aria-hidden="true" /> Descargar .{tab === "bibtex" ? "bib" : "ris"}
              </button>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
