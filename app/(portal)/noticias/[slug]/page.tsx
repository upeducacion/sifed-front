import { NoticiaService } from '@/lib/services/noticia-service';
import { UnoptImage } from "@/components/ui/unopt-image";
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { NewsToolbar } from '@/components/portal/news/news-toolbar';
import { BackButton } from '@/components/ui/back-button';
import { Noticia } from '@/types/noticia';
import { MOCK_NOTICIAS, getMockNoticiaBySlug } from '@/data/mock-noticias';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getAllNoticiasForNavigation() {
  try {
    const response = await NoticiaService.getAllPublic(1);
    const noticias = Array.isArray(response) ? response : (response?.data || []);

    return [...noticias, ...MOCK_NOTICIAS].filter(
      (noticia) => noticia.estado === "publicado"
    );
  } catch {
    return MOCK_NOTICIAS;
  }
}

async function getNoticiaBySlug(slug: string) {
  const mockNoticia = getMockNoticiaBySlug(slug);

  if (mockNoticia) {
    return mockNoticia;
  }

  return await NoticiaService.getBySlugPublic(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const noticia = await getNoticiaBySlug(slug);
    
    if (!noticia) return {};

    return {
      title: `${noticia.titulo}`,
      description: noticia.resumen || '',
      openGraph: {
        title: `${noticia.titulo} | Noticias UP Educación`,
        description: noticia.resumen || '',
        url: `https://upeducacion-uncp.edu.pe/noticias/${slug}`,
        type: 'article',
        publishedTime: noticia.created_at,
        images: [
          {
            url: noticia.imagen_url || '/opengraph-image.png',
            width: 1200,
            height: 630,
            alt: noticia.titulo,
          },
        ],
      },
    };
  } catch {
    return {
      title: 'Noticia no encontrada',
    };
  }
}

export default async function NoticiaDetallePage({ params }: PageProps) {
  const { slug } = await params;
  
  let noticia: Noticia | null = null;

  try {
    noticia = await getNoticiaBySlug(slug);
  } catch (error) {
    console.error("Error fetching noticia:", error);
    notFound();
  }

  if (!noticia) return notFound();

  const noticias = await getAllNoticiasForNavigation();
  const currentIndex = noticias.findIndex((item) => item.slug === noticia?.slug);
  const previousNoticia = currentIndex > 0 ? noticias[currentIndex - 1] : null;
  const nextNoticia = currentIndex >= 0 && currentIndex < noticias.length - 1 ? noticias[currentIndex + 1] : null;

  return (
    <article className="min-h-screen bg-white">
      <div className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4">
          <BackButton label="Volver" />
        </div>
      </div>

      <header className="container mx-auto px-4 py-12 md:py-16 max-w-5xl text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-neutral-500 mb-6">
          <span className="flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1 rounded-full">
            <Calendar className="h-4 w-4" />
            {noticia.fecha_humana}
          </span>

          {noticia.destacada && (
            <span className="bg-uncp-gold/20 text-yellow-800 px-3 py-1 rounded-full flex items-center gap-1">
              ★ Destacada
            </span>
          )}

          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Lectura de {noticia.tiempo_lectura || 3} min
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-neutral-900 leading-tight mb-8">
          {noticia.titulo}
        </h1>

        {noticia.resumen && (
          <p className="text-xl md:text-2xl text-neutral-600 font-light leading-relaxed max-w-3xl mx-auto">
            {noticia.resumen}
          </p>
        )}
      </header>

      <div className="container mx-auto px-4 max-w-6xl mb-16">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-900 shadow-2xl ring-1 ring-black/5">
          {noticia.imagen_url ? (
            <UnoptImage
              src={noticia.imagen_url}
              alt={noticia.titulo}
              fill
              className="object-contain md:object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-neutral-700 font-medium">Sin imagen de portada</span>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-neutral-400 mt-4 italic">
          Imagen referencial del evento o comunicado
        </p>
      </div>

      <div className="container mx-auto px-4 pb-24">
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          <NewsToolbar />

          <div className="flex-1 max-w-3xl mx-auto">
            <div className="prose prose-lg prose-neutral md:prose-xl 
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-neutral-900 
              prose-p:text-neutral-700 prose-p:leading-relaxed 
              prose-a:text-brand-600 prose-a:font-bold hover:prose-a:text-brand-800 
              prose-blockquote:border-l-4 prose-blockquote:border-uncp-gold prose-blockquote:bg-amber-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg
              prose-img:rounded-xl prose-img:shadow-lg"
            >
              <div dangerouslySetInnerHTML={{ __html: noticia.contenido }} />
            </div>
            
            <hr className="my-12 border-neutral-200" />
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {previousNoticia ? (
                <Link
                  href={`/noticias/${previousNoticia.slug}`}
                  className="group rounded-2xl border border-border bg-neutral-50 p-5 transition-all hover:border-brand-200 hover:bg-brand-50"
                >
                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    <ChevronLeft className="h-4 w-4" />
                    Noticia anterior
                  </div>
                  <h3 className="font-serif text-lg font-bold leading-tight text-brand-950 group-hover:text-brand-600">
                    {previousNoticia.titulo}
                  </h3>
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-5 text-sm font-bold text-muted-foreground">
                  No hay noticia anterior
                </div>
              )}

              {nextNoticia ? (
                <Link
                  href={`/noticias/${nextNoticia.slug}`}
                  className="group rounded-2xl border border-border bg-neutral-50 p-5 text-right transition-all hover:border-brand-200 hover:bg-brand-50"
                >
                  <div className="mb-2 flex items-center justify-end gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                    Siguiente noticia
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <h3 className="font-serif text-lg font-bold leading-tight text-brand-950 group-hover:text-brand-600">
                    {nextNoticia.titulo}
                  </h3>
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-5 text-right text-sm font-bold text-muted-foreground">
                  No hay siguiente noticia
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block lg:w-16"></div>
        </div>
      </div>
    </article>
  );
}