"use client";

import { motion } from "framer-motion";
import { UnoptImage } from "@/components/ui/unopt-image";

interface Photo {
  id: number;
  url: string;
  title: string;
  category: string;
  date: string;
}

interface InstitutionalBentoProps {
  photos: Photo[];
}

export default function InstitutionalBento({ photos }: InstitutionalBentoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[800px]">
      
      {/* 1. Foto Principal (Grande) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] shadow-2xl border border-brand-100"
      >
        <UnoptImage
          src={photos[0].url}
          alt={photos[0].title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        <div className="absolute bottom-10 left-10 right-10 z-20">
           <span className="bg-uncp-gold px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-brand-950 mb-4 inline-block shadow-xl">
             {photos[0].category}
           </span>
           <h3 className="text-white font-serif text-3xl md:text-4xl font-black leading-tight drop-shadow-lg">
             {photos[0].title}
           </h3>
           <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-4">
             Archivo Registrado · {photos[0].date}
           </p>
        </div>
      </motion.div>

      {/* 2. Foto Superior Derecha (Horizontal) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-[2.5rem] border border-brand-100 bg-brand-50"
      >
        {photos[1] && (
          <>
            <UnoptImage 
              src={photos[1].url} 
              alt={photos[1].title} 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-80 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-brand-950/20 group-hover:bg-transparent transition-colors" />
            <div className="absolute top-8 left-8 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-white font-black text-[10px] uppercase tracking-[0.2em] bg-brand-950/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                 {photos[1].title}
               </span>
            </div>
          </>
        )}
      </motion.div>

      {/* 3. Fotos Inferiores (Cuadradas) */}
      <div className="md:col-span-1 md:row-span-1 grid grid-cols-2 md:grid-cols-1 gap-4">
        {[2, 3].map((idx, i) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
            className="relative h-48 md:h-full group overflow-hidden rounded-[2rem] border border-brand-100 shadow-lg"
          >
            {photos[idx] && (
              <UnoptImage 
                src={photos[idx].url} 
                alt={photos[idx].title} 
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110"
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden rounded-[2.5rem] border border-brand-100 bg-brand-950 flex flex-col justify-center items-center text-center p-8">
         <h4 className="text-uncp-gold font-serif text-4xl font-black mb-2">+50</h4>
         <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
           Galerías <br /> Históricas
         </p>
         <div className="mt-8 h-px w-8 bg-white/20" />
         <p className="mt-8 text-white/60 text-[9px] font-medium leading-relaxed italic">
           &quot;La investigación es la base <br /> de nuestra tradición.&quot;
         </p>
      </div>

    </div>
  );
}
