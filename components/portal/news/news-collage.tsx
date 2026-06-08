import { NoticiaService } from '@/lib/services/noticia-service';
import { NewsCard } from './news-card';
import { ArrowRight, Calendar, ChevronRight } from 'lucide-react';
import { getStorageUrl } from '@/lib/utils';
import { UnoptImage } from "@/components/ui/unopt-image";
import Link from 'next/link';

export async function NewsCollage() {
  let news = [];
  
  try {
    const response = await NoticiaService.getAllPublic(1);
    news = Array.isArray(response) ? response : (response?.data || []);
  } catch (error) {
    console.error("Failed to fetch news on server:", error);
    // En caso de error de red, devolvemos null para no romper la portada
    return null; 
  }

  if (!news || news.length === 0) return null;

  // Separar: 1 Principal (Hero) y 3 Secundarias (Lista)
  const heroNews = news[0];
  const listNews = news.slice(1, 4);

  return (
    <section className="w-full bg-white py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header de Sección */}
        <div className="flex items-end justify-between mb-10 pb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-uncp-gold mb-2 block">
              Actualidad Institucional
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-950 leading-tight">
              Últimas Noticias
            </h2>
          </div>
          <Link 
            href="/noticias" 
            className="hidden md:flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors group"
          >
            Ver todas las noticias 
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* 1. HERO PRINCIPAL (Columna Izquierda - 7/12) */}
          <div className="lg:col-span-7 h-[500px] lg:h-[600px]">
            <NewsCard 
              noticia={heroNews} 
              featured={true} 
              className="h-full shadow-xl hover:shadow-2xl transition-shadow duration-500 rounded-3xl" 
            />
          </div>

          {/* 2. LISTA LATERAL (Columna Derecha - 5/12) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div className="space-y-6">
              {listNews.map((item) => (
                <Link 
                  key={item.id} 
                  href={`/noticias/${item.slug}`}
                  className="group flex gap-5 items-start p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                >
                  {/* Thumbnail */}
                  <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 relative rounded-xl overflow-hidden shadow-sm">
                    {item.imagen_url ? (
                      <UnoptImage
                        src={getStorageUrl(item.imagen_url)}
                        alt={item.titulo}
                        fill
                        sizes="(max-width: 768px) 96px, 128px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-50 flex items-center justify-center">
                        <span className="text-brand-200 text-xs">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-brand-400 uppercase tracking-wider mb-2">
                      <Calendar className="h-3 w-3" />
                      {item.fecha_humana}
                    </div>
                    <h3 className="font-serif font-bold text-brand-950 text-lg leading-tight mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                      {item.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.resumen}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="mt-8 md:hidden">
              <Link 
                href="/noticias" 
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand-50 text-brand-700 font-bold text-sm hover:bg-brand-100 transition-colors"
              >
                Ver todas las noticias <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
