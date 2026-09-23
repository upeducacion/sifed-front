import type { ComponentType } from "react";
import {
  BadgeCheck,
  CalendarClock,
  CalendarPlus,
  ClipboardList,
  FileCheck,
  FileSearch,
  FileText,
  GraduationCap,
  Landmark,
  NotebookPen,
  Receipt,
  RefreshCw,
  RotateCcw,
  ScrollText,
  Stamp,
  Timer,
} from "lucide-react";

type Icon = ComponentType<{ className?: string }>;

export const procedureGroups = [
  {
    id: "matricula",
    title: "Matrícula",
    description: "Reserva, actualiza o regulariza tu matrícula en el programa.",
    icon: ClipboardList,
  },
  {
    id: "constancias",
    title: "Constancias y certificados",
    description: "Documentos que acreditan tus estudios y tu situación académica.",
    icon: BadgeCheck,
  },
  {
    id: "grado",
    title: "Ruta para obtener el grado",
    description: "Sigue los pasos en orden: desde el plan de tesis hasta el otorgamiento del grado.",
    icon: GraduationCap,
  },
  {
    id: "atencion",
    title: "Atención general",
    description: "Consultas sobre tu historial y solicitudes institucionales.",
    icon: Landmark,
  },
] as const satisfies readonly { id: string; title: string; description: string; icon: Icon }[];

export type ProcedureGroupId = (typeof procedureGroups)[number]["id"];

export interface ProcedureStep {
  label: string;
  optional?: string;
}

export interface Procedure {
  slug: string;
  title: string;
  description: string;
  group: ProcedureGroupId;
  icon: Icon;
  step?: ProcedureStep;
}

export const procedures = [
  {
    slug: "reserva-matricula",
    title: "Reserva de matrícula",
    description: "Suspende temporalmente tus estudios conservando tu vacante en el programa.",
    group: "matricula",
    icon: CalendarPlus,
  },
  {
    slug: "actualizacion-matricula",
    title: "Actualización de matrícula",
    description: "Retoma tus estudios después de una reserva o de un periodo sin matrícula.",
    group: "matricula",
    icon: RefreshCw,
  },
  {
    slug: "matricula-asignatura-desaprobada",
    title: "Matrícula en asignatura desaprobada",
    description: "Vuelve a matricularte en una asignatura que no aprobaste.",
    group: "matricula",
    icon: RotateCcw,
  },
  {
    slug: "constancia-egresado",
    title: "Constancia de egresado",
    description: "Acredita que culminaste el plan de estudios de tu programa.",
    group: "constancias",
    icon: GraduationCap,
  },
  {
    slug: "certificado-estudios",
    title: "Certificado de estudios",
    description: "Obtén el certificado oficial de tus calificaciones de maestría o doctorado.",
    group: "constancias",
    icon: ScrollText,
  },
  {
    slug: "busqueda-informacion-tesoreria",
    title: "Búsqueda de información en Tesorería",
    description: "Solicita la verificación de pagos y registros en Tesorería.",
    group: "constancias",
    icon: Receipt,
  },
  {
    slug: "grado-plan-tesis",
    title: "Revisión y registro del plan de tesis",
    description: "Presenta tu plan de tesis para su revisión, aprobación y registro.",
    group: "grado",
    icon: NotebookPen,
    step: { label: "1" },
  },
  {
    slug: "grado-prorroga-plan",
    title: "Prórroga de vigencia del plan",
    description: "Amplía la vigencia de tu plan de tesis antes de que venza.",
    group: "grado",
    icon: Timer,
    step: { label: "1b", optional: "Solo si tu plan vence" },
  },
  {
    slug: "grado-revision-borrador",
    title: "Revisión del borrador de tesis",
    description: "Envía el borrador de tu tesis a revisión por los jurados.",
    group: "grado",
    icon: FileSearch,
    step: { label: "2" },
  },
  {
    slug: "grado-cuna",
    title: "Constancia Única de No Adeudo (CUNA)",
    description: "Acredita que no tienes deudas pendientes con la universidad.",
    group: "grado",
    icon: FileCheck,
    step: { label: "3a" },
  },
  {
    slug: "grado-constancia-expedito",
    title: "Constancia de expedito",
    description: "Certifica que cumples todos los requisitos para sustentar tu tesis.",
    group: "grado",
    icon: Stamp,
    step: { label: "3b" },
  },
  {
    slug: "grado-fecha-sustentacion",
    title: "Fecha y hora de sustentación",
    description: "Solicita la programación de la sustentación pública de tu tesis.",
    group: "grado",
    icon: CalendarClock,
    step: { label: "4" },
  },
  {
    slug: "grado-otorgar-grado",
    title: "Otorgamiento del grado",
    description: "Último paso: solicita la aprobación y entrega de tu grado académico.",
    group: "grado",
    icon: GraduationCap,
    step: { label: "5" },
  },
  {
    slug: "record-academico",
    title: "Récord académico",
    description: "Solicita información y documentación relacionada con tu historial académico.",
    group: "atencion",
    icon: FileText,
  },
  {
    slug: "mesa-de-partes",
    title: "Mesa de partes",
    description: "Encuentra la información necesaria para presentar solicitudes institucionales.",
    group: "atencion",
    icon: Landmark,
  },
] as const satisfies readonly Procedure[];

export type ProcedureSlug = (typeof procedures)[number]["slug"];

export type CatalogProcedure = Omit<Procedure, "slug"> & { slug: ProcedureSlug };

export const GRADO_TOTAL_STEPS = 5;

export function isProcedureSlug(value: string): value is ProcedureSlug {
  return procedures.some((procedure) => procedure.slug === value);
}

export function getProcedure(slug: ProcedureSlug): CatalogProcedure {
  return procedures.find((procedure) => procedure.slug === slug)!;
}

export function getGroup(id: ProcedureGroupId) {
  return procedureGroups.find((group) => group.id === id)!;
}

export function proceduresInGroup(id: ProcedureGroupId): readonly CatalogProcedure[] {
  return procedures.filter((procedure) => procedure.group === id);
}

export function getAdjacentSteps(slug: ProcedureSlug) {
  const steps = proceduresInGroup("grado");
  const index = steps.findIndex((procedure) => procedure.slug === slug);
  if (index === -1) return { previous: null, next: null };
  return { previous: steps[index - 1] ?? null, next: steps[index + 1] ?? null };
}

export const documentSections = [
  { id: "requisitos", title: "Requisitos", description: "Lo que debes reunir antes de presentar tu solicitud.", match: "requisitos" },
  { id: "modelo", title: "Modelo de solicitud", description: "Formato que debes completar y presentar.", match: "modelo de solicitud" },
  { id: "otros", title: "Otros documentos", description: "Guías y documentos de referencia.", match: null },
] as const;

export type DocumentSectionId = (typeof documentSections)[number]["id"];

export function sectionOf(subCategoria: string | null | undefined): DocumentSectionId {
  const normalized = subCategoria?.trim().toLowerCase();
  return documentSections.find((section) => section.match !== null && section.match === normalized)?.id ?? "otros";
}

export const subCategoriaOptions = ["Requisitos", "Modelo de solicitud"] as const;

export type NavTransition = "nav-forward" | "nav-back";

export function navTransition(from: ProcedureSlug | null, to: ProcedureSlug | null): NavTransition[] {
  if (from === to) return [];
  if (to === null) return ["nav-back"];
  if (from === null) return ["nav-forward"];
  const order = procedures.map((procedure) => procedure.slug);
  return [order.indexOf(to) > order.indexOf(from) ? "nav-forward" : "nav-back"];
}
