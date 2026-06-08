"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Save, 
  User, 
  FileText, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Loader2,
  X,
  Plus,
  Eye
} from "lucide-react";
import Link from "next/link";
import { docentesApi } from "@/lib/api/docentes";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { handleApiError } from "@/lib/error-handler";

export default function NuevoDocentePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // States para archivos
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    nombre_completo: "",
    grados: [""],
    biografia: "",
    categoria: "principal",
    estado: "activo",
    orden: 0,
    enlaces: [
      { red: "Linkedin", url: "" },
      { red: "ORCID", url: "" },
      { red: "Google Scholar", url: "" }
    ],
    config_visibilidad: {
      mostrar_cv: false,
      mostrar_bio: false,
      mostrar_redes: false
    }
  });

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvFile(file);
  };

  const handleAddGrado = () => {
    setFormData({ ...formData, grados: [...formData.grados, ""] });
  };

  const handleRemoveGrado = (index: number) => {
    const newGrados = [...formData.grados];
    newGrados.splice(index, 1);
    setFormData({ ...formData, grados: newGrados.length ? newGrados : [""] });
  };

  const handleChangeGrado = (index: number, value: string) => {
    const newGrados = [...formData.grados];
    newGrados[index] = value;
    setFormData({ ...formData, grados: newGrados });
  };

  const handleAddEnlace = () => {
    setFormData({ ...formData, enlaces: [...formData.enlaces, { red: "", url: "" }] });
  };

  const handleRemoveEnlace = (index: number) => {
    const newEnlaces = [...formData.enlaces];
    newEnlaces.splice(index, 1);
    setFormData({ ...formData, enlaces: newEnlaces });
  };

  const handleChangeEnlace = (index: number, field: 'red' | 'url', value: string) => {
    const newEnlaces = [...formData.enlaces];
    newEnlaces[index][field] = value;
    setFormData({ ...formData, enlaces: newEnlaces });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("nombre_completo", formData.nombre_completo);
      
      const gradosString = formData.grados.map(g => g.trim()).filter(Boolean).join(". ");
      data.append("grados", gradosString);
      
      data.append("biografia", formData.biografia);
      data.append("categoria", formData.categoria);
      data.append("estado", formData.estado);
      data.append("orden", formData.orden.toString());
      
      const enlacesObj = formData.enlaces.reduce((acc, curr) => {
        if (curr.red.trim() && curr.url.trim()) {
          acc[curr.red.trim()] = curr.url.trim();
        }
        return acc;
      }, {} as Record<string, string>);
      
      data.append("detalles_json", JSON.stringify({ enlaces_sociales: enlacesObj }));
      data.append("config_visibilidad", JSON.stringify(formData.config_visibilidad));

      if (fotoFile) data.append("foto", fotoFile);
      if (cvFile) data.append("cv", cvFile);

      await docentesApi.create(data);
      showToast("Docente creado exitosamente", "success");
      router.push("/admin/portal/docentes");
    } catch (error) {
      handleApiError(error, showToast, "Error al crear el docente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/portal/docentes"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-brand-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al listado
        </Link>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Guardar Docente
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile & Visibilty */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
            <h3 className="font-bold text-brand-950 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-brand-500" />
              Foto de Perfil
            </h3>
            
            <div className="relative group">
              <div className="aspect-[4/5] bg-brand-50 rounded-2xl border-2 border-dashed border-brand-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-brand-400">
                {fotoPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => { setFotoPreview(null); setFotoFile(null); }}
                      className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <Plus className="w-6 h-6 text-brand-400" />
                    </div>
                    <p className="text-xs font-bold text-brand-900 mb-1">Subir Foto</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">PNG sin fondo (2MB máx)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleFotoChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
            <h3 className="font-bold text-brand-950 flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-500" />
              Visibilidad de Campos
            </h3>
            <div className="space-y-4">
              {Object.entries(formData.config_visibilidad).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/50">
                  <span className="text-xs font-bold capitalize text-brand-900">
                    {key.replace('mostrar_', '').replace('_', ' ')}
                  </span>
                  <button 
                    onClick={() => setFormData({
                      ...formData, 
                      config_visibilidad: { ...formData.config_visibilidad, [key]: !value }
                    })}
                    className={cn(
                      "w-10 h-5 rounded-full transition-all relative",
                      value ? "bg-emerald-500" : "bg-muted-foreground/30"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                      value ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Information */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Information */}
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm space-y-6">
            <h3 className="font-bold text-brand-950 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-500" />
              Información Básica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Aliaga Contreras, Isabel Margarita"
                  className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm font-medium"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Categoría</label>
                <select 
                  className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm font-medium appearance-none"
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                >
                  <option value="principal">Principal</option>
                  <option value="asociado">Asociado</option>
                  <option value="auxiliar">Auxiliar</option>
                  <option value="contratado">Contratado</option>
                  <option value="invitado">Invitado</option>
                </select>
              </div>
              
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Formación Académica (Grados)</label>
                  <button type="button" onClick={handleAddGrado} className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:text-brand-800">
                    <Plus className="w-3 h-3" /> Agregar Grado
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.grados.map((grado, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-400 shrink-0" />
                      <input 
                        type="text"
                        placeholder="Ej: MAGISTER EN CIENCIAS DE LA EDUCACION"
                        className="flex-1 px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm font-medium"
                        value={grado}
                        onChange={(e) => handleChangeGrado(index, e.target.value)}
                        required={index === 0}
                      />
                      <button type="button" onClick={() => handleRemoveGrado(index)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CV & Bio */}
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm space-y-6">
            <h3 className="font-bold text-brand-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-500" />
              Documentación y Biografía
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Currículum Vitae (PDF)</label>
                <div className="relative">
                  <div className="flex items-center gap-3 p-4 bg-brand-50/50 border border-dashed border-brand-200 rounded-xl transition-all hover:bg-brand-50">
                    <FileText className="w-8 h-8 text-brand-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-brand-900 truncate">
                        {cvFile ? cvFile.name : "Seleccionar archivo PDF"}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Máximo 10MB</p>
                    </div>
                    <button className="text-xs font-black uppercase tracking-widest text-brand-600 hover:text-brand-700">Explorar</button>
                  </div>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleCvChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Biografía Profesional (Markdown)</label>
                <textarea 
                  rows={6}
                  placeholder="Describe la trayectoria profesional del docente..."
                  className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm font-medium"
                  value={formData.biografia}
                  onChange={(e) => setFormData({...formData, biografia: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-brand-950 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-brand-500" />
                Redes Académicas
              </h3>
              <button type="button" onClick={handleAddEnlace} className="text-xs font-bold text-brand-600 flex items-center gap-1 hover:text-brand-800">
                <Plus className="w-3 h-3" /> Agregar Red
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.enlaces.map((enlace, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-muted/20 border border-border rounded-xl relative group">
                  <div className="w-full sm:w-1/3 space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Plataforma</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Linkedin, ResearchGate"
                      className="w-full px-3 py-2 bg-white border border-border rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm font-medium"
                      value={enlace.red}
                      onChange={(e) => handleChangeEnlace(index, 'red', e.target.value)}
                    />
                  </div>
                  <div className="w-full sm:flex-1 space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Enlace (URL)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="url" 
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 bg-white border border-border rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all text-sm font-medium"
                        value={enlace.url}
                        onChange={(e) => handleChangeEnlace(index, 'url', e.target.value)}
                      />
                      <button type="button" onClick={() => handleRemoveEnlace(index)} className="p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {formData.enlaces.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No hay redes agregadas.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
