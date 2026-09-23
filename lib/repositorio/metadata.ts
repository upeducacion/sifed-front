import type { Recurso, TipoRecurso } from "@/lib/api/biblioteca";
import { esTesis } from "@/lib/repositorio/tipos";
import { getStorageUrl } from "@/lib/utils";

export const SITE_ORIGIN = "https://info.upeducacion-uncp.edu.pe";
const INSTITUCION = "Universidad Nacional del Centro del Perú";

/** Meta tags Highwire (Google Scholar) para el <head> del detalle, vía `metadata.other`. */
export function buildCitationMeta(recurso: Recurso): Record<string, string | string[]> {
  const meta: Record<string, string | string[]> = {
    citation_title: recurso.titulo,
    citation_author: recurso.autores.length ? recurso.autores : ["Sin autor"],
    citation_publication_date: String(recurso.anio),
    citation_language: recurso.idioma || "es",
  };

  if (recurso.archivo_url) meta.citation_pdf_url = getStorageUrl(recurso.archivo_url);
  if (recurso.doi) meta.citation_doi = recurso.doi;
  if (recurso.editorial) meta.citation_publisher = recurso.editorial;
  if (recurso.palabras_clave.length) meta.citation_keywords = recurso.palabras_clave.join("; ");
  if (esTesis(recurso.tipo)) meta.citation_dissertation_institution = INSTITUCION;

  return meta;
}

const JSONLD_TYPE: Record<TipoRecurso, string> = {
  tesis_maestria: "Thesis",
  tesis_doctorado: "Thesis",
  articulo: "ScholarlyArticle",
  libro: "Book",
  capitulo_libro: "ScholarlyArticle",
  ponencia: "ScholarlyArticle",
  informe: "ScholarlyArticle",
  guia: "ScholarlyArticle",
  otro: "CreativeWork",
};

/** JSON-LD (ScholarlyArticle / Thesis / Book según el tipo) para el detalle del recurso. */
export function buildJsonLd(recurso: Recurso): Record<string, unknown> {
  const url = `${SITE_ORIGIN}/repositorio/${recurso.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": JSONLD_TYPE[recurso.tipo],
    name: recurso.titulo,
    headline: recurso.titulo,
    author: recurso.autores.map((autor) => ({ "@type": "Person", name: autor })),
    datePublished: String(recurso.anio),
    inLanguage: recurso.idioma || "es",
    description: recurso.descripcion || undefined,
    keywords: recurso.palabras_clave.length ? recurso.palabras_clave.join(", ") : undefined,
    publisher: recurso.editorial ? { "@type": "Organization", name: recurso.editorial } : undefined,
    ...(recurso.doi && { identifier: `https://doi.org/${recurso.doi}`, sameAs: `https://doi.org/${recurso.doi}` }),
    ...(esTesis(recurso.tipo) && {
      creator: { "@type": "CollegeOrUniversity", name: INSTITUCION },
      provider: { "@type": "CollegeOrUniversity", name: INSTITUCION },
    }),
    url,
  };
}
