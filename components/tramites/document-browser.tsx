"use client";

import { useState, useTransition, ViewTransition, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Download, Eye, FileSpreadsheet, FileText, ListChecks, PenLine, Search, X } from "lucide-react";
import type { DocumentoNormativo } from "@/types/documento-normativo";
import { getStorageUrl, cn } from "@/lib/utils";
import { documentSections, sectionOf, type DocumentSectionId, type ProcedureSlug } from "@/lib/tramites/catalog";

const PAGE_SIZE = 8;
const PREVIEW_PANE_QUERY = "(min-width: 80rem)";

const sectionIcons: Record<DocumentSectionId, typeof FileText> = {
  requisitos: ListChecks,
  modelo: PenLine,
  otros: FileText,
};

const sectionOrder = documentSections.map((section) => section.id);

function sortBySection(documentos: DocumentoNormativo[]) {
  return [...documentos].sort(
    (a, b) => sectionOrder.indexOf(sectionOf(a.sub_categoria)) - sectionOrder.indexOf(sectionOf(b.sub_categoria))
  );
}

function PdfFrame({ src, title }: Readonly<{ src: string; title: string }>) {
  const [loaded, setLoaded] = useState(false);
  return (
    <iframe
      src={src}
      title={title}
      onLoad={() => setLoaded(true)}
      className={cn("h-full w-full border-0 transition-opacity duration-300 ease-out", loaded ? "opacity-100" : "opacity-0")}
    />
  );
}

function DocumentPreview({ doc, onClose }: Readonly<{ doc: DocumentoNormativo | null; onClose: () => void }>) {
  if (!doc) {
    return (
      <div className="flex h-[28rem] flex-col items-center justify-center p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Eye className="h-7 w-7" aria-hidden="true" /></div>
        <h3 className="mt-5 font-serif text-xl font-black">Vista previa</h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">Selecciona un documento para revisarlo aquí.</p>
      </div>
    );
  }

  const fileUrl = getStorageUrl(doc.archivo_path);
  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-border bg-brand-50/60 p-4">
        <h3 className="truncate text-sm font-bold">{doc.titulo}</h3>
        <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white hover:text-brand-950" aria-label="Cerrar previsualización"><X className="h-4 w-4" /></button>
      </div>
      <div className="h-[28rem] bg-neutral-100">
        {doc.extension_archivo.toLowerCase() === "pdf"
          ? <PdfFrame src={fileUrl} title={`Vista previa de ${doc.titulo}`} />
          : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <FileSpreadsheet className="h-12 w-12 text-uncp-gold" aria-hidden="true" />
              <p className="mt-4 font-bold">Documento editable ({doc.extension_archivo.toUpperCase()})</p>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">Descárgalo, complétalo con tus datos y preséntalo en Mesa de Partes.</p>
            </div>
          )}
      </div>
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="m-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-950 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-800 active:translate-y-0">
        <Download className="h-4 w-4" aria-hidden="true" /> Descargar documento
      </a>
    </>
  );
}

export default function DocumentBrowser({ slug, documentos, searchQuery }: Readonly<{ slug: ProcedureSlug; documentos: DocumentoNormativo[]; searchQuery: string }>) {
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [, startTransition] = useTransition();

  const sortedDocuments = sortBySection(documentos);
  const showSections = sortedDocuments.some((documento) => sectionOf(documento.sub_categoria) !== "otros");
  const selectedDoc = selectedDocId === -1 ? null : sortedDocuments.find((documento) => documento.id === selectedDocId) ?? sortedDocuments[0] ?? null;
  const totalPages = Math.max(1, Math.ceil(sortedDocuments.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * PAGE_SIZE;
  const visibleDocuments = sortedDocuments.slice(pageStart, pageStart + PAGE_SIZE);

  const selectDocument = (doc: DocumentoNormativo) => {
    if (window.matchMedia(PREVIEW_PANE_QUERY).matches) {
      startTransition(() => setSelectedDocId(doc.id));
      return;
    }
    window.open(getStorageUrl(doc.archivo_path), "_blank", "noopener,noreferrer");
  };

  const goToPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    startTransition(() => {
      setCurrentPage(nextPage);
      setSelectedDocId(sortedDocuments[(nextPage - 1) * PAGE_SIZE]?.id ?? null);
    });
  };

  if (sortedDocuments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-brand-300 bg-white p-10 text-center shadow-sm">
        <Search className="mx-auto h-10 w-10 text-brand-300" aria-hidden="true" />
        <h3 className="mt-4 font-bold">{searchQuery ? "No encontramos documentos" : "Aún no hay documentos publicados"}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{searchQuery ? "Prueba con otro término de búsqueda." : "Estamos preparando los requisitos de este trámite. Consulta en Mesa de Partes mientras tanto."}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)] xl:gap-6">
      <section aria-label="Lista de documentos">
        <ViewTransition key={safeCurrentPage} enter="doc-page" exit="doc-page" default="none">
          <div className="space-y-3">
            {visibleDocuments.map((doc, index) => {
              const section = sectionOf(doc.sub_categoria);
              const sectionMeta = documentSections.find((item) => item.id === section)!;
              const startsSection = showSections && (index === 0 || sectionOf(visibleDocuments[index - 1].sub_categoria) !== section);
              const Icon = sectionIcons[section];
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div key={doc.id} className="tramite-rise" style={{ "--i": index } as CSSProperties}>
                  {startsSection && (
                    <div className={cn("mb-3 flex items-baseline justify-between gap-3", index > 0 && "pt-4")}>
                      <h3 className="font-serif text-xl font-black">{sectionMeta.title}</h3>
                      <p className="hidden text-xs text-muted-foreground sm:block">{sectionMeta.description}</p>
                    </div>
                  )}
                  <div className={cn("group relative flex items-stretch overflow-hidden rounded-lg border bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-md", isSelected ? "xl:border-brand-300 xl:bg-brand-50/50 xl:shadow-sm" : "border-border hover:border-brand-300")}>
                    {isSelected && (
                      <ViewTransition name={`doc-selected-${slug}`} share="morph" default="none">
                        <span className="absolute inset-y-3 left-0 hidden w-1 rounded-r-full bg-uncp-gold xl:block" aria-hidden="true" />
                      </ViewTransition>
                    )}
                    <button
                      type="button"
                      onClick={() => selectDocument(doc)}
                      aria-pressed={isSelected}
                      className="flex min-w-0 flex-1 items-start gap-4 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-uncp-gold"
                    >
                      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300", isSelected ? "bg-brand-50 text-brand-800 xl:bg-brand-950 xl:text-uncp-gold" : "bg-brand-50 text-brand-800 group-hover:bg-brand-950 group-hover:text-uncp-gold")}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-bold leading-snug text-brand-950">{doc.titulo}</span>
                        {doc.descripcion && <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">{doc.descripcion}</span>}
                        <span className="mt-2 flex flex-wrap gap-2">
                          {doc.extension_archivo && <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-muted-foreground">{doc.extension_archivo}</span>}
                          {!showSections && doc.categoria?.nombre && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-brand-800">{doc.categoria.nombre}</span>}
                        </span>
                      </span>
                      <Eye className="mt-1 hidden h-4 w-4 shrink-0 text-brand-300 transition group-hover:text-brand-800 xl:block" aria-hidden="true" />
                    </button>
                    <a
                      href={getStorageUrl(doc.archivo_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/download flex w-14 shrink-0 items-center justify-center border-l border-border text-brand-600 transition-colors hover:bg-brand-950 hover:text-uncp-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-uncp-gold"
                      aria-label={`Descargar ${doc.titulo}`}
                      title="Descargar"
                    >
                      <Download className="h-4 w-4 transition-transform duration-200 group-hover/download:translate-y-0.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </ViewTransition>

        {sortedDocuments.length > PAGE_SIZE && (
          <nav aria-label="Paginación de documentos" className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <span className="text-xs font-medium text-muted-foreground">
              Mostrando {pageStart + 1}-{Math.min(pageStart + PAGE_SIZE, sortedDocuments.length)} de {sortedDocuments.length}
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => goToPage(safeCurrentPage - 1)} disabled={safeCurrentPage === 1} className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-brand-800 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Página anterior">
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button key={page} type="button" onClick={() => goToPage(page)} className={cn("h-9 min-w-9 rounded-md px-2 text-xs font-bold transition-colors", page === safeCurrentPage ? "bg-brand-950 text-white" : "text-brand-800 hover:bg-brand-50")} aria-current={page === safeCurrentPage ? "page" : undefined}>
                  {page}
                </button>
              ))}
              <button type="button" onClick={() => goToPage(safeCurrentPage + 1)} disabled={safeCurrentPage === totalPages} className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-brand-800 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Página siguiente">
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </nav>
        )}
      </section>

      <aside aria-label="Vista previa" className="hidden xl:sticky xl:top-28 xl:block xl:self-start">
        <div className="overflow-hidden rounded-lg border border-brand-50 bg-white shadow-sm">
          <ViewTransition key={selectedDoc?.id ?? "empty"} enter="preview-swap" exit="preview-swap" default="none">
            <div>
              <DocumentPreview doc={selectedDoc} onClose={() => startTransition(() => setSelectedDocId(-1))} />
            </div>
          </ViewTransition>
        </div>
      </aside>
    </div>
  );
}
