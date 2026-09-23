import {
  BookMarked,
  BookOpen,
  ClipboardList,
  Compass,
  File,
  FileText,
  GraduationCap,
  Mic2,
  type LucideIcon,
} from "lucide-react";
import type { Coleccion, TipoRecurso } from "@/lib/api/biblioteca";

export interface TipoMeta {
  label: string;
  icon: LucideIcon;
  /** Clases de la escala de tokens del proyecto — nunca hex sueltos. */
  badgeClass: string;
  dotClass: string;
}

export const TIPO_LABELS: Record<TipoRecurso, string> = {
  tesis_maestria: "Tesis de Maestría",
  tesis_doctorado: "Tesis de Doctorado",
  articulo: "Artículo",
  libro: "Libro",
  capitulo_libro: "Capítulo de libro",
  ponencia: "Ponencia",
  informe: "Informe",
  guia: "Guía",
  otro: "Otro",
};

export const TIPO_META: Record<TipoRecurso, TipoMeta> = {
  tesis_maestria: {
    label: TIPO_LABELS.tesis_maestria,
    icon: GraduationCap,
    badgeClass: "bg-brand-50 text-brand-700 border-brand-100",
    dotClass: "bg-brand-600",
  },
  tesis_doctorado: {
    label: TIPO_LABELS.tesis_doctorado,
    icon: GraduationCap,
    badgeClass: "bg-brand-100 text-brand-800 border-brand-200",
    dotClass: "bg-brand-700",
  },
  articulo: {
    label: TIPO_LABELS.articulo,
    icon: FileText,
    badgeClass: "bg-green-50 text-green-700 border-green-100",
    dotClass: "bg-green-600",
  },
  libro: {
    label: TIPO_LABELS.libro,
    icon: BookOpen,
    badgeClass: "bg-gold-50 text-gold-800 border-gold-200",
    dotClass: "bg-gold-500",
  },
  capitulo_libro: {
    label: TIPO_LABELS.capitulo_libro,
    icon: BookMarked,
    badgeClass: "bg-gold-50 text-gold-700 border-gold-100",
    dotClass: "bg-gold-400",
  },
  ponencia: {
    label: TIPO_LABELS.ponencia,
    icon: Mic2,
    badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-200",
    dotClass: "bg-neutral-500",
  },
  informe: {
    label: TIPO_LABELS.informe,
    icon: ClipboardList,
    badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-200",
    dotClass: "bg-neutral-500",
  },
  guia: {
    label: TIPO_LABELS.guia,
    icon: Compass,
    badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-200",
    dotClass: "bg-neutral-500",
  },
  otro: {
    label: TIPO_LABELS.otro,
    icon: File,
    badgeClass: "bg-neutral-100 text-neutral-600 border-neutral-200",
    dotClass: "bg-neutral-400",
  },
};

export function tipoMeta(tipo: TipoRecurso): TipoMeta {
  return TIPO_META[tipo] ?? TIPO_META.otro;
}

export const COLECCION_LABELS: Record<Coleccion, string> = {
  investigacion: "Investigación",
  biblioteca: "Biblioteca Virtual",
};

export function esTesis(tipo: TipoRecurso) {
  return tipo === "tesis_maestria" || tipo === "tesis_doctorado";
}

const IDIOMA_LABELS: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  pt: "Portugués",
};

/** Nombre legible de un código de idioma (ISO 639-1); usa el código en mayúsculas si no se conoce. */
export function idiomaLabel(codigo?: string | null): string {
  if (!codigo) return "";
  return IDIOMA_LABELS[codigo.toLowerCase()] ?? codigo.toUpperCase();
}

export const SORT_LABELS: Record<string, string> = {
  recientes: "Más recientes",
  antiguos: "Más antiguos",
  titulo: "Título A–Z",
  descargas: "Más descargados",
  relevancia: "Relevancia",
};

export const LICENCIA_OPTIONS = [
  "CC BY 4.0",
  "CC BY-NC 4.0",
  "CC BY-NC-SA 4.0",
  "CC BY-SA 4.0",
  "Todos los derechos reservados",
] as const;
