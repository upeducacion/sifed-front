"use client";

import { Facebook, Youtube, MonitorPlay, ArrowUpRight, MessageSquare } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/constants";

export default function SocialHubSection() {
  return (
    <section className="w-full bg-white py-16 px-6 lg:px-12 border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto">
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
                className="group relative flex items-center justify-between p-5 rounded-2xl bg-brand-950 text-white shadow-xl hover:shadow-brand-950/20 transition-all hover:-translate-y-1"
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
                  className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-blue-100 hover:bg-blue-50 transition-all group"
                >
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Facebook className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-brand-950">Facebook</span>
                </a>
                <a 
                  href={EXTERNAL_LINKS.YOUTUBE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-red-100 hover:bg-red-50 transition-all group"
                >
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Youtube className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-brand-950">YouTube</span>
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
               <div className="flex items-center gap-3 text-muted-foreground">
                  <MessageSquare className="h-5 w-5 text-uncp-gold" />
                  <p className="text-xs font-medium">Soporte técnico vía <a href="https://wa.me/51949260658" target="_blank" rel="noopener noreferrer" className="text-brand-600 font-bold hover:underline">WhatsApp</a></p>
               </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: VISUALIZACIÓN DUAL (8 COLUMNAS) */}
          <div className="lg:col-span-8 h-full w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full w-full">
              
              {/* FACEBOOK FEED VERTICAL */}
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center gap-2 px-1 text-slate-400">
                  <Facebook className="h-3 w-3" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Facebook Feed</span>
                </div>
                <div className="relative w-full h-[600px] rounded-[2rem] border-4 border-slate-50 shadow-2xl bg-white">
                  <iframe 
                    src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FUPG.UNCP.Educacion&tabs=timeline&width=500&height=600&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId"
                    width="100%"
                    height="100%"
                    style={{ border: 'none', overflow: 'hidden' }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    className="rounded-[1.8rem]"
                  ></iframe>
                </div>
              </div>

              {/* YOUTUBE: ÚLTIMO CONTENIDO */}
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center gap-2 px-1 text-slate-400">
                  <Youtube className="h-3 w-3" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">YouTube Reciente</span>
                </div>
                <div className="relative w-full h-[600px] rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-2xl bg-slate-900">
                  <iframe 
                    src="https://www.youtube.com/embed/videoseries?list=UUFhOPsvkFgLYA1sOGl9kmyQ"
                    title="YouTube Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
