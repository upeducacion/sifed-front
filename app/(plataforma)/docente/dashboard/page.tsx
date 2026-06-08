"use client";

import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Users, MessageSquare, Clock, ClipboardCheck } from "lucide-react";

export default function DocenteDashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: "Cursos Asignados", value: "4", icon: BookOpen, color: "text-brand-600 bg-brand-50" },
    { label: "Total Estudiantes", value: "128", icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Tareas por Revisar", value: "15", icon: ClipboardCheck, color: "text-orange-600 bg-orange-50" }, 
    { label: "Foros Activos", value: "8", icon: MessageSquare, color: "text-green-600 bg-green-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-brand-950">
          Bienvenido, <span className="text-brand-600">{user?.name}</span>
        </h2>
        <p className="text-muted-foreground">Aquí tienes un resumen de tu actividad académica.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-6 bg-white rounded-2xl border border-border shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold text-brand-950">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Próximas Clases */}
        <div className="md:col-span-2 p-6 bg-white rounded-2xl border border-border shadow-sm">
          <h3 className="font-bold text-brand-950 mb-4 flex items-center gap-2">
             <Clock className="h-5 w-5 text-brand-600" /> Horario de Hoy
          </h3>
          <div className="space-y-4">
             {/* Mock Data */}
             {[1, 2].map(i => (
                <div key={i} className="flex items-center p-4 rounded-xl bg-muted/30 border border-border">
                   <div className="w-16 text-center border-r border-border pr-4 mr-4">
                      <span className="block text-lg font-bold text-brand-950">0{8 + i}:00</span>
                      <span className="text-xs text-muted-foreground">AM</span>
                   </div>
                   <div>
                      <h4 className="font-bold text-brand-900">Investigación Educativa II</h4>
                      <p className="text-xs text-muted-foreground">Maestría en Gestión • Aula 302</p>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Avisos */}
        <div className="p-6 bg-brand-950 text-white rounded-2xl shadow-xl">
           <h3 className="font-bold mb-4 text-uncp-gold">Avisos Importantes</h3>
           <p className="text-sm text-brand-100 leading-relaxed">
              Recuerde subir las notas del primer parcial antes del viernes 25. El sistema se cerrará automáticamente a las 23:59.
           </p>
        </div>
      </div>
    </div>
  );
}