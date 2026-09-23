import Link from "next/link";
import { User } from "lucide-react";
import type { Recurso } from "@/lib/api/biblioteca";
import { UnoptImage } from "@/components/ui/unopt-image";
import { getStorageUrl } from "@/lib/utils";

export default function DocenteCard({ recurso }: Readonly<{ recurso: Recurso }>) {
  // El docente recomendador solo aplica a la Biblioteca Virtual; en Investigación
  // el docente relacionado es el asesor, que ya se muestra en el <dl> de metadatos.
  if (recurso.coleccion !== "biblioteca") return null;
  if (!recurso.docente && !recurso.recomendador_externo) return null;

  return (
    <div className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-white p-4">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-neutral-50">
        {recurso.docente?.foto_url ? (
          <UnoptImage src={getStorageUrl(recurso.docente.foto_url)} alt="" fill sizes="40px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-300">
            <User className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.08em] text-neutral-400">Recomendado por</p>
        {recurso.docente ? (
          <Link href={`/posgrado/plana-docente/${recurso.docente.slug}`} className="text-sm font-medium text-brand-700 hover:underline">
            {recurso.docente.nombre_completo}
          </Link>
        ) : (
          <p className="text-sm font-medium text-neutral-800">{recurso.recomendador_externo}</p>
        )}
      </div>
    </div>
  );
}
