import { Facebook, Youtube, MonitorPlay, ArrowUpRight, MessageSquare } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/constants";
import { getUltimosVideos } from "@/lib/youtube";
import YoutubeThumbs from "./youtube-thumbs";

export default async function SocialHubSection() {
  const videos = await getUltimosVideos(EXTERNAL_LINKS.YOUTUBE_CHANNEL_ID, 6);

  return (
    <section className="w-full overflow-hidden border-b border-border bg-white py-16">
      <div className="page-shell-wide">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* COLUMNA IZQUIERDA: INFORMACIÓN Y ACCESOS (4 COLUMNAS) */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-600 mb-3 block">Comunidad Digital</span>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-950 leading-tight">
                Conéctate con nuestra <br /> <span className="text-brand-600">Unidad de Posgrado</span>
              </h2>
              <p className="text-base text-muted-foreground font-medium mt-4 leading-relaxed">
                Accede al Aula Virtual para tu formación académica y síguenos en nuestras redes sociales para estar al día con las últimas novedades.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Botón Principal Aula Virtual */}
              <a 
                href={EXTERNAL_LINKS.AULA_VIRTUAL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-between p-5 rounded-lg bg-brand-950 text-white shadow-xl hover:shadow-brand-950/20 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-uncp-gold group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <MonitorPlay className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-300 block mb-0.5">Acceso Seguro</span>
                    <span className="text-base font-bold">Aula Virtual</span>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-brand-500 group-hover:text-white transition-colors" />
              </a>

              {/* Botones de Redes Sociales Compactos */}
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href={EXTERNAL_LINKS.FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border-2 border-border-subtle hover:border-brand-100 hover:bg-brand-50 transition-all group"
                >
                  <div className="h-10 w-10 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all">
                    <Facebook className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-brand-950">Facebook</span>
                </a>
                <a 
                  href={EXTERNAL_LINKS.YOUTUBE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border-2 border-border-subtle hover:border-red-100 hover:bg-red-50 transition-all group"
                >
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Youtube className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-brand-950">YouTube</span>
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-border-subtle">
               <div className="flex items-center gap-3 text-muted-foreground">
                  <MessageSquare className="h-5 w-5 text-uncp-gold" />
                  <p className="text-xs font-medium">Soporte técnico vía <a href="https://wa.me/51949260658" target="_blank" rel="noopener noreferrer" className="text-brand-600 font-bold hover:underline">WhatsApp</a></p>
               </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: ÚLTIMOS VIDEOS DE YOUTUBE (8 COLUMNAS) */}
          <div className="lg:col-span-8 w-full">
            <div className="mb-4 flex items-center justify-between gap-4 px-1">
              <div className="flex items-center gap-2 text-text-tertiary">
                <Youtube className="h-3 w-3" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">YouTube Reciente</span>
              </div>
              <a
                href={EXTERNAL_LINKS.YOUTUBE}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors"
              >
                Ver canal <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            {videos.length > 0 ? (
              <YoutubeThumbs videos={videos} />
            ) : (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border-subtle bg-brand-950">
                <iframe
                  src="https://www.youtube.com/embed/videoseries?list=UUFhOPsvkFgLYA1sOGl9kmyQ"
                  title="Videos recientes de YouTube"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
