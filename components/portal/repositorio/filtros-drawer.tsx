"use client";

import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { RepositorioFacets } from "@/lib/api/biblioteca";
import type { ParsedFiltros } from "@/lib/repositorio/params";
import { contarFiltrosActivos } from "@/lib/repositorio/params";
import FiltrosPanel from "@/components/portal/repositorio/filtros-panel";

/**
 * Trigger + <dialog> nativo para móvil: el propio elemento `<dialog>` ya
 * atrapa el foco, cierra con Esc y devuelve el foco al trigger al cerrarse.
 */
export default function FiltrosDrawer({ facets, filtros }: Readonly<{ facets: RepositorioFacets; filtros: ParsedFiltros }>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const activos = contarFiltrosActivos(filtros);

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-muted lg:hidden"
        aria-haspopup="dialog"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Filtros{activos > 0 ? ` (${activos})` : ""}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-label="Filtros del repositorio"
        className="m-0 h-full max-h-full w-full max-w-full border-0 bg-transparent p-0 backdrop:bg-brand-950/50 backdrop:backdrop-blur-sm open:animate-none"
      >
        <div className="ml-auto flex h-full w-full max-w-sm flex-col bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-serif text-lg font-semibold text-brand-950">Filtros</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-brand-950"
              aria-label="Cerrar filtros"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <FiltrosPanel facets={facets} filtros={filtros} mode="batched" onApplied={() => setOpen(false)} />
          </div>
        </div>
      </dialog>
    </>
  );
}
