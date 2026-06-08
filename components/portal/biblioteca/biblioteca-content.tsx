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
  ArrowUpRight,
  Book,
} from "lucide-react";
import Link from "next/link";
import { UnoptImage } from "@/components/ui/unopt-image";
import { bibliotecaApi, PublicBibliotecaResponse } from "@/lib/api/biblioteca";
import { getStorageUrl, cn } from "@/lib/utils";
import Loader from "@/components/ui/loader";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/ui/page-hero";

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

      {/* Barra de filtros */}
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
                type="text"
                placeholder="Buscar por título, autor o docente recomendador..."
                className="w-full bg-transparent pl-7 pr-4 py-2 text-xs font-bold text-brand-950 outline-none placeholder:text-brand-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-brand-950 text-white px-5 py-3 rounded-2xl flex items-center gap-3 shrink-0">
            <Library className="w-4 h-4 text-uncp-gold" />
            <span className="text-xs font-black text-uncp-gold">{filteredRecursos.length}</span>
          </div>
        </div>
      </section>

      {/* Grid de recursos */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {isLoading && rawRecursos.length === 0 ? (
          <div className="py-20"><Loader text="Sincronizando..." /></div>
        ) : filteredRecursos.length === 0 ? (
          <div className="py-20 text-center">
            <Book className="w-12 h-12 text-brand-200 mx-auto mb-4" />
            <p className="text-sm font-bold text-brand-300 uppercase tracking-widest">Sin recursos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRecursos.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white rounded-[2rem] border border-brand-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col"
                >
                  {/* Portada */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-[2rem]">
                    {item.imagen_portada_url ? (
                      <UnoptImage
                        src={getStorageUrl(item.imagen_portada_url)}
                        alt={item.titulo}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                        <Book className="w-16 h-16 text-brand-400" />
                      </div>
                    )}

                    {/* Overlay con descripción al hacer hover */}
                    <div className="absolute inset-0 bg-brand-950/85 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                      {item.categoria && (
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-uncp-gold mb-3">
                          {item.categoria.nombre}
                        </span>
                      )}
                      {item.descripcion && (
                        <p className="text-white/80 text-sm italic leading-relaxed line-clamp-4">
                          {item.descripcion}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Cuerpo */}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    {/* Categoría y fecha */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {item.categoria && (
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-600 bg-brand-100 px-2 py-0.5 rounded">
                          {item.categoria.nombre}
                        </span>
                      )}
                      <span className="text-[9px] font-black uppercase tracking-widest text-brand-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-uncp-gold" />
                        {item.fecha_subida.split('T')[0].split('-').reverse().join(' / ')}
                      </span>
                    </div>

                    {/* Título */}
                    <h3 className="font-serif font-bold text-xl text-brand-950 leading-tight line-clamp-2">
                      {item.titulo}
                    </h3>

                    {/* Docente */}
                    {item.docente ? (
                      <Link
                        href={`/posgrado/plana-docente/${item.docente.slug}`}
                        className="flex items-center gap-2 p-2 pr-3 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-100 transition-all group/docente w-fit"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white overflow-hidden border border-brand-100 shrink-0 relative">
                          {item.docente.foto_url ? (
                            <UnoptImage
                              src={getStorageUrl(item.docente.foto_url)}
                              alt={item.docente.nombre_completo}
                              fill
                              sizes="28px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-300">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-brand-700 truncate max-w-[140px]">
                          {item.docente.nombre_completo}
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-uncp-gold opacity-0 group-hover/docente:opacity-100 transition-opacity shrink-0" />
                      </Link>
                    ) : item.recomendador_externo ? (
                      <div className="flex items-center gap-2 p-2 pr-3 bg-brand-50/50 rounded-xl border border-brand-50 w-fit">
                        <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center text-brand-300 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-brand-500 truncate max-w-[140px]">
                          {item.recomendador_externo}
                        </span>
                      </div>
                    ) : null}

                    {/* Botones */}
                    <div className="flex gap-2 mt-auto pt-2">
                      <a
                        href={getStorageUrl(item.archivo_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-brand-950 text-white px-4 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-brand-800 transition-all flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-uncp-gold" />
                        Leer
                      </a>
                      <a
                        href={getStorageUrl(item.archivo_url)}
                        download
                        className="p-2.5 rounded-xl bg-brand-50 border border-brand-100 text-brand-950 hover:bg-brand-100 transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
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
