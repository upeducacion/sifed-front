"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Info, BookOpen, Clock, Wallet, Settings, Save, X, Megaphone, Users, LayoutTemplate, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { programasApi } from "@/lib/api/programas";
import TabSelector from "@/components/ui/tab-selector";
import { BackButton } from "@/components/ui/back-button";

import { InfoGeneralTab } from "@/components/modules/admin/programas/info-general-tab";
import { MarketingTab } from "@/components/modules/admin/programas/marketing-tab";
import { HeroContenidoTab } from "@/components/modules/admin/programas/hero-contenido-tab";
import { AcercaDeTab } from "@/components/modules/admin/programas/acerca-de-tab";
import { PlanEstudioTab } from "@/components/modules/admin/programas/plan-estudio-tab";
import { HorariosTab } from "@/components/modules/admin/programas/horarios-tab";
import { AdmisionTab } from "@/components/modules/admin/programas/admision-tab";
import { ConfigTab } from "@/components/modules/admin/programas/config-tab";
import { PerfilesTab } from "@/components/modules/admin/programas/perfiles-tab";
import { ProgramaAdminFormData } from "@/types/admin-programa";
import { Ciclo } from "@/types/curriculum";

export default function NuevoProgramaPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // Estado unificado
  const defaultFormData: ProgramaAdminFormData = {
    titulo: "",
    tipo: "maestria",
    descripcion_corta: "",
    estado: "borrador",
    orden: 0,
    detalles_json: {
      categoria: "",
      hero_pre_title: "",
      hero_titulo: "",
      hero_subtitle: "",
      hero_descripcion: "",
      contenido_pre_title: "",
      contenido_titulo: "",
      info_general: { duracion: "", modalidad: "", certificacion: "", totalCreditos: 0 },
      acerca_de: "",
      objetivos: [],
      perfil_estudiante: [],
      perfil_egresado: [],
      certificacion_detalle: "",
      admision: { costo_inscripcion: "", matricula: "", pension: "", costo_adicional: "", requisitos: [] }
    },
    plan_estudio_json: { nota_general: "", ciclos: [] },
    horarios_json: [],
    config_visibilidad: {
      mostrar_en_hero: false,
      mostrar_admision: true,
      mostrar_plan_estudio: true,
      mostrar_horarios: false,
      mostrar_perfiles: true,
      mostrar_certificacion: true
    }
  };

  const [formData, setFormData] = useState<ProgramaAdminFormData>(defaultFormData);
  const [initialDataHash] = useState<string>(JSON.stringify(defaultFormData));
  const [isDirty, setIsDirty] = useState(false);

  const [fotoPortadaFile, setFotoPortadaFile] = useState<File | null>(null);
  const [fotoPortadaPreview, setFotoPortadaPreview] = useState<string | null>(null);

  const [fotoHeroFile, setFotoHeroFile] = useState<File | null>(null);
  const [fotoHeroPreview, setFotoHeroPreview] = useState<string | null>(null);

  useEffect(() => {
    const ciclos = formData.plan_estudio_json?.ciclos || [];
    const total = ciclos.reduce((sum: number, c: Ciclo) => sum + (Number(c.totalCreditos) || 0), 0);
    const duracion = `${ciclos.length} Semestre${ciclos.length !== 1 ? 's' : ''}`;

    if (
      formData.detalles_json.info_general?.totalCreditos !== total ||
      formData.detalles_json.info_general?.duracion !== duracion
    ) {
      setFormData((prev: ProgramaAdminFormData) => ({
        ...prev,
        detalles_json: {
          ...prev.detalles_json,
          info_general: {
            ...prev.detalles_json.info_general,
            duracion,
            totalCreditos: total
          }
        }
      }));
    }
  }, [formData.plan_estudio_json?.ciclos, formData.detalles_json.info_general?.totalCreditos, formData.detalles_json.info_general?.duracion]);
  // Detector de cambios
  useEffect(() => {
    const currentDataHash = JSON.stringify(formData);
    setIsDirty(
      currentDataHash !== initialDataHash ||
      fotoPortadaFile !== null ||
      fotoHeroFile !== null
    );
  }, [formData, initialDataHash, fotoPortadaFile, fotoHeroFile]);

  // Alerta al intentar salir sin guardar
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const TABS = [
    { id: "info", label: "Información", icon: <Info className="w-4 h-4" /> },
    { id: "marketing", label: "Hero Global", icon: <Megaphone className="w-4 h-4" /> },
    { id: "hero-contenido", label: "Hero Contenido", icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: "acerca-de", label: "Acerca del Programa", icon: <FileText className="w-4 h-4" /> },
    { id: "perfiles", label: "Perfiles", icon: <Users className="w-4 h-4" /> },
    { id: "plan", label: "Plan de Estudio", icon: <BookOpen className="w-4 h-4" /> },
    { id: "horarios", label: "Horarios", icon: <Clock className="w-4 h-4" /> },
    { id: "admision", label: "Admisión", icon: <Wallet className="w-4 h-4" /> },
    { id: "config", label: "Visibilidad", icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fd = new FormData();
      formData.estado = formData.config_visibilidad.mostrar_en_hero ? "activo" : formData.estado;
      
      fd.append("titulo", formData.titulo);
      fd.append("tipo", formData.tipo);
      fd.append("descripcion_corta", formData.descripcion_corta);
      fd.append("estado", formData.estado);
      fd.append("orden", String(formData.orden));
      
      fd.append("detalles_json", JSON.stringify(formData.detalles_json));
      fd.append("plan_estudio_json", JSON.stringify(formData.plan_estudio_json));
      fd.append("horarios_json", JSON.stringify(formData.horarios_json));
      fd.append("config_visibilidad", JSON.stringify(formData.config_visibilidad));

      if (fotoPortadaFile) fd.append("imagen_portada", fotoPortadaFile);
      if (fotoHeroFile) fd.append("hero_imagen", fotoHeroFile);

      await programasApi.create(fd);
      showToast("Programa creado exitosamente", "success");
      router.push("/admin/portal/programas");
    } catch (error) {
      console.error(error);
      showToast("Error al crear el programa", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl mx-auto pb-24">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h2 className="text-2xl font-serif font-black text-brand-950 flex items-center gap-2">
              Nuevo Programa
              {isDirty && <span className="text-brand-500 text-sm font-bold bg-brand-50 px-2 py-0.5 rounded-full ml-2">Modificado *</span>}
            </h2>
            <p className="text-sm text-muted-foreground">Configuración completa del programa académico</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            className="px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-sm"
          >
            <option value="borrador">Borrador</option>
            <option value="activo">Publicado (Activo)</option>
            <option value="inactivo">Oculto (Inactivo)</option>
          </select>

          <button
            type="button"
            onClick={() => {
              if (isDirty && !confirm("Tienes cambios sin guardar. ¿Estás seguro que quieres salir?")) return;
              router.push("/admin/portal/programas");
            }}
            className="p-2.5 text-muted-foreground hover:bg-muted rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Guardando..." : "Guardar Programa"}
          </button>
        </div>
      </div>

      {/* NAVEGACIÓN DE TABS */}
      <div className="mb-8">
        <TabSelector 
          options={TABS} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
      </div>

      {/* CONTENIDO DE TABS */}
      <div className="min-h-[500px]">
        {activeTab === "info" && (
          <InfoGeneralTab 
            formData={formData} setFormData={setFormData}
          />
        )}

        {activeTab === "marketing" && (
          <MarketingTab 
            formData={formData} setFormData={setFormData}
            setFotoHeroFile={setFotoHeroFile}
            fotoHeroPreview={fotoHeroPreview} setFotoHeroPreview={setFotoHeroPreview}
          />
        )}

        {activeTab === "hero-contenido" && (
          <HeroContenidoTab 
            formData={formData} setFormData={setFormData}
            fotoPortadaFile={fotoPortadaFile} setFotoPortadaFile={setFotoPortadaFile}
            fotoPortadaPreview={fotoPortadaPreview} setFotoPortadaPreview={setFotoPortadaPreview}
          />
        )}

        {activeTab === "acerca-de" && (
          <AcercaDeTab 
            formData={formData} setFormData={setFormData}
          />
        )}

        {activeTab === "perfiles" && (
          <PerfilesTab formData={formData} setFormData={setFormData} />
        )}

        {activeTab === "plan" && (
          <PlanEstudioTab 
            planData={formData.plan_estudio_json} 
            setPlanData={(data) => setFormData({ ...formData, plan_estudio_json: data })} 
          />
        )}

        {activeTab === "horarios" && (
          <HorariosTab 
            horariosData={formData.horarios_json} 
            setHorariosData={(data) => setFormData({ ...formData, horarios_json: data })} 
          />
        )}

        {activeTab === "admision" && (
          <AdmisionTab 
            admisionData={formData.detalles_json.admision} 
            setAdmisionData={(data) => setFormData({ 
              ...formData, 
              detalles_json: { ...formData.detalles_json, admision: data } 
            })} 
          />
        )}

        {activeTab === "config" && (
          <ConfigTab 
            configData={formData.config_visibilidad} 
            setConfigData={(data) => setFormData({ ...formData, config_visibilidad: data })} 
          />
        )}
      </div>

    </form>
  );
}
