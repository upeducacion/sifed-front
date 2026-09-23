import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { bibliotecaApi } from "@/lib/api/biblioteca";
import { COLECCION_LABELS, tipoMeta } from "@/lib/repositorio/tipos";
import { buildCitationMeta, buildJsonLd } from "@/lib/repositorio/metadata";
import { getStorageUrl, cn } from "@/lib/utils";
import AccionesBar from "@/components/portal/repositorio/detalle/acciones-bar";
import MetadatosSidebar from "@/components/portal/repositorio/detalle/metadatos-sidebar";
import PdfPreview from "@/components/portal/repositorio/detalle/pdf-preview";
import Relacionados from "@/components/portal/repositorio/detalle/relacionados";
import DocenteCard from "@/components/portal/repositorio/detalle/docente-card";

interface DetallePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DetallePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { recurso } = await bibliotecaApi.getPublicBySlug(slug);
    return {
      title: `${recurso.titulo} | Repositorio UP Educación UNCP`,
      description:
        recurso.descripcion?.slice(0, 180) || `${tipoMeta(recurso.tipo).label} — ${recurso.autores.join(", ")}`,
      other: buildCitationMeta(recurso),
    };
  } catch {
    return { title: "Recurso no encontrado | Repositorio Institucional" };
  }
}

export default async function RepositorioDetallePage({ params }: Readonly<DetallePageProps>) {
  const { slug } = await params;

  let data;
  try {
    data = await bibliotecaApi.getPublicBySlug(slug);
  } catch {
    notFound();
  }

  const { recurso, relacionados } = data;
  const meta = tipoMeta(recurso.tipo);
  const Icon = meta.icon;
  const jsonLd = buildJsonLd(recurso);

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="border-b border-border bg-white">
        <div className="page-shell-wide py-10">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <Link href="/repositorio" className="hover:text-brand-700">Repositorio</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/repositorio?coleccion=${recurso.coleccion}`} className="hover:text-brand-700">
              {COLECCION_LABELS[recurso.coleccion]}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-neutral-700" aria-current="page">{meta.label}</span>
          </nav>

          <span
            className={cn(
              "mb-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
              meta.badgeClass
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {meta.label}
          </span>

          <h1 className="max-w-3xl font-serif text-3xl font-bold leading-tight text-brand-950 sm:text-4xl">
            {recurso.titulo}
          </h1>

          <p className="mt-3 max-w-3xl text-[15px] text-neutral-700">
            {recurso.autores.length === 0
              ? "Sin autor registrado"
              : recurso.autores.map((autor, i) => (
                  <span key={autor}>
                    {i > 0 && "; "}
                    <Link href={`/repositorio?autor=${encodeURIComponent(autor)}`} className="text-brand-700 hover:underline">
                      {autor}
                    </Link>
                  </span>
                ))}
          </p>

          <p className="mt-1.5 text-[13px] text-neutral-500">
            {recurso.anio}
            {recurso.programa ? ` · ${recurso.programa.titulo}` : ""}
            {recurso.editorial ? ` · ${recurso.editorial}` : ""}
          </p>

          <div className="mt-6">
            <AccionesBar recurso={recurso} />
          </div>
        </div>
      </div>

      <div className="page-shell-wide py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0 max-w-[68ch]">
            {recurso.descripcion && (
              <>
                <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">Resumen</h2>
                <p className="text-[15px] leading-relaxed text-neutral-800">{recurso.descripcion}</p>
              </>
            )}

            {recurso.palabras_clave.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {recurso.palabras_clave.map((palabra) => (
                  <Link
                    key={palabra}
                    href={`/repositorio?q=${encodeURIComponent(palabra)}`}
                    className="rounded-full border border-border px-3 py-1 text-[13px] text-neutral-600 transition-colors hover:border-brand-300 hover:text-brand-700"
                  >
                    {palabra}
                  </Link>
                ))}
              </div>
            )}

            <DocenteCard recurso={recurso} />

            {recurso.archivo_url && (
              <div className="mt-8">
                <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">Vista previa</h2>
                <PdfPreview src={getStorageUrl(recurso.archivo_url)} titulo={recurso.titulo} />
              </div>
            )}

            <Relacionados items={relacionados} />
          </div>

          <MetadatosSidebar recurso={recurso} />
        </div>
      </div>
    </div>
  );
}
