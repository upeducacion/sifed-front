"use client";

import { Plus, Trash2 } from "lucide-react";
import { ProgramaAdminFormData } from "@/types/admin-programa";

interface ListBuilderProps {
  title: string;
  field: keyof Pick<ProgramaAdminFormData['detalles_json'], 'objetivos' | 'perfil_estudiante' | 'perfil_egresado'>;
  dataList: string[];
  onUpdate: (field: keyof Pick<ProgramaAdminFormData['detalles_json'], 'objetivos' | 'perfil_estudiante' | 'perfil_egresado'>, newArray: string[]) => void;
}

function ListBuilder({ title, field, dataList, onUpdate }: ListBuilderProps) {
  const addItem = () => onUpdate(field, [...dataList, ""]);
  const removeItem = (index: number) => onUpdate(field, dataList.filter((_, i) => i !== index));
  const updateItem = (index: number, val: string) => {
    const next = [...dataList];
    next[index] = val;
    onUpdate(field, next);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black text-brand-950 uppercase tracking-tight">{title}</h3>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 text-xs font-bold bg-brand-50 text-brand-700 px-4 py-2 rounded-xl border border-brand-100 hover:bg-brand-100 transition-all"
        >
          <Plus className="w-4 h-4" /> Agregar ítem
        </button>
      </div>

      <div className="space-y-3">
        {dataList.map((item, index) => (
          <div key={index} className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-300">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-[10px] font-black text-brand-600 border border-border">
              {index + 1}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
              placeholder="Escribe un punto importante..."
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-2.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {dataList.length === 0 && (
          <p className="text-center py-6 text-sm text-muted-foreground italic border-2 border-dashed border-muted rounded-xl">
            No se han agregado elementos aún.
          </p>
        )}
      </div>
    </div>
  );
}

interface PerfilesTabProps {
  formData: ProgramaAdminFormData;
  setFormData: (data: ProgramaAdminFormData) => void;
}

export function PerfilesTab({ formData, setFormData }: PerfilesTabProps) {
  
  const handleUpdate = (field: keyof Pick<ProgramaAdminFormData['detalles_json'], 'objetivos' | 'perfil_estudiante' | 'perfil_egresado'>, newArray: string[]) => {
    setFormData({
      ...formData,
      detalles_json: {
        ...formData.detalles_json,
        [field]: newArray
      }
    });
  };

  // Fallbacks de seguridad para evitar errores si los arrays son undefined
  const objetivos = Array.isArray(formData.detalles_json.objetivos) ? formData.detalles_json.objetivos : [];
  const perfilEstudiante = Array.isArray(formData.detalles_json.perfil_estudiante) ? formData.detalles_json.perfil_estudiante : [];
  const perfilEgresado = Array.isArray(formData.detalles_json.perfil_egresado) ? formData.detalles_json.perfil_egresado : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <ListBuilder title="Objetivos del Programa" field="objetivos" dataList={objetivos} onUpdate={handleUpdate} />
      <ListBuilder title="Perfil del Ingresante (Estudiante)" field="perfil_estudiante" dataList={perfilEstudiante} onUpdate={handleUpdate} />
      <ListBuilder title="Perfil del Egresado" field="perfil_egresado" dataList={perfilEgresado} onUpdate={handleUpdate} />
    </div>
  );
}
