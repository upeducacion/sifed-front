"use client";

import PageHero from "@/components/ui/page-hero";
import { DocumentoNormativo, DocumentoCategoria } from "@/types/documento-normativo";
import { getStorageUrl, cn } from "@/lib/utils";
import Link from "next/link";
import { FileText, Hash, ExternalLink, Scale, FileSpreadsheet, FileSignature, Shield, BookOpen, ClipboardList, Expand, Eye } from "lucide-react";
import DocumentosSearch from "./documentos-search";
import { useState } from "react";

interface DocumentosNormativosContentProps {
  documentos: DocumentoNormativo[];
  categorias: DocumentoCategoria[];
  currentCategoria: string;
  searchQuery: string;
}

const getIconForCategoria = (slug: string) => {
  if (slug.includes('ley') || slug.includes('normativa')) return Scale;
  if (slug.includes('formato') || slug.includes('plantilla')) return FileSpreadsheet;
  if (slug.includes('flujo')) return ClipboardList;
  if (slug.includes('guia') || slug.includes('manual')) return BookOpen;
  return FileText;
};

export default function DocumentosNormativosContent({ 
  documentos, 
  categorias, 
  currentCategoria, 
  searchQuery 
}: DocumentosNormativosContentProps) {
  const [selectedDoc, setSelectedDoc] = useState<DocumentoNormativo | null>(null);

  const handleSelectDoc = (e: React.MouseEvent, doc: DocumentoNormativo) => {
    // Si la pantalla es menor a 1024px (Mobile/Tablet), dejamos que el Link abra la nueva pestaña naturalmente.
    if (window.innerWidth < 1024) {
      return;
    }
    
    // En Desktop (lg), prevenimos la pestaña nueva y mostramos la previsualización en el panel
    e.preventDefault(); 
    setSelectedDoc(doc);
  };

  return (
    <main className="flex-1 w-full bg-neutral-50/30">
      <PageHero
        title="DOCUMENTOS NORMATIVOS"
        subtitle="UNIDAD DE POSGRADO"
        description="Accede de forma instantánea a toda la normativa nacional, formatos oficiales, diagramas de flujos y manuales requeridos para tus trámites académicos."
        imageSrc="/images/fondouncp1920x1080.webp"
        size="compact"
        align="center"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Documentos" }
        ]}
      />

      <section className="py-12 md:py-20 relative">
        <div className="container mx-auto px-6 lg:px-12 max-w-[1500px]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Columna Izquierda: Filtros y Búsqueda (3 Columnas o 25%) */}
            <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-32 hidden md:block">
              {/* Navegación por Categorías */}
              <div className="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden p-3">
                <h3 className="px-5 py-4 font-black text-brand-950 uppercase tracking-widest text-[10px] opacity-60">Clasificación</h3>
                <nav className="flex flex-col gap-1">
                  <Link 
                    href="/documentos-normativos" 
                    scroll={false}
                    className={cn(
                      "px-5 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-3",
                      !currentCategoria 
                        ? "bg-brand-950 text-white shadow-md scale-[1.02]" 
                        : "text-muted-foreground hover:bg-neutral-50 hover:text-brand-950"
                    )}
                  >
                    <FileText className="h-4 w-4" />
                    Todos los Documentos
                  </Link>
                  {categorias.map(cat => {
                    const Icon = getIconForCategoria(cat.slug);
                    const isActive = currentCategoria === cat.slug;
                    return (
                      <Link 
                        key={cat.id} 
                        href={`/documentos-normativos?categoria=${cat.slug}`} 
                        scroll={false}
                        className={cn(
                          "px-5 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center gap-3",
                          isActive 
                            ? "bg-brand-950 text-white shadow-md scale-[1.02]" 
                            : "text-muted-foreground hover:bg-neutral-50 hover:text-brand-950"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-uncp-gold" : "")} />
                        {cat.nombre}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Buscador */}
              <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm">
                <h3 className="font-black text-brand-950 uppercase tracking-widest text-[10px] opacity-60 mb-4">Filtrar Resultados</h3>
                <DocumentosSearch initialQuery={searchQuery} />
              </div>

              {/* Banner Promocional / Ayuda */}
              <div className="bg-brand-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group border border-brand-800">
                <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <Shield className="h-48 w-48" />
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-uncp-gold">
                        <FileSignature className="h-5 w-5" strokeWidth={2.5} />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-uncp-gold">Mesa de Partes Virtual</h3>
                    </div>
                    <p className="text-white text-sm leading-relaxed font-medium">
                      Si necesitas orientación para presentar formatos, nuestro equipo está listo para ayudarte.
                    </p>
                  </div>
                  
                  <a 
                    href="https://erpcampus.uncp.edu.pe/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 bg-uncp-gold text-brand-950 font-bold tracking-wide py-3.5 px-4 rounded-xl hover:bg-amber-400 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
                  >
                    Ir a Mesa de Partes <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </aside>

            {/* Mobile Nav */}
            <div className="md:hidden flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
               <Link 
                  href="/documentos-normativos" 
                  scroll={false}
                  className={cn("px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap", !currentCategoria ? "bg-brand-950 text-white" : "bg-white border border-border text-muted-foreground")}
               >
                 Todos
               </Link>
               {categorias.map(cat => (
                 <Link 
                    key={cat.id} 
                    href={`/documentos-normativos?categoria=${cat.slug}`} 
                    scroll={false}
                    className={cn("px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap", currentCategoria === cat.slug ? "bg-brand-950 text-white" : "bg-white border border-border text-muted-foreground")}
                 >
                   {cat.nombre}
                 </Link>
               ))}
            </div>

            {/* Columna Central: Feed de Documentos (5 Columnas o ~40%) */}
            <section className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between mb-2 px-2">
                 <h2 className="font-serif text-2xl font-bold text-brand-950">
                    {currentCategoria ? categorias.find(c => c.slug === currentCategoria)?.nombre : 'Explorar Documentos'}
                 </h2>
                 <span className="text-xs font-bold text-muted-foreground bg-neutral-100 px-3 py-1 rounded-full">
                    {documentos.length} result.
                 </span>
              </div>

              {documentos.length === 0 ? (
                  <div className="bg-white p-16 rounded-[2rem] text-center border border-border border-dashed shadow-sm">
                    <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-6 opacity-20"/>
                    <h3 className="font-bold text-xl text-brand-950 mb-2">No hay documentos</h3>
                    <p className="text-muted-foreground font-medium">
                      Intenta buscar con otros términos.
                    </p>
                  </div>
              ) : (
                  <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar pb-10">
                    {documentos.map(doc => {
                        const Icon = getIconForCategoria(doc.categoria?.slug || '');
                        const isDerogado = doc.estado === 'derogado';
                        const isSelected = selectedDoc?.id === doc.id;
                        
                        return (
                          <a 
                            key={doc.id} 
                            href={getStorageUrl(doc.archivo_path)} 
                            onClick={(e) => handleSelectDoc(e, doc)}
                            className={cn(
                              "group block bg-white rounded-[2rem] p-6 border transition-all duration-300",
                              isSelected ? "border-brand-500 shadow-md ring-4 ring-brand-500/10" : "border-border hover:border-brand-200 hover:shadow-md",
                              isDerogado && !isSelected && "border-red-100 opacity-75 grayscale hover:grayscale-0 hover:opacity-100"
                            )}
                          >
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                <div className={cn(
                                  "shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center border transition-transform",
                                  isSelected ? "bg-brand-600 text-white border-brand-600 scale-105" :
                                  isDerogado ? "bg-red-50 text-red-600 border-red-100 group-hover:scale-105" : "bg-brand-50 text-brand-600 border-brand-100 group-hover:scale-105"
                                )}>
                                    <Icon className="h-7 w-7" />
                                </div>
                                
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                                          {doc.categoria?.nombre || 'General'}
                                        </span>
                                        {doc.extension_archivo && (
                                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border px-2.5 py-1 rounded-full">
                                             {doc.extension_archivo}
                                           </span>
                                        )}
                                        {isDerogado && (
                                           <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full ml-auto">
                                             Derogado
                                           </span>
                                        )}
                                    </div>
                                    
                                    <h4 className={cn(
                                      "font-bold text-lg mb-2 transition-colors leading-snug pr-4",
                                      isSelected ? "text-brand-600" : "text-brand-950 group-hover:text-brand-600"
                                    )}>
                                      {doc.titulo}
                                    </h4>
                                    
                                    {doc.codigo && (
                                      <p className="text-xs font-bold text-brand-400 mb-3 flex items-center gap-1.5">
                                        <Hash className="h-3.5 w-3.5" /> {doc.codigo}
                                        {doc.fecha_año && <span className="opacity-50 mx-1">•</span>}
                                        {doc.fecha_año && <span className="text-muted-foreground">{doc.fecha_año}</span>}
                                      </p>
                                    )}
                                </div>
                            </div>
                          </a>
                        );
                    })}
                  </div>
              )}
            </section>

            {/* Columna Derecha: Previsualización (4 Columnas o ~35%) */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-32 h-[calc(100vh-140px)] flex flex-col">
              <div className="bg-white rounded-[2rem] border border-border shadow-sm overflow-hidden flex-1 flex flex-col">
                {selectedDoc ? (
                  <>
                    <div className="p-4 border-b border-border bg-neutral-50/50 flex items-center justify-between">
                      <h3 className="font-bold text-brand-950 text-sm truncate pr-4">{selectedDoc.titulo}</h3>
                      <a 
                        href={getStorageUrl(selectedDoc.archivo_path)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 transition-colors"
                      >
                        <Expand className="h-3 w-3" /> Completo
                      </a>
                    </div>
                    <div className="flex-1 bg-neutral-100 relative">
                      {selectedDoc.extension_archivo.toLowerCase() === 'pdf' ? (
                        <iframe 
                          src={getStorageUrl(selectedDoc.archivo_path)} 
                          className="absolute inset-0 w-full h-full border-none"
                          title="Previsualización PDF"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white">
                          <FileSpreadsheet className="h-16 w-16 text-uncp-gold mb-4 opacity-50" />
                          <p className="font-bold text-brand-950 mb-2">Previsualización no disponible para archivos {selectedDoc.extension_archivo}</p>
                          <p className="text-sm text-muted-foreground mb-6">Por favor descarga el archivo para verlo.</p>
                          <a 
                            href={getStorageUrl(selectedDoc.archivo_path)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-uncp-gold text-brand-950 font-bold px-6 py-2.5 rounded-xl hover:bg-amber-400 transition-colors shadow-md"
                          >
                            Descargar Archivo
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground opacity-50">
                    <Eye className="h-16 w-16 mb-4" />
                    <p className="font-bold text-lg text-brand-950 mb-2">Panel de Previsualización</p>
                    <p className="text-sm">Haz clic en cualquier documento de la lista para leerlo aquí sin salir de la página.</p>
                  </div>
                )}
              </div>
            </aside>

          </div>
        </div>
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </main>
  );
}
