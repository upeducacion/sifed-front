import { ViewTransition } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProcedure, navTransition, procedureGroups, proceduresInGroup, type Procedure, type ProcedureSlug } from "@/lib/tramites/catalog";

export function StepBadge({ procedure, isActive = false, className }: Readonly<{ procedure: Procedure; isActive?: boolean; className?: string }>) {
  if (!procedure.step) return null;
  return (
    <span
      className={cn(
        "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-black transition-colors",
        isActive && "border-uncp-gold bg-uncp-gold text-brand-950",
        !isActive && procedure.step.optional && "border-dashed border-brand-300 bg-white text-brand-600",
        !isActive && !procedure.step.optional && "border-brand-300 bg-white text-brand-800",
        className
      )}
      aria-hidden="true"
    >
      {procedure.step.label}
    </span>
  );
}

function ActivePill({ morph }: Readonly<{ morph: boolean }>) {
  const pill = <span className="absolute inset-0 rounded-lg bg-brand-950 shadow-md" aria-hidden="true" />;
  if (!morph) return pill;
  return <ViewTransition name="tramite-nav-active" share="morph" default="none">{pill}</ViewTransition>;
}

function ProcedureLinks({ selectedSlug, variant }: Readonly<{ selectedSlug?: ProcedureSlug; variant: "mobile" | "desktop" }>) {
  return (
    <div className="space-y-5">
      {procedureGroups.map((group) => {
        const items = proceduresInGroup(group.id);
        const isPath = group.id === "grado";
        const List = isPath ? "ol" : "ul";
        const headingId = `nav-${variant}-${group.id}`;
        return (
          <section key={group.id} aria-labelledby={headingId}>
            <h3 id={headingId} className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-gold-700">
              {group.title}
            </h3>
            <List className={cn("relative mt-2 space-y-0.5", isPath && "before:absolute before:bottom-5 before:left-6 before:top-5 before:w-0.5 before:bg-brand-50")}>
              {items.map((procedure) => {
                const isActive = selectedSlug === procedure.slug;
                const Icon = procedure.icon;
                return (
                  <li key={procedure.slug}>
                    <Link
                      href={selectedSlug && variant === "mobile" ? `/tramites/${procedure.slug}#documentos` : `/tramites/${procedure.slug}`}
                      transitionTypes={navTransition(selectedSlug ?? null, procedure.slug)}
                      scroll={!selectedSlug || variant === "mobile"}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-semibold leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uncp-gold",
                        isActive ? "text-white" : "text-brand-800 hover:bg-brand-50 hover:text-brand-950"
                      )}
                    >
                      {isActive && <ActivePill morph={variant === "desktop"} />}
                      {procedure.step ? (
                        <StepBadge procedure={procedure} isActive={isActive} />
                      ) : (
                        <span className={cn("relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors", isActive ? "bg-uncp-gold text-brand-950" : "bg-brand-50 text-brand-800 group-hover:bg-white")}>
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                      )}
                      <span className="relative min-w-0 flex-1">
                        {procedure.title}
                        {procedure.step?.optional && <span className={cn("mt-0.5 block text-[11px] font-medium", isActive ? "text-brand-300" : "text-muted-foreground")}>{procedure.step.optional}</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </List>
          </section>
        );
      })}
    </div>
  );
}

export default function ProcedureNav({ selectedSlug }: Readonly<{ selectedSlug?: ProcedureSlug }>) {
  const selected = selectedSlug ? getProcedure(selectedSlug) : null;

  return (
    <>
      <details key={selectedSlug} className="group/menu rounded-lg border border-brand-50 bg-white shadow-sm lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uncp-gold [&::-webkit-details-marker]:hidden">
          <span className="min-w-0">
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-gold-700">Cambiar de trámite</span>
            <span className="mt-1 block truncate font-bold text-brand-950">{selected?.title ?? "Elige un trámite"}</span>
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-brand-600 transition-transform duration-300 group-open/menu:rotate-180" aria-hidden="true" />
        </summary>
        <nav aria-label="Trámites disponibles" className="details-reveal border-t border-brand-50 p-2 pt-4">
          <ProcedureLinks selectedSlug={selectedSlug} variant="mobile" />
        </nav>
      </details>

      <div className="hidden rounded-lg border border-brand-50 bg-white p-2 shadow-sm lg:block">
        <div className="px-3 pb-4 pt-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-700">Tu ruta</span>
          <h2 className="mt-1 font-serif text-xl font-black">Elige un trámite</h2>
        </div>
        <nav aria-label="Trámites disponibles">
          <ProcedureLinks selectedSlug={selectedSlug} variant="desktop" />
        </nav>
      </div>
    </>
  );
}
