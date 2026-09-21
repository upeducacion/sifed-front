import Link from "next/link";
import { ArrowLeft, ArrowRight, ClipboardList, FileText, Landmark, GraduationCap } from "lucide-react";

export const procedures = {
  "constancia-egresado": {
    title: "Constancia de egresado",
    description: "Gestiona la constancia que acredita la culminación de tus estudios académicos.",
    type: "constancia-egresado",
    icon: GraduationCap,
  },
  "record-academico": {
    title: "Récord académico",
    description: "Solicita información y documentación relacionada con tu historial académico.",
    type: "record-academico",
    icon: FileText,
  },
  "reserva-matricula": {
    title: "Reserva de matrícula",
    description: "Revisa los requisitos y formatos para gestionar tu reserva de matrícula.",
    type: "reserva-matricula",
    icon: ClipboardList,
  },
  "mesa-de-partes": {
    title: "Mesa de partes",
    description: "Encuentra la información necesaria para presentar solicitudes institucionales.",
    type: "mesa-de-partes",
    icon: Landmark,
  },
} as const;

export type ProcedureSlug = keyof typeof procedures;

export default function TramiteDetailContent({ slug }: Readonly<{ slug: ProcedureSlug }>) {
  const procedure = procedures[slug];
  const Icon = procedure.icon;
  const documentsHref = `/documentos-normativos?type=${encodeURIComponent(procedure.type)}`;

  return (
    <main className="flex-1 bg-neutral-50/30">
      <section className="bg-brand-950 text-white">
        <div className="page-shell py-16 lg:py-24">
          <Link href="/tramites" className="mb-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-200 transition hover:text-uncp-gold">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a trámites
          </Link>
          <div className="flex items-start gap-5">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-white/10 text-uncp-gold"><Icon className="h-7 w-7" aria-hidden="true" /></span>
            <div>
              <span className="mb-3 block text-xs font-black uppercase tracking-[0.28em] text-uncp-gold">Trámite académico</span>
              <h1 className="font-serif text-4xl font-black leading-tight md:text-6xl">{procedure.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-100 md:text-lg">{procedure.description}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="page-shell py-12 lg:py-20">
        <div className="rounded-lg border border-border bg-white p-8 shadow-sm md:p-10">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-amber-700">Siguiente paso</span>
          <h2 className="font-serif text-3xl font-black text-brand-950">Consulta los requisitos y formatos</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">Los documentos oficiales, guías y formatos disponibles para este trámite se encuentran en el repositorio institucional.</p>
          <Link href={documentsHref} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-700">Ver documentos del trámite <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
