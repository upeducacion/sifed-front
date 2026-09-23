import Link from "next/link";
import { Download, ExternalLink, FileText, Link2 } from "lucide-react";
import type { Recurso } from "@/lib/api/biblioteca";
import { idiomaLabel, tipoMeta } from "@/lib/repositorio/tipos";
import { getStorageUrl, cn } from "@/lib/utils";
import { UnoptImage } from "@/components/ui/unopt-image";

function autoresLinea(autores: string[]): string {
  if (autores.length === 0) return "Sin autor registrado";
  if (autores.length <= 3) return autores.join("; ");
  return `${autores.slice(0, 3).join("; ")}, et al.`;
}

export default function ResultadoRow({ recurso }: Readonly<{ recurso: Recurso }>) {
  const meta = tipoMeta(recurso.tipo);
  const Icon = meta.icon;
  const portada = recurso.tipo === "libro" ? recurso.imagen_portada_url : null;
  const fuente = recurso.programa?.titulo || recurso.editorial;

  return (
    <li className="border-b border-border py-6 first:pt-0 last:border-0">
      <div className="flex gap-5">
        {portada && (
          <div className="relative hidden h-[76px] w-14 shrink-0 overflow-hidden rounded-sm border border-border bg-white sm:block">
            <UnoptImage src={getStorageUrl(portada)} alt="" fill sizes="56px" className="object-cover" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <span
            className={cn(
              "mb-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
              meta.badgeClass
            )}
          >
            <Icon className="h-3 w-3" aria-hidden="true" />
            {meta.label}
          </span>

          <h3 className="font-serif text-lg font-semibold leading-snug text-brand-950">
            <Link href={`/repositorio/${recurso.slug}`} className="underline-offset-4 hover:underline">
              {recurso.titulo}
            </Link>
          </h3>

          <p className="mt-1 text-[0.9rem] text-neutral-600">{autoresLinea(recurso.autores)}</p>

          <p className="mt-1 text-[13px] text-neutral-500">
            {recurso.anio}
            {fuente ? ` · ${fuente}` : ""}
            {recurso.idioma ? ` · ${idiomaLabel(recurso.idioma)}` : ""}
          </p>

          {recurso.descripcion && (
            <p className="mt-2 line-clamp-2 max-w-3xl text-[0.9rem] leading-relaxed text-neutral-600">{recurso.descripcion}</p>
          )}

          {recurso.palabras_clave.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {recurso.palabras_clave.slice(0, 3).map((palabra) => (
                <Link
                  key={palabra}
                  href={`/repositorio?q=${encodeURIComponent(palabra)}`}
                  className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-neutral-500 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  {palabra}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="hidden w-32 shrink-0 flex-col items-end gap-1.5 text-right sm:flex">
          {recurso.doi ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700">
              <Link2 className="h-3 w-3" aria-hidden="true" /> DOI
            </span>
          ) : recurso.archivo_url ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700">
              <FileText className="h-3 w-3" aria-hidden="true" /> PDF
            </span>
          ) : recurso.url_externa ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-700">
              <ExternalLink className="h-3 w-3" aria-hidden="true" /> Enlace externo
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
            <Download className="h-3 w-3" aria-hidden="true" /> {recurso.descargas}
          </span>
        </div>
      </div>
    </li>
  );
}
