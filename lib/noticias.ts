import { Noticia } from "@/types/noticia";
import { NoticiaCategoria } from "@/types/noticia-categoria";

/**
 * Nombres de las secciones (categorías) de comunicados.
 * Se crean desde Admin > Noticias > Secciones con estos nombres exactos
 * (no importan mayúsculas ni tildes).
 */
export const COMUNICADOS_PERMANENTES = "Comunidad Estudiantil"; // TEMPORAL vista previa local: "Comunicados Permanentes"
export const COMUNICADOS_TEMPORALES = "Novedades Académicas"; // TEMPORAL vista previa local: "Comunicados Temporales"

/** Días que un comunicado temporal sigue visible en la portada desde su publicación. */
export const VIGENCIA_TEMPORALES_DIAS = 60; // TEMPORAL vista previa local: 30

export type TipoComunicado = "permanente" | "temporal";

const normalizar = (texto: string) =>
  texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").trim().toLowerCase();

export function tipoComunicadoDeCategoria(
  categoria: Pick<NoticiaCategoria, "nombre"> | null | undefined
): TipoComunicado | null {
  if (!categoria) return null;
  const nombre = normalizar(categoria.nombre);
  if (nombre === normalizar(COMUNICADOS_PERMANENTES)) return "permanente";
  if (nombre === normalizar(COMUNICADOS_TEMPORALES)) return "temporal";
  return null;
}

/** Fecha hasta la que un comunicado temporal se muestra en la portada. */
export function venceEl(noticia: Noticia) {
  const fecha = new Date(`${noticia.fecha_publicacion}T00:00:00`);
  fecha.setDate(fecha.getDate() + VIGENCIA_TEMPORALES_DIAS);
  return fecha;
}

/**
 * Separa las noticias en comunicados permanentes, comunicados temporales vigentes
 * y noticias eventuales, conservando el orden original. Los temporales vencidos
 * no aparecen en ningún grupo (siguen disponibles en /noticias).
 */
export function separarComunicados(noticias: Noticia[], hoy = new Date()) {
  const permanentes: Noticia[] = [];
  const temporales: Noticia[] = [];
  const eventuales: Noticia[] = [];
  for (const noticia of noticias) {
    const tipo = tipoComunicadoDeCategoria(noticia.categoria);
    if (tipo === "permanente") permanentes.push(noticia);
    else if (tipo === "temporal") {
      if (venceEl(noticia) > hoy) temporales.push(noticia);
    } else eventuales.push(noticia);
  }
  return { permanentes, temporales, eventuales };
}
