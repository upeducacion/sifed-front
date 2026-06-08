import { galeriasApi, Galeria } from "@/lib/api/galerias";
import MarqueeRow from "./marquee-row";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

async function getPhotosByCategory(categoria: string) {
  try {
    const response = await galeriasApi.getPublic({ 
      categoria, 
      per_page: 2, // 2 álbumes por categoría
      sort: 'fecha_evento',
      direction: 'desc'
    });
    
    // De cada álbum tomamos las 5 fotos más representativas
    return response.data.flatMap((g: Galeria) => 
      (g.fotos || []).slice(0, 5).map(f => ({
        url: f.archivo_url,
        title: g.titulo,
        category: g.categoria
      }))
    );
  } catch (err) {
    console.error("Error en getPhotosByCategory:", err);
    return [];
  }
}

export default async function InstitutionalShowcase() {
  // Peticiones paralelas por categoría
  const [sust, inv, eve, inst] = await Promise.all([
    getPhotosByCategory("sustentaciones"),
    getPhotosByCategory("investigacion"),
    getPhotosByCategory("eventos"),
    getPhotosByCategory("institucional"),
  ]);

  const allAvailable = [...sust, ...inv, ...eve, ...inst];
  
  if (allAvailable.length === 0) return null;

  // Distribuimos las fotos (máx 40) en las 3 filas
  const row1 = allAvailable.filter((_, i) => i % 3 === 0);
  const row2 = allAvailable.filter((_, i) => i % 3 === 1);
  const row3 = allAvailable.filter((_, i) => i % 3 === 2);

  return (
    <section className="w-full bg-black py-20 overflow-hidden border-y border-white/5">
      <div className="container mx-auto px-8 mb-12 flex flex-col md:flex-row items-end justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-uncp-gold font-black uppercase tracking-[0.4em] text-[9px] mb-4 block opacity-60">Archivo de Calidad Educativa</span>
          <h2 className="font-serif text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
            Memoria <span className="text-brand-400">Institucional</span>
          </h2>
        </div>
        <Link href="/galeria-fotos" className="group flex items-center gap-3 text-white/40 font-black text-[10px] uppercase tracking-[0.3em] hover:text-uncp-gold transition-all bg-white/5 px-5 py-2.5 rounded-full border border-white/5">
           Archivo Completo <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="flex flex-col gap-3 md:gap-4">
        {row1.length > 0 && <MarqueeRow images={row1} direction="left" speed={60} label="Academia" />}
        {row2.length > 0 && <MarqueeRow images={row2} direction="right" speed={80} label="Investigación" />}
        {row3.length > 0 && <MarqueeRow images={row3} direction="left" speed={70} label="Vida Universitaria" />}
      </div>
    </section>
  );
}
