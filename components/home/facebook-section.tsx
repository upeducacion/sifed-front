"use client";

import { Facebook, Users, Calendar, MessageCircle } from "lucide-react";

export default function FacebookSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Patrón decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231877F2' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-1 w-12 bg-[#1877F2] rounded-full"></div>
            <span className="text-xs font-black uppercase tracking-widest text-[#1877F2]">
              Síguenos en redes
            </span>
            <div className="h-1 w-12 bg-[#1877F2] rounded-full"></div>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-950 mb-4">
            Mantente Conectado
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Entérate de nuestras convocatorias, eventos académicos y las últimas actualizaciones de la Unidad de Posgrado
          </p>
        </div>

        {/* Grid principal */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          
          {/* Stats cards - 2 columnas */}
          <div className="lg:col-span-2 space-y-6">
            {/* CTA Principal */}
            <div className="bg-gradient-to-br from-[#1877F2] to-[#0c5fcd] rounded-[2.5rem] p-8 text-white shadow-2xl">
              <Facebook className="h-12 w-12 mb-4 opacity-90" />
              <h3 className="font-serif text-2xl font-bold mb-3" style={{ color: '#E7F3FF' }}>
                Unidad de Posgrado
              </h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                Únete a nuestra comunidad en Facebook y mantente informado sobre convocatorias, eventos y novedades académicas.
              </p>
              <a
                href="https://www.facebook.com/UPG.UNCP.Educacion"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#1877F2] rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Facebook className="h-5 w-5" />
                Seguir en Facebook
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#1877F2] hover:shadow-lg transition-all">
                <Users className="h-8 w-8 text-[#1877F2] mb-3" />
                <div className="text-2xl font-black text-brand-950 mb-1">900+</div>
                <div className="text-xs text-muted-foreground font-medium">Seguidores activos</div>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#1877F2] hover:shadow-lg transition-all">
                <MessageCircle className="h-8 w-8 text-[#1877F2] mb-3" />
                <div className="text-2xl font-black text-brand-950 mb-1">Diario</div>
                <div className="text-xs text-muted-foreground font-medium">Actualizaciones</div>
              </div>
            </div>

            {/* Info adicional */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
              <div className="flex items-start gap-3 mb-4">
                <Calendar className="h-5 w-5 text-uncp-gold shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-brand-950 mb-1 text-sm">Publicamos contenido sobre:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Convocatorias de admisión</li>
                    <li>• Eventos académicos y webinars</li>
                    <li>• Investigaciones y publicaciones</li>
                    <li>• Logros de nuestros egresados</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Facebook Page Plugin - 3 columnas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2.5rem] p-6 border-2 border-gray-200 shadow-xl">
              <div className="relative w-full" style={{ minHeight: '600px' }}>
                <iframe 
                  src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FUPG.UNCP.Educacion&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
                  width="100%"
                  height="600"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="rounded-2xl"
                ></iframe>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            También puedes contactarnos directamente:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:UPGEDUCACION@UNCP.EDU.PE"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold text-sm hover:bg-brand-700 transition-all hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              UPGEDUCACION@UNCP.EDU.PE
            </a>
            <a
              href="https://wa.me/51949260658"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp: 949 260 658
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
