"use client";

import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/** Identificador permanente: una sola línea truncada (ruta), URL completa en title/aria, con copiado. */
export default function IdentificadorCopy({ permalink, path }: Readonly<{ permalink: string; path: string }>) {
  const { showToast } = useToast();

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(permalink);
      showToast("Enlace copiado al portapapeles", "success");
    } catch {
      showToast("No se pudo copiar el enlace", "error");
    }
  };

  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <span className="min-w-0 flex-1 truncate" title={permalink}>
        {path}
      </span>
      <button
        type="button"
        onClick={copiar}
        aria-label="Copiar identificador permanente"
        className="shrink-0 rounded p-1 text-neutral-400 transition-colors hover:bg-muted hover:text-neutral-700"
      >
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </span>
  );
}
