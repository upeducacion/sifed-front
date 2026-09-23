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
        <DocumentBrowser slug={slug} documentos={documentos} searchQuery={search} />
      </div>
    </ViewTransition>
  );
}

export function TramiteDocumentsSkeleton() {
  return (
    <ViewTransition exit="slide-down" default="none">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)] xl:gap-6" aria-busy="true" aria-label="Cargando documentos">
        <div className="space-y-3">
          <div className="mb-3 h-7 w-40 animate-pulse rounded bg-brand-50" />
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="flex items-stretch overflow-hidden rounded-lg border border-border bg-white">
              <div className="flex flex-1 items-start gap-4 p-4">
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-brand-50" />
                <div className="flex-1 space-y-2 py-0.5">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-brand-50" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-brand-50" />
                  <div className="h-4 w-12 animate-pulse rounded-full bg-brand-50" />
                </div>
              </div>
              <div className="w-14 shrink-0 border-l border-border" />
            </div>
          ))}
        </div>
        <div className="hidden overflow-hidden rounded-lg border border-brand-50 bg-white shadow-sm xl:block">
          <div className="h-14 animate-pulse border-b border-border bg-brand-50/60" />
          <div className="h-[28rem] animate-pulse bg-neutral-100" />
          <div className="m-4 h-11 animate-pulse rounded-xl bg-brand-50" />
        </div>
      </div>
    </ViewTransition>
  );
}
