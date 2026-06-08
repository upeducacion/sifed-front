import { Metadata } from "next";
import { UnoptImage } from "@/components/ui/unopt-image";
import { unidadPosgradoApi, UnidadPosgrado, Autoridad } from "@/lib/api/unidad-posgrado";
import PageHero from "@/components/ui/page-hero";
import { Target, Flag, Phone, Mail, FileText, Building2 } from "lucide-react";
import { getStorageUrl } from "@/lib/utils";
import SmartProfileImage from "@/components/ui/smart-profile-image";



export const metadata: Metadata = {
  title: "Unidad de Posgrado | UP Educación",
  description: "Conoce nuestra historia, misión, visión y a las autoridades que lideran la Unidad de Posgrado de la Facultad de Educación de la UNCP.",
};

export default async function NosotrosPage() {
  let unidad: UnidadPosgrado | null = null;

  try {
    unidad = await unidadPosgradoApi.getPublic();
  } catch (error) {
    console.error("Error fetching Unidad de Posgrado data:", error);
  }

  // Fallback data
  const historia = unidad?.historia || "Cargando historia...";
  const mision = unidad?.mision || "Cargando misión...";
  const vision = unidad?.vision || "Cargando visión...";
  
  const config = unidad?.config_visibilidad;
  const showMision = config?.mostrar_mision !== false;
  const showVision = config?.mostrar_vision !== false;
  const showAutoridades = config?.mostrar_autoridades !== false;
  const showDirectorio = config?.mostrar_directorio !== false;
  const showOrganigrama = config?.mostrar_organigrama !== false;

  const autoridades = unidad?.autoridades_json || [];
  const directorio = unidad?.directorio_json || [];

  return (
    <main className="flex-1 w-full bg-slate-50/50 pb-24">
      <PageHero
        title="UNIDAD DE POSGRADO"
        subtitle="SOBRE LA"
        description="Excelencia académica e investigación científica al servicio del desarrollo educativo regional y nacional."
        imageSrc="/images/fondouncp1920x1080.webp"
        align="center"
        size="compact"
        breadcrumbs={[
          { label: "Posgrado", href: "/posgrado" },
          { label: "Nosotros" }
        ]}
      />

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* COLUMNA PRINCIPAL (HISTORIA Y AUTORIDADES) */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Módulo: Historia */}
            <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-brand-100 shadow-xl shadow-brand-900/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                <Building2 className="h-64 w-64 text-brand-950" />
              </div>
              <div className="relative z-10">
                <div className="mb-10 text-center md:text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-uncp-gold mb-3 block">Nuestra Trayectoria</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-950">Historia de Excelencia</h2>
                  <div className="mt-6 h-1 w-12 bg-uncp-gold rounded-full mx-auto md:mx-0" />
                </div>
                
                <div className="prose prose-brand max-w-none text-muted-foreground leading-relaxed font-medium text-justify">
                  {historia.split('\n').map((paragraph, idx) => (
                    paragraph.trim() ? (
                      <p key={idx} className="mb-6 last:mb-0">
                        {paragraph}
                      </p>
                    ) : null
                  ))}
                </div>
              </div>
            </section>

            {/* Módulo: Autoridades */}
            {showAutoridades && autoridades.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-4 px-4">
                  <div className="h-px flex-1 bg-brand-100" />
                  <h2 className="text-2xl font-serif font-black text-brand-950 whitespace-nowrap uppercase tracking-tighter">Liderazgo</h2>
                  <div className="h-px flex-1 bg-brand-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {autoridades.map((aut) => (
                    <AuthorityCard key={aut.id} autoridad={aut} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* COLUMNA LATERAL - STICKY */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            
            {/* Tarjeta: Misión & Visión (CON CONTRASTE MEJORADO) */}
            {(showMision || showVision) && (
              <div className="bg-brand-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group border border-brand-800">
                <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <Building2 className="h-48 w-48" />
                </div>
                
                <div className="space-y-10 relative z-10">
                  {showMision && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-uncp-gold">
                          <Target className="h-5 w-5" strokeWidth={2.5} />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-uncp-gold">Misión</h3>
                      </div>
                      <p className="text-white text-sm leading-relaxed font-medium">
                        {mision}
                      </p>
                    </div>
                  )}

                  {showVision && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-uncp-gold">
                          <Flag className="h-5 w-5" strokeWidth={2.5} />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-uncp-gold">Visión</h3>
                      </div>
                      <p className="text-white text-sm leading-relaxed font-medium">
                        {vision}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tarjeta: Organigrama */}
            {unidad?.organigrama_url && showOrganigrama && (
              <div className="bg-white rounded-[2rem] p-6 border border-brand-100 shadow-sm group">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-950 mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-uncp-gold" />
                  Estructura Organizativa
                </h3>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-brand-50 mb-2">
                  <UnoptImage 
                    src={getStorageUrl(unidad.organigrama_url)} 
                    alt="Organigrama" 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-brand-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="bg-white text-brand-950 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">Ver Organigrama</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tarjeta: Directorio Compacto */}
            {showDirectorio && directorio.length > 0 && (
              <div className="bg-white rounded-[2rem] p-8 border border-brand-100 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-950 mb-6 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-uncp-gold" />
                  Directorio Telefónico
                </h3>
                <div className="space-y-4">
                  {directorio.map((item) => (
                    <div key={item.id} className="group pb-4 border-b border-brand-50 last:border-0 last:pb-0">
                      <p className="text-[9px] font-black text-brand-950 uppercase mb-1 group-hover:text-brand-600 transition-colors">{item.area}</p>
                      <div className="flex flex-col gap-1">
                        {item.telefono && (
                          <span className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                            <Phone className="h-3 w-3 text-brand-200" /> {item.telefono} {item.anexo && <span className="text-brand-600 font-black">(Anexo {item.anexo})</span>}
                          </span>
                        )}
                        {item.email && (
                          <span className="text-xs text-muted-foreground flex items-center gap-2 font-medium">
                            <Mail className="h-3 w-3 text-brand-200" /> {item.email}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </aside>
        </div>
      </div>
    </main>
  );
}

function AuthorityCard({ autoridad }: { autoridad: Autoridad }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-brand-100 hover:border-uncp-gold/30 transition-all hover:shadow-xl group">
      <div className="flex items-center gap-5">
        <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border-2 border-brand-50 group-hover:scale-105 transition-transform duration-500 shadow-sm">
          <SmartProfileImage src={autoridad.foto_url} alt={autoridad.nombre} />
        </div>
        <div className="min-w-0">
          <span className="inline-block bg-brand-50 text-brand-700 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md mb-1.5">
            {autoridad.cargo}
          </span>
          <h3 className="font-serif text-lg font-black text-brand-950 leading-tight group-hover:text-brand-600 transition-colors truncate">
            {autoridad.nombre}
          </h3>
        </div>
      </div>
      {autoridad.resumen && (
        <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed line-clamp-3 italic font-medium border-t border-brand-50 pt-4">
          &quot;{autoridad.resumen}&quot;
        </p>
      )}
    </div>
  );
}
