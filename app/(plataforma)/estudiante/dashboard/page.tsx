"use client";

import { useAuth } from "@/hooks/use-auth";
import { Clock, BookOpen, AlertCircle } from "lucide-react";

export default function EstudianteDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Banner de Bienvenida */}
      <div className="relative overflow-hidden rounded-3xl bg-brand-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600 rounded-full blur-[100px] opacity-50 -mr-20 -mt-20"></div>
        <div className="relative z-10">
           <h2 className="text-3xl font-serif font-bold mb-2">Hola, {user?.name.split(' ')[0]}</h2>
           <p className="text-brand-200 max-w-lg">
             Tienes <strong className="text-white">3 tareas pendientes</strong> para esta semana. Revisa tu calendario para más detalles.
           </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Columna Principal: Cursos */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="font-bold text-brand-950 text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-600" /> Mis Cursos
           </h3>
           
           <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3].map(i => (
                 <div key={i} className="group p-5 bg-white rounded-2xl border border-border shadow-sm hover:border-brand-300 hover:shadow-md transition-all cursor-pointer">
                    <div className="h-2 w-12 bg-brand-200 rounded-full mb-4 group-hover:bg-brand-500 transition-colors"></div>
                    <h4 className="font-bold text-lg text-brand-950 mb-1">Didáctica Universitaria</h4>
                    <p className="text-xs text-muted-foreground mb-4">Docente: Dr. Juan Pérez</p>
                    <div className="flex items-center justify-between text-xs font-medium">
                       <span className="text-brand-600 bg-brand-50 px-2 py-1 rounded">En curso</span>
                       <span className="text-muted-foreground">Progreso: 45%</span>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Sidebar: Pendientes */}
        <div className="space-y-6">
           <h3 className="font-bold text-brand-950 text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" /> Por Vencer
           </h3>
           
           <div className="space-y-3">
              <div className="p-4 bg-white rounded-xl border border-l-4 border-l-orange-500 shadow-sm">
                 <h5 className="font-bold text-sm text-brand-900">Ensayo Final</h5>
                 <p className="text-xs text-muted-foreground mt-1">Didáctica Universitaria</p>
                 <div className="mt-2 flex items-center gap-1 text-xs font-bold text-orange-600">
                    <AlertCircle className="h-3 w-3" /> Vence mañana
                 </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-l-4 border-l-brand-300 shadow-sm">
                 <h5 className="font-bold text-sm text-brand-900">Foro de Debate</h5>
                 <p className="text-xs text-muted-foreground mt-1">Investigación I</p>
                 <div className="mt-2 flex items-center gap-1 text-xs font-bold text-brand-500">
                    <Clock className="h-3 w-3" /> Vence el viernes
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
