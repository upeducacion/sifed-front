import type { Recurso, TipoRecurso } from "@/lib/api/biblioteca";
import { esTesis } from "@/lib/repositorio/tipos";

const INSTITUCION = "Universidad Nacional del Centro del Perú";

/** "Nombre Segundo" -> "N. S." */
function iniciales(nombrePila: string): string {
  return nombrePila
    .split(/\s+/)
    .filter(Boolean)
    .map((parte) => `${parte.charAt(0).toUpperCase()}.`)
    .join(" ");
}

/** "Apellido, Nombre" -> "Apellido, N." (formato APA 7 de autor). */
export function apaAutor(autor: string): string {
  const [apellido, nombre] = autor.split(",").map((parte) => parte.trim());
  if (!nombre) return apellido ?? autor;
  return `${apellido}, ${iniciales(nombre)}`;
}

/** Lista de autores en formato APA 7, con las reglas de "&" y elipsis (21+ autores). */
export function apaAutores(autores: string[]): string {
  const formateados = autores.map(apaAutor);
  if (formateados.length === 0) return "Sin autor";
  if (formateados.length === 1) return formateados[0];
  if (formateados.length <= 20) {
    const ultimo = formateados[formateados.length - 1];
    return `${formateados.slice(0, -1).join(", ")}, & ${ultimo}`;
  }
  const ultimo = formateados[formateados.length - 1];
  return `${formateados.slice(0, 19).join(", ")}, ... ${ultimo}`;
}

/** Identificador permanente: DOI resuelto, enlace externo, o URL del propio repositorio. */
export function enlacePermanente(recurso: Recurso, origin = ""): string {
  if (recurso.doi) return `https://doi.org/${recurso.doi}`;
  if (recurso.url_externa) return recurso.url_externa;
  if (origin) return `${origin.replace(/\/+$/, "")}/repositorio/${recurso.slug}`;
  return "";
}

function tesisLabel(tipo: TipoRecurso) {
  return tipo === "tesis_doctorado" ? "Tesis de doctorado" : "Tesis de maestría";
}

/** Referencia en formato APA 7 (texto plano, listo para copiar). */
export function citaApa(recurso: Recurso, origin = ""): string {
  const autores = apaAutores(recurso.autores);
  const enlace = enlacePermanente(recurso, origin);
  const sufijoEnlace = enlace ? ` ${enlace}` : "";

  if (esTesis(recurso.tipo)) {
    return `${autores} (${recurso.anio}). ${recurso.titulo} [${tesisLabel(recurso.tipo)}, ${INSTITUCION}].${sufijoEnlace}`;
  }

  if (recurso.tipo === "articulo") {
    const fuente = recurso.editorial ? ` ${recurso.editorial}.` : "";
    return `${autores} (${recurso.anio}). ${recurso.titulo}.${fuente}${sufijoEnlace}`;
  }

  if (recurso.tipo === "libro" || recurso.tipo === "capitulo_libro") {
    const editorial = recurso.editorial ? ` ${recurso.editorial}.` : "";
    return `${autores} (${recurso.anio}). ${recurso.titulo}.${editorial}${sufijoEnlace}`;
  }

  const fuente = recurso.editorial ? ` ${recurso.editorial}.` : "";
  return `${autores} (${recurso.anio}). ${recurso.titulo}.${fuente}${sufijoEnlace}`;
}

const BIBTEX_TYPE: Record<TipoRecurso, string> = {
  tesis_maestria: "mastersthesis",
  tesis_doctorado: "phdthesis",
  articulo: "article",
  libro: "book",
  capitulo_libro: "incollection",
  ponencia: "inproceedings",
  informe: "techreport",
  guia: "misc",
  otro: "misc",
};

function slugifyKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
}

/** Clave estable para la entrada BibTeX/RIS: primer apellido + año + primera palabra del título. */
export function claveCitacion(recurso: Recurso): string {
  const primerAutor = recurso.autores[0]?.split(",")[0] ?? "anonimo";
  const primeraPalabra = recurso.titulo.split(/\s+/)[0] ?? "obra";
  return `${slugifyKey(primerAutor)}${recurso.anio}${slugifyKey(primeraPalabra)}` || `obra${recurso.anio}`;
}

function bibtexEscape(value: string): string {
  return value.replace(/[{}]/g, "");
}

/** Entrada BibTeX (.bib) lista para descargar. */
export function citaBibtex(recurso: Recurso, origin = ""): string {
  const tipo = BIBTEX_TYPE[recurso.tipo];
  const key = claveCitacion(recurso);
  const autores = recurso.autores.join(" and ");
  const enlace = enlacePermanente(recurso, origin);

  const campos: [string, string | undefined][] = [
    ["author", autores],
    ["title", bibtexEscape(recurso.titulo)],
    ["year", String(recurso.anio)],
  ];

  if (esTesis(recurso.tipo)) {
    campos.push(["school", INSTITUCION]);
    campos.push(["type", tesisLabel(recurso.tipo)]);
  } else if (recurso.tipo === "articulo") {
    if (recurso.editorial) campos.push(["journal", recurso.editorial]);
  } else if (recurso.tipo === "libro") {
    if (recurso.editorial) campos.push(["publisher", recurso.editorial]);
  } else if (recurso.tipo === "capitulo_libro") {
    if (recurso.editorial) campos.push(["booktitle", recurso.editorial]);
  } else if (recurso.tipo === "ponencia") {
    if (recurso.editorial) campos.push(["booktitle", recurso.editorial]);
  } else if (recurso.tipo === "informe") {
    campos.push(["institution", recurso.editorial || INSTITUCION]);
  }

  if (recurso.idioma) campos.push(["language", recurso.idioma]);
  if (recurso.doi) campos.push(["doi", recurso.doi]);
  if (enlace) campos.push(["url", enlace]);

  const cuerpo = campos
    .filter((entrada): entrada is [string, string] => Boolean(entrada[1]))
    .map(([campo, valor]) => `  ${campo} = {${valor}}`)
    .join(",\n");

  return `@${tipo}{${key},\n${cuerpo}\n}`;
}

const RIS_TYPE: Record<TipoRecurso, string> = {
  tesis_maestria: "THES",
  tesis_doctorado: "THES",
  articulo: "JOUR",
  libro: "BOOK",
  capitulo_libro: "CHAP",
  ponencia: "CONF",
  informe: "RPRT",
  guia: "GEN",
  otro: "GEN",
};

/** Entrada RIS (.ris) lista para descargar (compatible con Zotero/Mendeley/EndNote). */
export function citaRis(recurso: Recurso, origin = ""): string {
  const lineas: string[] = [`TY  - ${RIS_TYPE[recurso.tipo]}`];

  for (const autor of recurso.autores) lineas.push(`AU  - ${autor}`);
  lineas.push(`TI  - ${recurso.titulo}`);
  lineas.push(`PY  - ${recurso.anio}`);
  if (recurso.editorial) lineas.push(`PB  - ${recurso.editorial}`);
  if (esTesis(recurso.tipo)) lineas.push(`PB  - ${INSTITUCION}`);
  if (recurso.idioma) lineas.push(`LA  - ${recurso.idioma}`);
  if (recurso.doi) lineas.push(`DO  - ${recurso.doi}`);
  for (const palabra of recurso.palabras_clave) lineas.push(`KW  - ${palabra}`);
  if (recurso.descripcion) lineas.push(`AB  - ${recurso.descripcion}`);
  const enlace = enlacePermanente(recurso, origin);
  if (enlace) lineas.push(`UR  - ${enlace}`);
  lineas.push("ER  - ");

  return lineas.join("\n");
}
