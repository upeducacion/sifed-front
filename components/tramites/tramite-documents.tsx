import { ViewTransition } from "react";
import { documentosApi } from "@/lib/api/documentos";
import type { ProcedureSlug } from "@/lib/tramites/catalog";
import DocumentBrowser from "./document-browser";

export async function TramiteDocuments({ slug, search }: Readonly<{ slug: ProcedureSlug; search: string }>) {
  const documentos = await documentosApi.getPublicos({ type: slug, search: search || undefined });

  return (
    <ViewTransition key={search} enter="slide-up" exit="fade-out" default="none">
      <div>
        <p className="sr-only" aria-live="polite">
          {documentos.length === 1 ? "1 documento encontrado" : `${documentos.length} documentos encontrados`}
        </p>
        <DocumentBrowser documentos={documentos} searchQuery={search} />
      </div>
    </ViewTransition>
  );
}

export function TramiteDocumentsSkeleton() {
  return (
    <ViewTransition exit="slide-down" default="none">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)] xl:gap-6" aria-busy="true" aria-label="Cargando documentos">
        <div className="space-y-3">
          <div className="h-6 w-32 animate-pulse rounded bg-brand-50" />
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex gap-4 rounded-lg border border-border bg-white p-4">
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-brand-50" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-brand-50" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-brand-50" />
              </div>
            </div>
          ))}
        </div>
        <div className="hidden h-[34rem] animate-pulse rounded-lg border border-brand-50 bg-white xl:block" />
      </div>
    </ViewTransition>
  );
}
