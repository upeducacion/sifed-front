"use client";

import { Plus, Trash2, Clock, CalendarDays, User } from "lucide-react";

interface ClaseEspecifica {
  asignatura: string;
  dia_hora: string;
  docente: string;
}

interface HorarioModulo {
  titulo_modulo: string;
  descripcion_general: string;
  clases_especificas: ClaseEspecifica[];
}

interface HorariosTabProps {
  horariosData: HorarioModulo[];
  setHorariosData: (data: HorarioModulo[]) => void;
}

export function HorariosTab({ horariosData, setHorariosData }: HorariosTabProps) {

  const addModulo = () => {
    setHorariosData([
      ...horariosData,
      {
        titulo_modulo: "",
        descripcion_general: "",
        clases_especificas: []
      }
    ]);
  };

  const removeModulo = (index: number) => {
    const nuevos = [...horariosData];
    nuevos.splice(index, 1);
    setHorariosData(nuevos);
  };

  const updateModulo = (index: number, field: keyof HorarioModulo, value: string | ClaseEspecifica[]) => {
    const nuevos = [...horariosData];
    nuevos[index] = { ...nuevos[index], [field]: value } as HorarioModulo;
    setHorariosData(nuevos);
  };

  const addClase = (mIndex: number) => {
    const nuevos = [...horariosData];
    nuevos[mIndex].clases_especificas.push({
      asignatura: "",
      dia_hora: "",
      docente: ""
    });
    setHorariosData(nuevos);
  };

  const updateClase = (mIndex: number, cIndex: number, field: keyof ClaseEspecifica, value: string) => {
    const nuevos = [...horariosData];
    nuevos[mIndex].clases_especificas[cIndex][field] = value;
    setHorariosData(nuevos);
  };

  const removeClase = (mIndex: number, cIndex: number) => {
    const nuevos = [...horariosData];
    nuevos[mIndex].clases_especificas.splice(cIndex, 1);
    setHorariosData(nuevos);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER EXPLICATIVO */}
      <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-black text-brand-950 mb-1 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-600" /> Gestión de Horarios
          </h3>
          <p className="text-sm text-muted-foreground">Puedes crear bloques de horarios genéricos (Ej: &quot;Fines de Semana&quot;) o detallar curso por curso.</p>
        </div>
        <button
          type="button"
          onClick={addModulo}
          className="shrink-0 flex items-center gap-2 bg-brand-950 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm font-bold text-sm"
        >
          <Plus className="w-4 h-4" /> Agregar Bloque de Horario
        </button>
      </div>

      {/* CONSTRUCTOR DE MÓDULOS DE HORARIO */}
      <div className="space-y-6">
        {horariosData.map((modulo, mIndex) => (
          <div key={mIndex} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden group/modulo">
            
            {/* Header del Bloque */}
            <div className="bg-muted/30 px-6 py-4 flex items-center justify-between border-b border-border">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-950 uppercase shrink-0">Bloque:</span>
                  <input
                    type="text"
                    value={modulo.titulo_modulo}
                    onChange={(e) => updateModulo(mIndex, 'titulo_modulo', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm font-bold"
                    placeholder="Ej: Primer Semestre - Grupo A"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-950 uppercase shrink-0">General:</span>
                  <input
                    type="text"
                    value={modulo.descripcion_general}
                    onChange={(e) => updateModulo(mIndex, 'descripcion_general', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
                    placeholder="Ej: Sábados y domingos de 8:00 AM a 6:00 PM"
                  />
                </div>
              </div>
              <button 
                type="button"
                onClick={() => removeModulo(mIndex)}
                className="ml-4 p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                title="Eliminar este bloque"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Clases Específicas */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-black text-brand-600 uppercase tracking-widest">Detalle de Sesiones / Cursos</h4>
                <button
                  type="button"
                  onClick={() => addClase(mIndex)}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg border border-brand-100 hover:bg-brand-100 transition-colors"
                >
                  <Plus className="w-3 h-3" /> Añadir Fila
                </button>
              </div>

              {modulo.clases_especificas && modulo.clases_especificas.length > 0 ? (
                <div className="space-y-3">
                  {modulo.clases_especificas.map((clase, cIndex) => (
                    <div key={cIndex} className="flex flex-col lg:flex-row gap-3 items-start lg:items-center bg-muted/10 p-3 rounded-xl border border-border/50">
                      
                      <div className="flex-1 w-full relative">
                        <input
                          type="text"
                          value={clase.asignatura}
                          onChange={(e) => updateClase(mIndex, cIndex, 'asignatura', e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-xs font-bold"
                          placeholder="Nombre de la asignatura"
                        />
                        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                      </div>

                      <div className="w-full lg:w-64 relative">
                        <input
                          type="text"
                          value={clase.dia_hora}
                          onChange={(e) => updateClase(mIndex, cIndex, 'dia_hora', e.target.value)}
                          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-xs"
                          placeholder="Días y horarios"
                        />
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                      </div>

                      <div className="w-full lg:w-64 flex items-center gap-2">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={clase.docente}
                            onChange={(e) => updateClase(mIndex, cIndex, 'docente', e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-xs"
                            placeholder="Nombre del docente"
                          />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeClase(mIndex, cIndex)}
                          className="p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/5 rounded-xl border border-dashed border-border">
                  <p className="text-xs text-muted-foreground italic">No hay sesiones específicas agregadas a este bloque.</p>
                </div>
              )}
            </div>

          </div>
        ))}

        {horariosData.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-brand-100 rounded-[2rem] bg-brand-50/20">
            <p className="text-muted-foreground font-medium mb-4">No hay horarios registrados.</p>
            <button
              type="button"
              onClick={addModulo}
              className="inline-flex items-center gap-2 bg-white border border-border text-brand-950 px-5 py-2.5 rounded-xl hover:bg-muted transition-all shadow-sm font-bold text-sm"
            >
              <Plus className="w-4 h-4" /> Empezar a crear
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
