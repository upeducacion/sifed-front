"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { curriculums } from "@/data/curriculums";
import TabSelector from "@/components/ui/tab-selector";
import CurriculumTable from "./curriculum-table";
import { BookOpen, GraduationCap, Clock, Hash, Info, Download } from "lucide-react";

export default function ProgramExplorer() {
  const searchParams = useSearchParams();

  // Separar tipos de programa para el primer nivel de tabs
  const programTypes = [
    { id: "Maestría", label: "Maestrías", icon: <BookOpen className="w-4 h-4" /> },
    { id: "Doctorado", label: "Doctorado", icon: <GraduationCap className="w-4 h-4" /> },
  ];

  // Determinar tipo y programa inicial desde el query param ?programa=ID
  const getInitialValues = () => {
    const param = searchParams.get("programa");
    if (param) {
      const found = curriculums.find((p) => p.id === param);
      if (found) return { type: found.tipo, id: found.id };
    }
    return { type: "Maestría", id: curriculums.find((p) => p.tipo === "Maestría")!.id };
  };

  const initial = getInitialValues();
  const [activeType, setActiveType] = useState(initial.type);

  // Filtrar menciones según el tipo activo
  const availablePrograms = useMemo(() =>
    curriculums.filter(p => p.tipo === activeType),
  [activeType]);

  const [activeProgramId, setActiveProgramId] = useState(initial.id);

  // Sincronizar activeProgramId cuando cambia el tipo (sin sobrescribir el param inicial)
  const [hasInitialized, setHasInitialized] = useState(false);
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      return;
    }
    setActiveProgramId(availablePrograms[0].id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeType]);

  const selectedProgram = useMemo(() => 
    curriculums.find(p => p.id === activeProgramId)!, 
  [activeProgramId]);

  return (
    <div className="space-y-12">
      {/* Nivel 1: Tipo de Programa */}
      <div className="flex flex-col items-center gap-6">
        <TabSelector 
          options={programTypes} 
          activeTab={activeType} 
          onChange={setActiveType}
        />

        {/* Nivel 2: Menciones (Solo si hay más de una) */}
        {availablePrograms.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2">
            {availablePrograms.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveProgramId(p.id)}
                className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                  activeProgramId === p.id
                    ? "bg-brand-100 border-brand-300 text-brand-800 shadow-sm"
                    : "bg-white border-border text-muted-foreground hover:border-brand-200 hover:bg-brand-50/50"
                }`}
              >
                {p.mencion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detalles del Programa Seleccionado */}
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Info Header */}
        <div className="bg-white border border-border rounded-3xl p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-950 leading-tight">
              {selectedProgram.nombre}
            </h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 rounded-lg text-brand-700 text-sm font-bold">
                <Clock className="w-4 h-4" />
                {selectedProgram.duracion}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-uncp-gold/10 rounded-lg text-brand-800 text-sm font-bold border border-uncp-gold/20">
                <Hash className="w-4 h-4" />
                {selectedProgram.ciclos.reduce((acc, c) => acc + c.totalCreditos, 0)} Créditos Totales
              </div>
            </div>
          </div>
          
          <div className="shrink-0">
            <a 
              href="/documents/admision/plan-estudios-completo.pdf" 
              className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-600/20 active:scale-95"
            >
              <Download className="w-5 h-5" />
              Descargar Malla
            </a>
          </div>
        </div>

        {/* Grilla de Ciclos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedProgram.ciclos.map((ciclo) => (
            <CurriculumTable key={ciclo.numero} ciclo={ciclo} />
          ))}
        </div>

        {/* Nota / Pie de Página */}
        {selectedProgram.nota && (
          <div className="flex items-start gap-3 p-6 bg-brand-50/50 rounded-2xl border border-brand-100/50 text-brand-800">
            <Info className="w-5 h-5 mt-0.5 shrink-0 text-brand-500" />
            <p className="text-sm font-medium leading-relaxed italic">
              {selectedProgram.nota}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
