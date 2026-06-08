import { Ciclo } from "@/types/curriculum";
import { cn } from "@/lib/utils";

export default function CurriculumTable({ ciclo }: { ciclo: Ciclo }) {
  // Separar cursos regulares de electivos
  const cursosRegulares = ciclo.asignaturas.filter(m => !m.isElectivo);
  const electivos = ciclo.asignaturas.filter(m => m.isElectivo);
  
  // Si hay electivos, todos deberían compartir la misma cantidad de créditos si pertenecen al mismo bloque
  const creditosElectivo = electivos.length > 0 ? electivos[0].creditos : 0;

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header del Ciclo */}
      <div className="bg-brand-950 px-6 py-4 flex justify-between items-center">
        <h4 className="font-serif text-xl font-bold text-white">Ciclo {ciclo.numero}</h4>
        <span className="bg-uncp-gold/20 text-uncp-gold text-xs font-black px-2.5 py-1 rounded-full border border-uncp-gold/30 uppercase tracking-tighter">
          {ciclo.totalCreditos} Créditos
        </span>
      </div>

      {/* Tabla de Contenido */}
      <div className="p-0 flex-grow">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/30 text-muted-foreground text-[10px] uppercase tracking-widest font-black border-b border-border">
              <th className="px-6 py-3 text-left">Asignatura</th>
              <th className="px-6 py-3 text-right w-20">Créditos</th>
            </tr>
          </thead>
          <tbody className="">
            {cursosRegulares.map((materia, idx) => (
              <tr key={idx} className="group transition-colors hover:bg-brand-50/50 border-b border-brand-100 border-l-4 border-l-transparent">
                <td className="px-6 py-4 text-foreground font-medium leading-snug">
                  {materia.nombre}
                </td>
                <td className="px-6 py-4 text-right align-middle">
                  <span className="font-bold text-brand-600 text-base">
                    {materia.creditos || "—"}
                  </span>
                </td>
              </tr>
            ))}

            {/* Fila agrupada para Electivos */}
            {electivos.length > 0 && (
              <tr className="bg-amber-50/40 border-b border-brand-100 border-l-4 border-l-amber-400 group transition-colors">
                <td className="p-0 text-foreground font-medium leading-snug">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-amber-200/50">
                      <span className="font-bold text-amber-900">Elegir un curso electivo:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200">
                        Electivo
                      </span>
                    </div>
                    <ul className="flex flex-col text-sm text-muted-foreground">
                      {electivos.map((electivo, idx) => (
                        <li 
                          key={`elec-${idx}`}
                          className={cn(
                            "px-6 py-3 flex items-center before:content-[''] before:w-1.5 before:h-1.5 before:bg-amber-300 before:rounded-full before:mr-3",
                            idx !== electivos.length - 1 ? "border-b border-amber-200/30" : ""
                          )}
                        >
                          {electivo.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                </td>
                <td className="px-6 py-4 text-right align-middle border-l border-amber-200/30">
                  <span className="font-bold text-amber-600 text-base">
                    {creditosElectivo || "—"}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-brand-50/50 border-t-2 border-brand-100">
              <td className="px-6 py-4 text-brand-950 font-black uppercase tracking-tight text-right">Total Ciclo</td>
              <td className="px-6 py-4 text-right font-black text-brand-700 text-base">{ciclo.totalCreditos}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
