"use client";

import { FileText } from "lucide-react";
import { ProgramaAdminFormData } from "@/types/admin-programa";

interface AcercaDeTabProps {
  formData: ProgramaAdminFormData;
  setFormData: (data: ProgramaAdminFormData) => void;
}

export function AcercaDeTab({ formData, setFormData }: AcercaDeTabProps) {

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* SECCIÓN: El Programa */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
        <h3 className="text-lg font-black text-brand-950 flex items-center gap-2 uppercase tracking-tight">
          <FileText className="w-5 h-5 text-brand-600" /> Descripción Detallada
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950 block italic">Sobre el Programa (Acerca de)</label>
            <textarea
              value={formData.detalles_json.acerca_de || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                detalles_json: { ...formData.detalles_json, acerca_de: e.target.value } 
              })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm leading-relaxed min-h-[200px]"
              placeholder="Escribe aquí el texto principal que describe el propósito y alcance del programa..."
            />
            <p className="text-xs text-muted-foreground italic">Este texto aparecerá en la pestaña principal de información del programa.</p>
          </div>
        </div>
      </div>

      {/* SECCIÓN: Certificación */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
        <h3 className="text-lg font-black text-brand-950 flex items-center gap-2 uppercase tracking-tight">
          Detalle del Grado Académico
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950 block italic">Nombre del Grado o Certificación Final</label>
            <textarea
              value={formData.detalles_json.certificacion_detalle || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                detalles_json: { ...formData.detalles_json, certificacion_detalle: e.target.value } 
              })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm font-medium"
              placeholder="Ej: A nombre de la nación como Magíster en Educación con mención en..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground italic">Este texto aparecerá resaltado junto a un ícono de medalla dorada.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
