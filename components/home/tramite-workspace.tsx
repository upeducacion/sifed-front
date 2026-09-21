"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardList,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Landmark,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import type { DocumentoCategoria, DocumentoNormativo } from "@/types/documento-normativo";
import { getStorageUrl, cn } from "@/lib/utils";
import DocumentosSearch from "./documentos-search";
import { procedures, type ProcedureSlug } from "./tramite-detail-content";

interface TramiteWorkspaceProps {
  selectedSlug?: ProcedureSlug;
  documentos: DocumentoNormativo[];
  categorias: DocumentoCategoria[];
  searchQuery: string;
}

type ProcedureIcon = ComponentType<{ className?: string }>;

const procedureIcons: Record<ProcedureSlug, ProcedureIcon> = {
  "constancia-egresado": GraduationCap,
  "record-academico": FileText,
  "reserva-matricula": ClipboardList,
  "mesa-de-partes": Landmark,
};

const categoryIcon = (slug: string) => {
  if (slug.includes("formato") || slug.includes("plantilla")) return FileSpreadsheet;
  return FileText;
};

export default function TramiteWorkspace({
  selectedSlug,
  documentos,
  categorias,
  searchQuery,
}: Readonly<TramiteWorkspaceProps>) {
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const selectedProcedure = selectedSlug ? procedures[selectedSlug] : null;
  const selectedDoc = documentos.find((documento) => documento.id === selectedDocId) ?? documentos[0] ?? null;

  return (
    <main className="min-h-full flex-1 bg-[#f7f5f0] text-brand-950">
      <section className="relative overflow-hidden bg-brand-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(194,157,75,0.22),transparent_32%),linear-gradient(120deg,#07182f_0%,#102e51_65%,#153d65_100%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-8 lg:px-12 lg:pb-16">
          <nav aria-label="Breadcrumb" className="mb-12 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-200">
            <Link href="/" className="transition hover:text-uncp-gold">Inicio</Link>
            <span className="text-brand-500">/</span>
            <span className="text-uncp-gold">Trámites</span>
            {selectedProcedure && <><span className="text-brand-500">/</span><span className="truncate text-brand-200">{selectedProcedure.title}</span></>}
          </nav>
          <div className="max-w-4xl">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-uncp-gold">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Atención académica
            </span>
            <h1 className="max-w-3xl font-serif text-4xl font-black leading-[1.02] text-white md:text-6xl">
              {selectedProcedure ? selectedProcedure.title : "Trámites académicos"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-100 md:text-lg">
              {selectedProcedure?.description || "Encuentra el procedimiento que necesitas y accede a sus requisitos, formatos y guías desde un solo lugar."}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-12 lg:py-12">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-lg border border-brand-100 bg-white p-3 shadow-sm">
            <div className="px-4 pb-3 pt-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">Tu ruta</span>
              <h2 className="mt-1 font-serif text-xl font-black">Elige un trámite</h2>
            </div>
            <nav aria-label="Trámites disponibles" className="space-y-1">
              {(Object.keys(procedures) as ProcedureSlug[]).map((slug) => {
                const procedure = procedures[slug];
                const Icon = procedureIcons[slug];
                const isActive = selectedSlug === slug;
                return (
                  <Link
                    key={slug}
                    href={`/tramites/${slug}`}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition",
                      isActive ? "bg-brand-950 text-white shadow-md" : "text-muted-foreground hover:bg-brand-50 hover:text-brand-950"
                    )}
                  >
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", isActive ? "bg-uncp-gold text-brand-950" : "bg-brand-50 text-brand-700 group-hover:bg-brand-100")}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">{procedure.title}</span>
                    {isActive && <ArrowRight className="h-4 w-4 text-uncp-gold" aria-hidden="true" />}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="mt-4 rounded-lg bg-[#e9dfc4] p-5 text-sm text-brand-950">
            <p className="font-black">¿Necesitas presentar una solicitud?</p>
            <p className="mt-2 leading-relaxed text-brand-800">Usa la Mesa de Partes Virtual para enviar tus documentos.</p>
            <a href="https://erpcampus.uncp.edu.pe/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-brand-950 underline decoration-uncp-gold decoration-2 underline-offset-4">
              Ir a Mesa de Partes <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </aside>

        <div className="min-w-0">
          {!selectedProcedure ? (
            <section className="rounded-lg border border-brand-100 bg-white p-7 shadow-sm md:p-10">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">Inicio de la ruta</span>
              <h2 className="mt-2 max-w-2xl font-serif text-3xl font-black md:text-4xl">¿Qué necesitas gestionar hoy?</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">Selecciona una opción para ver sus documentos oficiales, buscar por título y revisar cada archivo sin salir del trámite.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {(Object.keys(procedures) as ProcedureSlug[]).map((slug) => {
                  const procedure = procedures[slug];
                  const Icon = procedureIcons[slug];
                  return <Link key={slug} href={`/tramites/${slug}`} className="group flex items-center gap-4 rounded-lg border border-border p-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 group-hover:bg-brand-950 group-hover:text-white"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <span className="min-w-0 flex-1"><span className="block font-bold">{procedure.title}</span><span className="mt-1 block text-xs text-muted-foreground">Ver requisitos y formatos</span></span>
                    <ArrowRight className="h-4 w-4 text-brand-400 transition group-hover:translate-x-1 group-hover:text-brand-700" aria-hidden="true" />
                  </Link>;
                })}
              </div>
            </section>
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-5 rounded-lg border border-brand-100 bg-white p-6 shadow-sm md:flex-row md:items-end md:justify-between md:p-7">
                <div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-amber-700"><Check className="h-4 w-4" aria-hidden="true" /> Paso 1 completado</div>
                  <h2 className="mt-2 font-serif text-2xl font-black md:text-3xl">Documentos para {selectedProcedure.title.toLowerCase()}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{documentos.length} recursos oficiales en {categorias.length} categorías</p>
                </div>
                <div className="w-full md:max-w-xs"><DocumentosSearch initialQuery={searchQuery} /></div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
                <section aria-labelledby="documents-heading">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div><span className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Paso 2</span><h3 id="documents-heading" className="mt-1 font-serif text-2xl font-black">Revisa y descarga</h3></div>
                    <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-black text-brand-700">{documentos.length} archivos</span>
                  </div>
                  {documentos.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-brand-200 bg-white p-10 text-center shadow-sm"><Search className="mx-auto h-10 w-10 text-brand-300" aria-hidden="true" /><h4 className="mt-4 font-bold">No encontramos documentos</h4><p className="mt-2 text-sm text-muted-foreground">Prueba con otro término de búsqueda.</p></div>
                  ) : (
                    <div className="space-y-3">
                      {documentos.map((doc) => {
                        const Icon = categoryIcon(doc.categoria?.slug || "");
                        const isSelected = selectedDoc?.id === doc.id;
                        return <button key={doc.id} type="button" onClick={() => setSelectedDocId(doc.id)} className={cn("group flex w-full items-start gap-4 rounded-lg border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md", isSelected ? "border-brand-500 ring-2 ring-brand-500/10" : "border-border hover:border-brand-300")}>
                          <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", isSelected ? "bg-brand-950 text-uncp-gold" : "bg-brand-50 text-brand-700 group-hover:bg-brand-100")}><Icon className="h-5 w-5" aria-hidden="true" /></span>
                          <span className="min-w-0 flex-1"><span className="mb-2 flex flex-wrap gap-2"><span className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-brand-700">{doc.categoria?.nombre || "Documento"}</span>{doc.extension_archivo && <span className="rounded-full border border-border px-2 py-1 text-[10px] font-black uppercase tracking-wide text-muted-foreground">{doc.extension_archivo}</span>}</span><span className="block font-bold leading-snug text-brand-950">{doc.titulo}</span>{doc.codigo && <span className="mt-2 block text-xs text-muted-foreground">{doc.codigo}</span>}</span>
                          <Eye className="mt-1 h-4 w-4 shrink-0 text-brand-300 transition group-hover:text-brand-700" aria-hidden="true" />
                        </button>;
                      })}
                    </div>
                  )}
                </section>

                <aside className="xl:sticky xl:top-28 xl:self-start">
                  <div className="overflow-hidden rounded-lg border border-brand-100 bg-white shadow-sm">
                    {selectedDoc ? <>
                      <div className="flex items-center justify-between gap-3 border-b border-border bg-brand-50/60 p-4"><h3 className="truncate text-sm font-bold">{selectedDoc.titulo}</h3><button type="button" onClick={() => setSelectedDocId(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-white hover:text-brand-950" aria-label="Cerrar previsualización"><X className="h-4 w-4" /></button></div>
                      <div className="h-[28rem] bg-neutral-100">
                        {selectedDoc.extension_archivo.toLowerCase() === "pdf" ? <iframe src={getStorageUrl(selectedDoc.archivo_path)} title={`Vista previa de ${selectedDoc.titulo}`} className="h-full w-full border-0" /> : <div className="flex h-full flex-col items-center justify-center p-8 text-center"><FileSpreadsheet className="h-12 w-12 text-uncp-gold" aria-hidden="true" /><p className="mt-4 font-bold">Vista previa no disponible</p><p className="mt-2 text-sm text-muted-foreground">Descarga el archivo para revisarlo.</p></div>}
                      </div>
                      <a href={getStorageUrl(selectedDoc.archivo_path)} target="_blank" rel="noopener noreferrer" className="m-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700"><Download className="h-4 w-4" aria-hidden="true" /> Abrir documento</a>
                    </> : <div className="flex h-[28rem] flex-col items-center justify-center p-8 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand-50 text-brand-500"><Eye className="h-7 w-7" aria-hidden="true" /></div><h3 className="mt-5 font-serif text-xl font-black">Vista previa</h3><p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">Selecciona un documento para leerlo aquí.</p></div>}
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
