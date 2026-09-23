import Link from "next/link";
import { Download } from "lucide-react";
import type { Recurso } from "@/lib/api/biblioteca";
import { COLECCION_LABELS, idiomaLabel, tipoMeta } from "@/lib/repositorio/tipos";
import { enlacePermanente } from "@/lib/repositorio/citas";
import { SITE_ORIGIN } from "@/lib/repositorio/metadata";
import IdentificadorCopy from "@/components/portal/repositorio/detalle/identificador-copy";

function Fila({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3 border-b border-border py-2.5 text-[13px] last:border-0">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="min-w-0 text-neutral-800">{children}</dd>
    </div>
  );
}

export default function MetadatosSidebar({ recurso }: Readonly<{ recurso: Recurso }>) {
  const meta = tipoMeta(recurso.tipo);
  const permalink = enlacePermanente({ ...recurso, doi: undefined, url_externa: undefined }, SITE_ORIGIN);

  return (
    <aside aria-label="Detalles del registro" className="space-y-6 lg:sticky lg:top-24">
      <div className="rounded-lg border border-border bg-white p-5">
        <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          Detalles del registro
        </h2>
        <dl>
          <Fila label="Tipo">{meta.label}</Fila>
          <Fila label="Colección">{COLECCION_LABELS[recurso.coleccion]}</Fila>
          <Fila label="Autor(es)">
            <ul className="space-y-0.5">
              {recurso.autores.map((autor) => (
                <li key={autor}>{autor}</li>
              ))}
            </ul>
          </Fila>
          {recurso.asesor && <Fila label="Asesor">{recurso.asesor}</Fila>}
          <Fila label="Año">{recurso.anio}</Fila>
          {recurso.programa && (
            <Fila label="Programa">
              <Link href={`/repositorio?programa_id=${recurso.programa.id}`} className="text-brand-700 hover:underline">
                {recurso.programa.titulo}
              </Link>
            </Fila>
          )}
          {recurso.editorial && <Fila label="Editorial">{recurso.editorial}</Fila>}
          {recurso.idioma && <Fila label="Idioma">{idiomaLabel(recurso.idioma)}</Fila>}
          {recurso.paginas && <Fila label="Páginas">{recurso.paginas}</Fila>}
          {recurso.licencia && <Fila label="Licencia">{recurso.licencia}</Fila>}
          {recurso.doi && (
            <Fila label="DOI">
              <a href={`https://doi.org/${recurso.doi}`} target="_blank" rel="noopener noreferrer" className="break-all text-brand-700 hover:underline">
                {recurso.doi}
              </a>
            </Fila>
          )}
          <Fila label="Identificador">
            <IdentificadorCopy permalink={permalink} path={`/repositorio/${recurso.slug}`} />
          </Fila>
          {recurso.categoria && (
            <Fila label="Categoría">
              <Link href={`/repositorio?categoria_id=${recurso.categoria.id}`} className="text-brand-700 hover:underline">
                {recurso.categoria.nombre}
              </Link>
            </Fila>
          )}
        </dl>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border bg-white px-5 py-4">
        <span className="text-[13px] text-neutral-500">Descargas</span>
        <span className="inline-flex items-center gap-1.5 font-serif text-lg tabular-nums text-brand-950">
          <Download className="h-4 w-4 text-neutral-400" aria-hidden="true" />
          {recurso.descargas.toLocaleString("es-PE")}
        </span>
      </div>
    </aside>
  );
}
