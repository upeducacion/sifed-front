"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import useSWR from "swr";
import { UnoptImage } from "@/components/ui/unopt-image";
import { 
  Camera, 
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RefreshCcw,
  Search,
  Clock
} from "lucide-react";
import { galeriasApi, Galeria, GaleriaResponse } from "@/lib/api/galerias";
import { getStorageUrl, cn } from "@/lib/utils";
import Loader from "@/components/ui/loader";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/ui/page-hero";

const categorias = [
  { id: "", label: "Todas" },
  { id: "sustentaciones", label: "Sustentaciones" },
  { id: "investigacion", label: "Investigación" },
  { id: "eventos", label: "Eventos" },
  { id: "institucional", label: "Institucional" }
];

interface GalleryContentProps {
  initialData: GaleriaResponse;
}

export default function GalleryContent({ initialData }: GalleryContentProps) {
  const [categoriaActiva, setCategoriaActiva] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [añoActivo, setAñoActivo] = useState<string>("Todos");
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const { data, isLoading, isValidating } = useSWR(
    ['/api/portal/galerias', { categoria: categoriaActiva, per_page: 100 }],
    ([, params]) => galeriasApi.getPublic(params),
    { 
      fallbackData: categoriaActiva === "" ? initialData : undefined,
      keepPreviousData: true 
    }
  );

  const galeriasRaw = useMemo(() => data?.data || [], [data]);

  const filteredPhotos = useMemo(() => {
    return galeriasRaw.flatMap((galeria: Galeria) => {
      const fechaBase = galeria.fecha_evento.split('T')[0];
      const [yearNum, monthNum, dayNum] = fechaBase.split('-').map(Number);
      const fecha = new Date(yearNum, monthNum - 1, dayNum);
      const año = yearNum.toString();
      
      const matchAño = añoActivo === "Todos" || año === añoActivo;
      const matchSearch = galeria.titulo.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchAño || !matchSearch) return [];

      return (galeria.fotos || []).map(foto => ({
        ...foto,
        galeriaTitulo: galeria.titulo,
        galeriaFecha: galeria.fecha_evento,
        año,
        mes: fecha.toLocaleString('es-ES', { month: 'long' }),
        grupoId: `${fecha.toLocaleString('es-ES', { month: 'long' })} ${año}`
      }));
    });
  }, [galeriasRaw, searchQuery, añoActivo]);

  const añosDisponibles = useMemo(() => {
    const años = new Set(galeriasRaw.map((g: Galeria) => g.fecha_evento.split('-')[0]));
    return ["Todos", ...Array.from(años).sort((a, b) => b.localeCompare(a))];
  }, [galeriasRaw]);

  const activeGroups = useMemo(() => {
    const groups = new Set(filteredPhotos.map(p => p.grupoId));
    return Array.from(groups);
  }, [filteredPhotos]);

  useEffect(() => {
    document.body.style.overflow = photoIndex !== null ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [photoIndex]);

  const handleWheel = (e: React.WheelEvent) => {
    if (photoIndex === null) return;
    setZoomLevel(prev => e.deltaY < 0 ? Math.min(prev + 0.2, 5) : Math.max(prev - 0.2, 1));
  };

  const nextPhoto = useCallback(() => {
    if (photoIndex !== null) {
      setPhotoIndex((photoIndex + 1) % filteredPhotos.length);
      setZoomLevel(1);
    }
  }, [photoIndex, filteredPhotos.length]);

  const prevPhoto = useCallback(() => {
    if (photoIndex !== null) {
      setPhotoIndex((photoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
      setZoomLevel(1);
    }
  }, [photoIndex, filteredPhotos.length]);

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHero 
        title="Memoria Visual"
        subtitle="Galería Institucional"
        description="Archivo visual de la Facultad de Educación."
        imageSrc="/images/fondouncp1920x1080.webp"
        size="compact"
        breadcrumbs={[{ label: "Galería de Fotos" }]}
      />

      <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-30">
        <div className="bg-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded-[2rem] border border-brand-100 p-2 flex flex-col lg:flex-row items-center gap-4">
          <div className="flex items-center gap-1 p-1 bg-brand-50 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setCategoriaActiva(cat.id); setPhotoIndex(null); }}
                className={cn(
                  "px-6 py-3 rounded-xl text-[10px] font-black transition-all whitespace-nowrap uppercase tracking-[0.2em]",
                  categoriaActiva === cat.id ? "bg-brand-600 text-white shadow-lg" : "text-brand-900/40 hover:text-brand-950"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-1 items-center gap-4 w-full lg:w-auto px-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-300" />
              <input 
                type="text" placeholder="Buscar..." 
                className="w-full bg-transparent pl-7 pr-4 py-2 text-sm font-bold text-brand-950 outline-none"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="bg-brand-50 text-[10px] font-black uppercase tracking-widest text-brand-900 rounded-xl px-4 py-2 outline-none cursor-pointer appearance-none"
              value={añoActivo} onChange={(e) => setAñoActivo(e.target.value)}
            >
              {añosDisponibles.map(año => (
                <option key={año} value={año}>{año === "Todos" ? "Todos los años" : año}</option>
              ))}
            </select>
          </div>

          <div className="bg-brand-950 text-white px-6 py-3 rounded-2xl flex items-center gap-3 shrink-0">
             <Camera className="w-4 h-4 text-uncp-gold" />
             <span className="text-xs font-black text-uncp-gold">{filteredPhotos.length}</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 relative">
        {isValidating && <RefreshCcw className="absolute top-0 right-6 w-4 h-4 animate-spin text-brand-200" />}

        {isLoading && galeriasRaw.length === 0 ? (
          <div className="py-20"><Loader text="Cargando..." /></div>
        ) : filteredPhotos.length === 0 ? (
          <div className="py-32 text-center font-serif text-2xl text-brand-950 font-bold opacity-20">Sin registros</div>
        ) : (
          <div className="space-y-20">
            {activeGroups.map(grupo => (
              <div key={grupo} className="space-y-8">
                <div className="flex items-center gap-6">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-950 bg-brand-50 px-5 py-2 rounded-full border border-brand-100 flex items-center gap-3">
                      <Clock className="w-3 h-3 text-uncp-gold" />
                      {grupo}
                   </h2>
                   <div className="h-px bg-brand-100 flex-1 opacity-50" />
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                  <AnimatePresence mode="popLayout">
                    {filteredPhotos.filter(p => p.grupoId === grupo).map((foto) => (
                      <motion.div
                        key={foto.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setPhotoIndex(filteredPhotos.findIndex(p => p.id === foto.id))}
                        className="group relative cursor-zoom-in rounded-3xl overflow-hidden border border-border bg-brand-50 break-inside-avoid shadow-sm hover:shadow-2xl transition-all duration-500"
                      >
                        <div className="relative w-full h-auto min-h-[200px]">
                          <UnoptImage 
                            src={getStorageUrl(foto.archivo_url)} 
                            alt={foto.galeriaTitulo || "Gallery Image"} 
                            width={500}
                            height={500}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                          <p className="text-white font-bold text-[9px] uppercase tracking-widest mb-1">{foto.galeriaTitulo}</p>
                          <p className="text-white/60 text-[8px] font-medium">{foto.galeriaFecha.split('T')[0]}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {photoIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onWheel={handleWheel}
            className="fixed inset-0 z-[100] bg-brand-950/98 flex flex-col items-center justify-center select-none backdrop-blur-2xl"
          >
            <div className="absolute top-0 left-0 right-0 z-[110] p-6 flex items-center justify-between bg-gradient-to-b from-brand-950 via-brand-950/50 to-transparent">
               <div className="flex items-center gap-4">
                  <button onClick={() => setPhotoIndex(null)} className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 transition-all"><X className="w-6 h-6" /></button>
                  <div className="hidden sm:block text-white">
                    <p className="font-bold text-xs uppercase tracking-[0.2em]">{filteredPhotos[photoIndex].galeriaTitulo}</p>
                    <p className="text-uncp-gold text-[10px] font-black uppercase tracking-widest mt-1">{photoIndex + 1} / {filteredPhotos.length}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <div className="flex bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10">
                    <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 5))} className="p-2 text-white/60 hover:text-white"><ZoomIn className="w-4 h-4" /></button>
                    <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))} className="p-2 text-white/60 hover:text-white"><ZoomOut className="w-4 h-4" /></button>
                    <button onClick={() => setZoomLevel(1)} className="p-2 text-white/60 hover:text-white"><RefreshCcw className="w-4 h-4" /></button>
                  </div>
                  <a href={getStorageUrl(filteredPhotos[photoIndex].archivo_url)} download target="_blank" className="px-6 py-3 rounded-xl bg-uncp-gold text-brand-950 font-black text-[10px] uppercase transition-all hover:bg-white hover:text-brand-950">Descargar</a>
               </div>
            </div>

            <button onClick={prevPhoto} className="absolute left-6 z-[110] w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5 transition-all"><ChevronLeft className="w-8 h-8" /></button>
            <button onClick={nextPhoto} className="absolute right-6 z-[110] w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5 transition-all"><ChevronRight className="w-8 h-8" /></button>

            <div className="w-full h-full flex items-center justify-center overflow-hidden p-4 md:p-20">
              <motion.div 
                key={photoIndex} drag={zoomLevel > 1} dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }} dragElastic={0.1}
                animate={{ scale: zoomLevel }} className="relative cursor-grab active:cursor-grabbing flex items-center justify-center"
              >
                <div className="relative max-w-[95vw] max-h-[85vh] w-[1200px] h-[800px]">
                  <UnoptImage 
                    src={getStorageUrl(filteredPhotos[photoIndex].archivo_url)} 
                    alt="Full View" 
                    fill
                    priority
                    className="object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-lg pointer-events-none transition-all duration-300" 
                  />
                </div>
              </motion.div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 max-w-[90vw] overflow-x-auto no-scrollbar">
               {filteredPhotos.map((f, i) => (
                 <button 
                   key={f.id} 
                   onClick={() => {
                     setPhotoIndex(i);
                     setZoomLevel(1);
                   }} 
                   className={cn("w-12 h-12 rounded-lg overflow-hidden transition-all flex-shrink-0 relative", photoIndex === i ? "ring-2 ring-uncp-gold scale-110" : "opacity-30 hover:opacity-100")}
                 >
                   <UnoptImage 
                    src={getStorageUrl(f.archivo_url)} 
                    alt="Thumb" 
                    fill
                    sizes="48px"
                    className="object-cover" 
                   />
                 </button>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
