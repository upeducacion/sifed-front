"use client";

import { Info } from "lucide-react";
import { ProgramaAdminFormData } from "@/types/admin-programa";

interface InfoGeneralTabProps {
  formData: ProgramaAdminFormData;
  setFormData: (data: ProgramaAdminFormData) => void;
}

export function InfoGeneralTab({ formData, setFormData }: InfoGeneralTabProps) {

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* SECCIÓN: Información Básica */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
        <h3 className="text-lg font-black text-brand-950 flex items-center gap-2">
          <Info className="w-5 h-5 text-brand-600" /> Información Principal
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Título del Programa</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm font-medium"
              placeholder="Ej: Maestría en Ciencias de la Educación"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Tipo de Programa</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm font-bold"
            >
              <option value="maestria">Maestría</option>
              <option value="doctorado">Doctorado</option>
              <option value="diplomado">Diplomado</option>
              <option value="curso">Curso</option>
              <option value="taller">Taller</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-brand-950">Descripción Corta (Para tarjetas)</label>
            <textarea
              value={formData.descripcion_corta}
              onChange={(e) => setFormData({ ...formData, descripcion_corta: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm resize-none"
              placeholder="Breve resumen que aparece en los listados generales..."
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN: Atributos Académicos */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
        <h3 className="text-lg font-black text-brand-950 flex items-center gap-2">
          Métrica y Modalidad
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Mención / Categoría</label>
            <input
              type="text"
              value={formData.detalles_json.categoria || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                detalles_json: { ...formData.detalles_json, categoria: e.target.value } 
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
              placeholder="Ej: Gestión Educativa"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Duración</label>
            <input
              type="text"
              value={formData.detalles_json.info_general?.duracion || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                detalles_json: { 
                  ...formData.detalles_json, 
                  info_general: { ...formData.detalles_json.info_general, duracion: e.target.value } 
                } 
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
              placeholder="Ej: 3 Semestres"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Modalidad</label>
            <input
              type="text"
              value={formData.detalles_json.info_general?.modalidad || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                detalles_json: { 
                  ...formData.detalles_json, 
                  info_general: { ...formData.detalles_json.info_general, modalidad: e.target.value } 
                } 
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
              placeholder="Ej: Presencial / Híbrida"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Grado / Certificación</label>
            <input
              type="text"
              value={formData.detalles_json.info_general?.certificacion || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                detalles_json: { 
                  ...formData.detalles_json, 
                  info_general: { ...formData.detalles_json.info_general, certificacion: e.target.value } 
                } 
              })}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
              placeholder="Ej: Magíster en Educación"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
