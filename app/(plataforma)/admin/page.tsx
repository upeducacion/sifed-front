"use client";

import { useState } from "react";
import useSWR from "swr";
import { 
  Users, BookOpen, FileText, ImageIcon, GraduationCap, 
  Settings, Loader2, ArrowRight, Activity, CalendarDays,
  Smartphone, Award
} from "lucide-react";
import Link from "next/link";
import TabSelector from "@/components/ui/tab-selector";

// APIs
import { programasApi, Programa } from "@/lib/api/programas";
import { docentesApi, Docente } from "@/lib/api/docentes";
import { documentosApi } from "@/lib/api/documentos";
import { galeriasApi } from "@/lib/api/galerias";
import { unidadPosgradoApi } from "@/lib/api/unidad-posgrado";

// Util
import { cn } from "@/lib/utils";

const dashboardFetcher = async () => {
  const [
    resProgramas, 
    resDocentes, 
    resDocs, 
    resGalerias,
    resUnidad
  ] = await Promise.all([
    programasApi.getAll({ per_page: 5 }),
    docentesApi.getAll({ per_page: 5 }),
    documentosApi.getAll({ per_page: 1 }),
    galeriasApi.getAll({ per_page: 1 }),
    unidadPosgradoApi.getAdmin()
  ]);

  return {
    stats: {
      programas: resProgramas?.meta?.total || resProgramas?.total || resProgramas?.data?.length || 0,
      docentes: resDocentes?.meta?.total || resDocentes?.total || resDocentes?.data?.length || 0,
      documentos: resDocs?.meta?.total || resDocs?.total || resDocs?.data?.length || 0,
      galerias: resGalerias?.total || resGalerias?.data?.length || 0,
    },
    recentProgramas: (resProgramas?.data || resProgramas || []) as Programa[],
    recentDocentes: (resDocentes?.data || resDocentes || []) as Docente[],
    unidad: {
      periodo_actual: resUnidad?.admision_json?.periodo_actual || "No definido",
      whatsapp: resUnidad?.admision_json?.whatsapp_contacto || "No definido",
      mision_establecida: !!resUnidad?.mision && resUnidad.mision.length > 10,
    }
  };
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("general");
  
  const { data, error, isLoading, mutate } = useSWR(
    '/api/admin/dashboard-stats', 
    dashboardFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const tabOptions = [
    { id: "general", label: "Visión General", icon: <Activity className="w-4 h-4" /> },
    { id: "portal", label: "Actividad del Portal", icon: <FileText className="w-4 h-4" /> },
  ];

  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-brand-100"></div>
          <Loader2 className="h-8 w-8 text-brand-600 animate-spin z-10" />
        </div>
        <p className="text-sm font-bold text-brand-900 animate-pulse">Consolidando información...</p>
      </div>
    );
  }

  if (error) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-red-500">
           <p>Error al cargar el dashboard.</p>
           <button onClick={() => mutate()} className="underline font-bold">Intentar nuevamente</button>
        </div>
     );
  }

  const { stats, recentProgramas, recentDocentes, unidad } = data || {
     stats: { programas: 0, docentes: 0, documentos: 0, galerias: 0 },
     recentProgramas: [],
     recentDocentes: [],
     unidad: { periodo_actual: "", whatsapp: "", mision_establecida: false }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <TabSelector 
        options={tabOptions} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {/* Contenido Dinámico según el Tab */}
      {activeTab === "general" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Tarjetas de Estadísticas Estelares (KPIs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard 
              title="Programas" 
              value={stats.programas} 
              icon={<GraduationCap className="w-6 h-6 text-indigo-600" />} 
              bgIcon="bg-indigo-50"
              link="/admin/portal/programas"
            />
            <StatCard 
              title="Docentes" 
              value={stats.docentes} 
              icon={<Users className="w-6 h-6 text-emerald-600" />} 
              bgIcon="bg-emerald-50"
              link="/admin/portal/docentes"
            />
            <StatCard 
              title="Documentos" 
              value={stats.documentos} 
              icon={<FileText className="w-6 h-6 text-amber-600" />} 
              bgIcon="bg-amber-50"
              link="/admin/portal/documentos-normativos"
            />
            <StatCard 
              title="Galerías" 
              value={stats.galerias} 
              icon={<ImageIcon className="w-6 h-6 text-rose-600" />} 
              bgIcon="bg-rose-50"
              link="/admin/portal/galerias"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Estado de Admisión (A la izquierda, más relevante) */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-border shadow-sm p-8 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                <BookOpen className="w-48 h-48" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-6">Estado de la Unidad</h3>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-brand-600 font-bold mb-1">
                    <CalendarDays className="w-5 h-5" />
                    Periodo Académico
                  </div>
                  <p className="text-3xl font-black text-brand-950">{unidad.periodo_actual}</p>
                  <p className="text-xs text-muted-foreground font-medium">Visible en los formularios de inscripción.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-bold text-brand-900">WhatsApp Soporte</span>
                    </div>
                    <span className="text-xs font-black bg-white px-2 py-1 rounded-md shadow-sm border border-border">
                      {unidad.whatsapp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border/50">
                    <div className="flex items-center gap-3">
                      <Award className={cn("w-5 h-5", unidad.mision_establecida ? "text-brand-500" : "text-red-500")} />
                      <span className="text-sm font-bold text-brand-900">Identidad Institucional</span>
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-1 rounded-md",
                      unidad.mision_establecida ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                      {unidad.mision_establecida ? "Configurado" : "Pendiente"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Configura estos datos en el módulo de la Unidad.</p>
                <Link href="/admin/portal/unidad" className="text-sm font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 transition-colors">
                  Ir a Configuración <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Accesos Rápidos */}
            <div className="bg-brand-950 rounded-3xl p-6 shadow-xl text-white flex flex-col">
              <h3 className="text-sm font-black uppercase tracking-widest text-brand-300 mb-6">Accesos Rápidos</h3>
              <div className="flex flex-col gap-3 flex-grow">
                <QuickActionLink 
                  href="/admin/portal/programas/nuevo" 
                  icon={<GraduationCap className="w-5 h-5" />} 
                  title="Nuevo Programa" 
                  desc="Añadir maestría o doctorado"
                />
                <QuickActionLink 
                  href="/admin/portal/docentes/nuevo" 
                  icon={<Users className="w-5 h-5" />} 
                  title="Registrar Docente" 
                  desc="Agregar a la plana docente"
                />
                <QuickActionLink 
                  href="/admin/portal/documentos-normativos" 
                  icon={<FileText className="w-5 h-5" />} 
                  title="Subir Resolución" 
                  desc="Nuevo documento normativo"
                />
                <QuickActionLink 
                  href="/admin/configuracion" 
                  icon={<Settings className="w-5 h-5" />} 
                  title="Mi Perfil" 
                  desc="Ajustar datos personales"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "portal" && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Últimos Programas */}
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
              <h3 className="font-bold text-brand-950 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-500" />
                Programas Recientes
              </h3>
              <Link href="/admin/portal/programas" className="text-xs font-bold text-brand-600 hover:underline">Ver Todos</Link>
            </div>
            <div className="p-4 flex-grow">
              {recentProgramas.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground py-10">No hay programas registrados.</div>
              ) : (
                <ul className="space-y-3">
                  {recentProgramas.map((prog: Programa) => (
                    <li key={prog.id} className="flex items-center gap-4 p-3 hover:bg-brand-50/50 rounded-xl transition-colors border border-transparent hover:border-brand-100 group">
                      <div className="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center shrink-0 border border-brand-200">
                        {prog.tipo === 'maestria' ? <BookOpen className="w-5 h-5 text-brand-600" /> : <Award className="w-5 h-5 text-brand-600" />}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-bold text-brand-950 truncate">{prog.titulo}</p>
                        <p className="text-xs font-medium text-muted-foreground capitalize">{prog.tipo}</p>
                      </div>
                      <Link 
                        href={`/admin/portal/programas/${prog.id}/edit`}
                        className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-50 hover:text-brand-700"
                      >
                        Editar
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Últimos Docentes */}
          <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/10">
              <h3 className="font-bold text-brand-950 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                Docentes Incorporados
              </h3>
              <Link href="/admin/portal/docentes" className="text-xs font-bold text-emerald-600 hover:underline">Directorio</Link>
            </div>
            <div className="p-4 flex-grow">
              {recentDocentes.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground py-10">No hay docentes registrados.</div>
              ) : (
                <ul className="space-y-3">
                  {recentDocentes.map((doc: Docente) => (
                    <li key={doc.id} className="flex items-center gap-4 p-3 hover:bg-emerald-50/30 rounded-xl transition-colors border border-transparent hover:border-emerald-100 group">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200 overflow-hidden">
                        {doc.foto_url ? (
                           // eslint-disable-next-line @next/next/no-img-element
                           <img src={doc.foto_url} alt={doc.nombre_completo} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-emerald-700 font-bold text-xs">{doc.nombre_completo.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-bold text-brand-950 truncate">{doc.nombre_completo}</p>
                        <p className="text-xs font-medium text-muted-foreground truncate">{doc.especialidad || doc.categoria}</p>
                      </div>
                      <span className={cn(
                        "text-[10px] font-black uppercase px-2 py-1 rounded-md shrink-0",
                        doc.estado === 'activo' ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                      )}>
                        {doc.estado}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponentes del Dashboard

function StatCard({ title, value, icon, bgIcon, link }: { title: string, value: number, icon: React.ReactNode, bgIcon: string, link: string }) {
  return (
    <Link href={link} className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-4 hover:shadow-md hover:-translate-y-1 transition-all group">
      <div className="flex items-start justify-between">
        <div className={cn("p-3 rounded-2xl", bgIcon)}>
          {icon}
        </div>
        <div className="p-1.5 bg-muted/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="w-4 h-4 text-brand-400" />
        </div>
      </div>
      <div>
        <h4 className="text-3xl font-black text-brand-950 mb-1">{value}</h4>
        <p className="text-sm font-bold text-muted-foreground">{title}</p>
      </div>
    </Link>
  );
}

function QuickActionLink({ href, icon, title, desc }: { href: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-4 p-4 rounded-2xl bg-brand-900/50 border border-brand-800/50 hover:bg-brand-800 hover:border-brand-600 transition-all group"
    >
      <div className="p-2 bg-brand-800 rounded-xl text-brand-300 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-grow">
        <p className="text-sm font-bold text-white mb-0.5">{title}</p>
        <p className="text-xs text-brand-300/80 font-medium">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-brand-600 group-hover:text-brand-300 transition-colors" />
    </Link>
  );
}