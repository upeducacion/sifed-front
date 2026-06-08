import Link from "next/link";
import { FileText, Bell, ArrowRight, TrendingUp } from "lucide-react";

export default function InfoSection() {
  return (
    <section className="w-auto bg-brand-50/30 min-h-screen flex items-center py-24 px-6 lg:px-12 border-b border-border overflow-hidden">
       <div className="max-w-7xl mx-auto w-full flex flex-col justify-center">
          
          <div className="mb-12 text-center md:text-left">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-uncp-gold mb-2 block">Impacto Institucional</span>
             <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-950 leading-tight">Cifras y Gestión</h2>
             <p className="text-base text-muted-foreground font-medium mt-3">Transparencia y resultados de nuestra labor académica.</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8 md:gap-10">
            {/* Bloque: Estadísticas */}
            <div className="lg:col-span-1 bg-brand-50 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] flex flex-col justify-center border border-border">
               <div className="space-y-8 md:space-y-12">
                  <div className="group">
                      <div className="text-5xl md:text-6xl font-serif font-black text-brand-950 transition-transform group-hover:scale-105 duration-300">1k+</div>
                      <div className="text-xs md:text-sm font-bold text-muted-foreground mt-2 uppercase tracking-wide text-balance">Usuarios Activos</div>
                  </div>
                  <div className="group">
                      <div className="text-4xl md:text-5xl font-serif font-black text-brand-600 transition-transform group-hover:scale-105 duration-300 leading-tight">Plana Docente</div>
                      <div className="text-xs md:text-sm font-bold text-muted-foreground mt-2 uppercase tracking-wide text-balance">Altamente Calificada</div>
                  </div>
                  <div className="group">
                      <div className="text-5xl md:text-6xl font-serif font-black text-brand-950 transition-transform group-hover:scale-105 duration-300">05</div>
                      <div className="text-xs md:text-sm font-bold text-muted-foreground mt-2 uppercase tracking-wide text-balance">Programas de Posgrado</div>
                  </div>
               </div>
            </div>

            {/* Bloque: Noticias (Grid 2x1) */}
            <div className="lg:col-span-2 grid gap-6 md:gap-8">
               <Link href="/posgrado/admision" className="bg-background p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl transition-all flex flex-col justify-center relative overflow-hidden group cursor-pointer hover:border-brand-200">
                  <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-brand-50 rounded-bl-full -mr-12 -mt-12 md:-mr-16 md:-mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                  <span className="relative z-10 flex items-center gap-2 text-[10px] md:text-xs font-black text-uncp-gold uppercase tracking-widest mb-4">
                      <Bell className="h-3 w-3 md:h-4 md:w-4" /> Informativo
                  </span>
                  <h3 className="relative z-10 text-2xl md:text-3xl font-bold text-brand-950 mb-4 group-hover:text-brand-600 transition-colors leading-tight">Proceso de Admisión y Matrícula</h3>
                  <p className="relative z-10 text-base md:text-lg text-muted-foreground line-clamp-2 leading-relaxed">Conoce los requisitos, cronogramas y guías necesarias para tu ingreso al posgrado.</p>
                  <div className="relative z-10 mt-6 text-xs md:text-sm font-black text-brand-600 flex items-center gap-2">VER INFORMACIÓN <ArrowRight className="h-4 w-4 md:h-5 md:w-5" /></div>
               </Link>
               
               <Link href="/galeria-fotos/investigacion" className="bg-background p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl transition-all flex flex-col justify-center relative overflow-hidden group cursor-pointer hover:border-brand-200">
                  <span className="relative z-10 flex items-center gap-2 text-[10px] md:text-xs font-black text-brand-600 uppercase tracking-widest mb-4">
                      <TrendingUp className="h-3 w-3 md:h-4 md:w-4" /> Investigación
                  </span>
                  <h3 className="relative z-10 text-2xl md:text-3xl font-bold text-brand-950 mb-4 group-hover:text-brand-600 transition-colors leading-tight">Proyectos y Tesis de Posgrado</h3>
                  <p className="relative z-10 text-base md:text-lg text-muted-foreground line-clamp-2 leading-relaxed">Explora la producción científica y convocatorias de investigación de nuestra unidad.</p>
                  <div className="relative z-10 mt-6 text-xs md:text-sm font-black text-brand-600 flex items-center gap-2">EXPLORAR <ArrowRight className="h-4 w-4 md:h-5 md:w-5" /></div>
               </Link>
            </div>

            {/* Bloque: Trámites */}
            <div className="lg:col-span-1 bg-brand-950 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-brand-800 to-brand-950"></div>
               <div className="relative z-10">
                  <h3 className="font-serif text-xl md:text-2xl font-bold mb-6 md:mb-8 flex items-center gap-3 text-uncp-gold">
                      <FileText className="h-6 w-6 md:h-7 md:w-7" />
                      Trámites
                  </h3>
                  <ul className="space-y-3 md:space-y-4">
                      {['Constancia de Egresado', 'Record Académico', 'Reserva de Matrícula', 'Mesa de Partes'].map(link => (
                          <li key={link}>
                              <div className="w-full text-left py-3 md:py-3.5 px-4 md:px-5 rounded-2xl bg-white/5 border border-white/5 transition-all text-xs md:text-sm font-bold tracking-tight">
                                  {link}
                              </div>
                          </li>
                      ))}
                  </ul>
               </div>
               <div className="relative z-10 mt-8 md:mt-10 pt-8 border-t border-white/10 text-center">
                  <Link href="/documentos-normativos" className="text-xs md:text-sm font-black text-uncp-gold hover:text-uncp-gold/80 flex items-center justify-center gap-2 w-full uppercase tracking-widest">
                    Ver todos <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                  </Link>
               </div>
            </div>
          </div>

       </div>
    </section>
  );
}
