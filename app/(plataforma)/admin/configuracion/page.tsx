"use client";

import { useState } from "react";
import { User, Lock, Save, Camera } from "lucide-react";
import { UnoptImage } from "@/components/ui/unopt-image";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-serif font-bold text-brand-950">Configuración</h2>
        <p className="text-muted-foreground">Gestiona tu información personal y preferencias de seguridad.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar de Tabs */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "profile" 
                ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200" 
                : "text-muted-foreground hover:bg-white hover:text-brand-600"
            }`}
          >
            <User className="h-4 w-4" />
            Mi Perfil
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "security" 
                ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200" 
                : "text-muted-foreground hover:bg-white hover:text-brand-600"
            }`}
          >
            <Lock className="h-4 w-4" />
            Seguridad
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 space-y-6">
          
          {/* TAB: PERFIL */}
          {activeTab === "profile" && (
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-bold text-brand-950 mb-6 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                   <User className="h-4 w-4" />
                </div>
                Información Personal
              </h3>

              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative h-24 w-24 rounded-full border-4 border-brand-50 bg-brand-100 flex items-center justify-center overflow-hidden group">
                     <UnoptImage src="/images/logo-posgrado-educacion.webp" alt="Avatar" width={64} height={64} className="opacity-50" />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="h-6 w-6 text-white" />
                     </div>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white border border-brand-200 rounded-lg text-xs font-bold text-brand-700 hover:bg-brand-50 transition-colors shadow-sm">
                      Cambiar Foto
                    </button>
                    <p className="text-[10px] text-muted-foreground mt-2">JPG, PNG o WEBP. Máx 2MB.</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-900 uppercase tracking-wide">Nombre Completo</label>
                    <input 
                      type="text" 
                      defaultValue="Administrador del Sistema" 
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-brand-50/30 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-900 uppercase tracking-wide">Correo Electrónico</label>
                    <input 
                      type="email" 
                      defaultValue="admin@superuser.com" 
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/50 text-muted-foreground cursor-not-allowed outline-none text-sm font-medium"
                    />
                    <p className="text-[10px] text-muted-foreground">El correo no se puede cambiar por seguridad.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-900 uppercase tracking-wide">Teléfono</label>
                    <input 
                      type="tel" 
                      placeholder="+51 999 999 999"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-brand-50/30 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-border flex justify-end">
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-950 text-white rounded-xl text-sm font-bold hover:bg-brand-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SEGURIDAD */}
          {activeTab === "security" && (
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-bold text-brand-950 mb-6 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                   <Lock className="h-4 w-4" />
                </div>
                Cambiar Contraseña
              </h3>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-900 uppercase tracking-wide">Contraseña Actual</label>
                  <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-border bg-brand-50/30 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm" />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-900 uppercase tracking-wide">Nueva Contraseña</label>
                    <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-border bg-brand-50/30 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-900 uppercase tracking-wide">Confirmar Contraseña</label>
                    <input type="password" className="w-full px-4 py-2.5 rounded-xl border border-border bg-brand-50/30 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm" />
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-border flex justify-end">
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-950 text-white rounded-xl text-sm font-bold hover:bg-brand-800 transition-all shadow-lg">
                    <Save className="h-4 w-4" />
                    Actualizar Contraseña
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
