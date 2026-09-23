"use client";

import { BookOpen, Download, ExternalLink, Quote, Share2 } from "lucide-react";
import type { Recurso } from "@/lib/api/biblioteca";
import { bibliotecaApi } from "@/lib/api/biblioteca";
import { getStorageUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import CitarDialog from "@/components/portal/repositorio/detalle/citar-dialog";

const buttonBase = "inline-flex min-h-11 items-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors";
const buttonPrimary = `${buttonBase} bg-brand-950 font-semibold text-white hover:bg-brand-800`;
const buttonSecondary = `${buttonBase} border border-border text-brand-950 hover:bg-muted`;

export default function AccionesBar({ recurso }: Readonly<{ recurso: Recurso }>) {
  const { showToast } = useToast();

  const compartir = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Enlace copiado al portapapeles", "success");
    } catch {
      showToast("No se pudo copiar el enlace", "error");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {recurso.archivo_url && (
        <a
          href={getStorageUrl(recurso.archivo_url)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => bibliotecaApi.registrarDescarga(recurso.slug)}
          className={buttonPrimary}
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" /> Leer PDF
        </a>
      )}
      {recurso.archivo_url && (
        <a
          href={getStorageUrl(recurso.archivo_url)}
          download
          onClick={() => bibliotecaApi.registrarDescarga(recurso.slug)}
          className={buttonSecondary}
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Descargar
        </a>
      )}
      <CitarDialog recurso={recurso} triggerClassName={buttonSecondary}>
        <Quote className="h-4 w-4" aria-hidden="true" /> Citar
      </CitarDialog>
      <button type="button" onClick={compartir} className={buttonSecondary}>
        <Share2 className="h-4 w-4" aria-hidden="true" /> Compartir
      </button>
      {recurso.doi && (
        <a
          href={`https://doi.org/${recurso.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonBase} text-brand-700 hover:bg-muted`}
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" /> DOI
        </a>
      )}
    </div>
  );
}
