"use client";

import { Settings, Eye, EyeOff } from "lucide-react";
import { ProgramaConfigVisibilidad } from "@/types/admin-programa";

interface ConfigTabProps {
  configData: ProgramaConfigVisibilidad;
  setConfigData: (data: ProgramaConfigVisibilidad) => void;
}

export function ConfigTab({ configData, setConfigData }: ConfigTabProps) {

  const toggleField = (field: keyof ProgramaConfigVisibilidad) => {
    setConfigData({
      ...configData,
      [field]: !configData[field]
    });
  };

  const configItems = [
    { 
      id: 'mostrar_en_hero', 
      label: 'Hero del Home', 
      desc: 'Si se activa, el programa aparecerá en el carrusel de la página principal.' 
    },
    { 
      id: 'mostrar_admision', 
      label: 'Sección de Inversión', 
      desc: 'Muestra u oculta la pestaña de costos y requisitos de admisión.' 
    },
    { 
      id: 'mostrar_plan_estudio', 
      label: 'Malla Curricular', 
      desc: 'Muestra u oculta la pestaña del plan de estudios detallado.' 
    },
    { 
      id: 'mostrar_horarios', 
      label: 'Pestaña de Horarios', 
      desc: 'Habilita la visualización de los cronogramas de clases.' 
    },
    { 
      id: 'mostrar_perfiles', 
      label: 'Perfiles y Objetivos', 
      desc: 'Muestra los perfiles del ingresante, egresado y objetivos del programa.' 
    },
    { 
      id: 'mostrar_certificacion', 
      label: 'Certificación Final', 
      desc: 'Muestra el detalle del grado o diploma que se otorga al finalizar.' 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
        <h3 className="text-lg font-black text-brand-950 flex items-center gap-2 uppercase tracking-tight">
          <Settings className="w-5 h-5 text-brand-600" /> Configuración de Visibilidad
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {configItems.map((item) => {
            const isVisible = !!configData[item.id as keyof ProgramaConfigVisibilidad];
            return (
              <div 
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer select-none ${
                  isVisible ? 'bg-brand-50/50 border-brand-200' : 'bg-muted/20 border-border opacity-60'
                }`}
                onClick={() => toggleField(item.id as keyof ProgramaConfigVisibilidad)}
              >
                <div className={`mt-1 p-2 rounded-lg ${isVisible ? 'bg-brand-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                  {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-black text-brand-950 uppercase">{item.label}</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${isVisible ? 'bg-brand-600' : 'bg-muted-foreground/30'}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isVisible ? 'left-6' : 'left-1'}`} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
