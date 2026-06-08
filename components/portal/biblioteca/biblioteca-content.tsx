"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { 
  Library, 
  Search, 
  User,
  Download,
  BookOpen,
  Calendar,
  Quote,
  ArrowUpRight,
  Book,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import { UnoptImage } from "@/components/ui/unopt-image";
import { bibliotecaApi, PublicBibliotecaResponse } from "@/lib/api/biblioteca";
import { getStorageUrl, cn } from "@/lib/utils";
import Loader from "@/components/ui/loader";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/ui/page-hero";

// Componente Interno para la Descripción Expansible
function ExpansibleDescription({ text }: { text: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = text.length > 200;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Quote className="absolute -left-8 -top-4 w-10 h-10 text-brand-50 opacity-60" />
        <motion.div 
          animate={{ height: isExpanded ? "auto" : (isLongText ? 80 : "auto") }}
          className={cn(
            "text-brand-900/70 text-base md:text-lg leading-relaxed font-medium pl-4 italic overflow-hidden relative",
            !isExpanded && isLongText && "mask-fade-bottom"
          )}
        >
          {text}
          {!isExpanded && isLongText && (
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
          )}
        </motion.div>
      </div>
      
      {isLongText && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 hover:text-brand-950 transition-colors group"
        >
          {isExpanded ? (
            <>Contraer Resumen <ChevronUp className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" /></>
          ) : (
            <>Leer Resumen Completo <ChevronDown className="w-3 h-3 transition-transform group-hover:translate-y-0.5" /></>
          )}
        </button>
      )}
    </div>
  );
}

interface BibliotecaContentProps {
  initialData: PublicBibliotecaResponse;
}

export default function BibliotecaContent({ initialData }: BibliotecaContentProps) {
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useSWR(
    ['/api/portal/biblioteca', { search: searchQuery, categoria_id: categoriaActiva }],
    ([, params]) => bibliotecaApi.getPublic(params),
    { 
      fallbackData: (categoriaActiva === null && searchQuery === "") ? initialData : undefined,
      keepPreviousData: true 
    }
  );

  const rawRecursos = useMemo(() => data?.recursos?.data || [], [data]);
  const categorias = data?.categorias || [];

  const filteredRecursos = useMemo(() => {
    return rawRecursos.filter(r => 
      r.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rawRecursos, searchQuery]);

  return (
    <div className="min-h-screen bg-white pb-32">
      <PageHero 
        title="Biblioteca Virtual"
        subtitle="Repositorio Académico"
        description="Recursos académicos seleccionados para fortalecer tu formación profesional."
        imageSrc="/images/fondouncp1920x1080.webp"
        size="compact"
        breadcrumbs={[{ label: "Biblioteca Virtual" }]}
      />

      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-30">
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-brand-100 p-2 flex flex-col lg:flex-row items-center gap-4">
          <div className="flex items-center gap-1 p-1 bg-brand-50 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setCategoriaActiva(null)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[9px] font-black transition-all whitespace-nowrap uppercase tracking-[0.2em]",
                categoriaActiva === null ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30" : "text-brand-900/40 hover:text-brand-950"
              )}
            >
              Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaActiva(cat.id)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[9px] font-black transition-all whitespace-nowrap uppercase tracking-[0.2em]",
                  categoriaActiva === cat.id ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30" : "text-brand-900/40 hover:text-brand-950"
                )}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          <div className="flex flex-1 items-center gap-4 w-full lg:w-auto px-4 border-l border-brand-50">
            <div className="relative flex-1 group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-200 group-focus-within:text-brand-600" />
              <input 
                type="text" placeholder="Buscar por título, autor o docente recomendador..." 
                className="w-full bg-transparent pl-7 pr-4 py-2 text-xs font-bold text-brand-950 outline-none placeholder:text-brand-200"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-brand-950 text-white px-5 py-3 rounded-2xl flex items-center gap-3 shrink-0">
             <Library className="w-4 h-4 text-uncp-gold" />
             <span className="text-xs font-black text-uncp-gold">{filteredRecursos.length}</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        {isLoading && rawRecursos.length === 0 ? (
          <div className="py-20"><Loader text="Sincronizando..." /></div>
        ) : (
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRecursos.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-[2rem] border border-brand-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col group"
                >
                  <div className="px-6 py-4 md:px-8 md:py-6 flex flex-col md:flex-row gap-6 items-start md:items-center bg-brand-50/20 border-b border-brand-50/50">
                    <div className="w-16 h-24 shrink-0 relative rounded-lg overflow-hidden shadow-lg border-2 border-white transform group-hover:scale-105 transition-transform">
                      {item.imagen_portada_url ? (
                        <UnoptImage 
                          src={getStorageUrl(item.imagen_portada_url)} 
                          alt={item.titulo} 
                          fill
                          sizes="64px"
                          className="object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-100 flex items-center justify-center text-brand-300"><Book className="w-6 h-6" /></div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-600 bg-brand-100 px-2 py-0.5 rounded">{item.categoria?.nombre}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-300 flex items-center gap-1"><Calendar className="w-3 h-3 text-uncp-gold" />{item.fecha_subida.split('T')[0].split('-').reverse().join(' / ')}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-serif font-bold text-brand-950 leading-tight truncate">{item.titulo}</h3>
                    </div>

                    {item.docente ? (
                      <Link 
                        href={`/posgrado/plana-docente/${item.docente.slug}`} 
                        className="flex items-center gap-3 p-2 pr-4 bg-white/80 hover:bg-white rounded-2xl border border-brand-100 shadow-sm transition-all group/docente hover:border-uncp-gold/50"
                      >
                         <div className="w-10 h-10 rounded-xl bg-brand-50 overflow-hidden border border-brand-100 shrink-0 relative">
                            {item.docente?.foto_url ? (
                              <UnoptImage 
                                src={getStorageUrl(item.docente.foto_url)} 
                                alt={item.docente.nombre_completo} 
                                fill
                                sizes="40px"
                                className="object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-brand-300"><User className="w-5 h-5" /></div>
                            )}
                         </div>
                         <div className="min-w-0">
                            <p className="text-[7px] font-black uppercase tracking-tighter text-brand-400 mb-0.5">Recomendación de:</p>
                            <p className="text-[11px] font-bold text-brand-950 truncate flex items-center gap-1">{item.docente.nombre_completo}<ArrowUpRight className="w-3 h-3 text-uncp-gold opacity-0 group-hover/docente:opacity-100 transition-opacity" /></p>
                         </div>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 p-2 pr-4 bg-brand-50/50 rounded-2xl border border-border opacity-80">
                         <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-300 shrink-0"><User className="w-5 h-5" /></div>
                         <div className="min-w-0">
                            <p className="text-[7px] font-black uppercase tracking-tighter text-brand-400 mb-0.5">Sugerencia de:</p>
                            <p className="text-[11px] font-bold text-brand-950 truncate">{item.recomendador_externo || "Institución"}</p>
                         </div>
                      </div>
                    )}

                    <div className="flex gap-2 shrink-0 self-stretch md:self-center">
                       <a href={getStorageUrl(item.archivo_url)} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none bg-brand-950 text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-brand-800 transition-all flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-uncp-gold" />Lectura</a>
                       <a href={getStorageUrl(item.archivo_url)} download className="p-2.5 rounded-xl bg-white border border-brand-100 text-brand-950 hover:bg-brand-50 transition-all shadow-sm"><Download className="w-4 h-4" /></a>
                    </div>
                  </div>

                  {item.descripcion && (
                    <div className="p-6 md:p-8 lg:px-12 lg:py-8 bg-white relative">
                       <div className="max-w-6xl mx-auto">
                          <ExpansibleDescription text={item.descripcion} />
                       </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <section className="py-20 opacity-20 text-center select-none">
         <h2 className="text-2xl font-serif font-bold text-brand-950 uppercase tracking-[0.5em]">Repositorio UP Educación</h2>
      </section>
    </div>
  );
}
