"use client";

import { Wallet, Plus, Trash2 } from "lucide-react";
import { ProgramaDetallesJson } from "@/types/admin-programa";

interface AdmisionTabProps {
  admisionData: ProgramaDetallesJson['admision'];
  setAdmisionData: (data: ProgramaDetallesJson['admision']) => void;
}

export function AdmisionTab({ admisionData, setAdmisionData }: AdmisionTabProps) {

  const updateField = (field: keyof ProgramaDetallesJson['admision'], value: string) => {
    setAdmisionData({ ...admisionData, [field]: value });
  };

  const addRequisito = () => {
    setAdmisionData({
      ...admisionData,
      requisitos: [...(admisionData.requisitos || []), ""]
    });
  };

  const updateRequisito = (index: number, val: string) => {
    const next = [...(admisionData.requisitos || [])];
    next[index] = val;
    setAdmisionData({ ...admisionData, requisitos: next });
  };

  const removeRequisito = (index: number) => {
    const next = [...(admisionData.requisitos || [])];
    next.splice(index, 1);
    setAdmisionData({ ...admisionData, requisitos: next });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* SECCIÓN: Costos */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
        <h3 className="text-lg font-black text-brand-950 flex items-center gap-2 uppercase tracking-tight">
          <Wallet className="w-5 h-5 text-brand-600" /> Inversión Económica
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Costo Inscripción</label>
            <input
              type="text"
              value={admisionData.costo_inscripcion || ''}
              onChange={(e) => updateField('costo_inscripcion', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
              placeholder="Ej: S/ 231.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Matrícula (por ciclo)</label>
            <input
              type="text"
              value={admisionData.matricula || ''}
              onChange={(e) => updateField('matricula', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
              placeholder="Ej: S/ 350.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Pensión (por ciclo)</label>
            <input
              type="text"
              value={admisionData.pension || ''}
              onChange={(e) => updateField('pension', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
              placeholder="Ej: S/ 2,100.00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-950">Otros Costos</label>
            <input
              type="text"
              value={admisionData.costo_adicional || ''}
              onChange={(e) => updateField('costo_adicional', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
              placeholder="Ej: S/ 50.00 (Carnet)"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN: Requisitos */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-brand-950 uppercase tracking-tight">Requisitos de Postulación</h3>
          <button
            type="button"
            onClick={addRequisito}
            className="flex items-center gap-2 text-xs font-bold bg-brand-50 text-brand-700 px-4 py-2 rounded-xl border border-brand-100 hover:bg-brand-100 transition-all"
          >
            <Plus className="w-4 h-4" /> Agregar requisito
          </button>
        </div>

        <div className="space-y-3">
          {(admisionData.requisitos || []).map((req, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={req}
                onChange={(e) => updateRequisito(index, e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
                placeholder="Ej: Copia legalizada del grado de bachiller"
              />
              <button
                type="button"
                onClick={() => removeRequisito(index)}
                className="p-2.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {(admisionData.requisitos || []).length === 0 && (
            <p className="text-center py-6 text-sm text-muted-foreground italic border-2 border-dashed border-muted rounded-xl">
              No se han agregado requisitos aún.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
