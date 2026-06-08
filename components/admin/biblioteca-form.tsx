"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UnoptImage } from "@/components/ui/unopt-image";
import useSWR from "swr";
import { 
  Save, 
  Upload, 
  Book,
  FileText,
  User,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { bibliotecaApi, BibliotecaRecurso } from "@/lib/api/biblioteca";
import { docentesApi, Docente } from "@/lib/api/docentes";
import { getStorageUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/error-handler";

interface BibliotecaFormProps {
  initialData?: BibliotecaRecurso;
  isEditing?: boolean;
}

export default function BibliotecaForm({ initialData, isEditing = false }: BibliotecaFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria_id: "",
    docente_id: "",
    recomendador_externo: "",
    fecha_subida: new Date().toLocaleDateString('en-CA'),
    estado: "activo" as "activo" | "borrador",
    orden: 0,
  });

  // Files State
  const [portadaFile, setPortadaFile] = useState<File | null>(null);
  const [portadaPreview, setPortadaPreview] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState<string>("");

  const portadaInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Sincronizar datos iniciales (Especialmente para Edición)
  useEffect(() => {
    if (initialData) {
      setFormData({
        titulo: initialData.titulo || "",
        descripcion: initialData.descripcion || "",
        categoria_id: initialData.categoria_id?.toString() || "",
        docente_id: initialData.docente_id?.toString() || "",
        recomendador_externo: initialData.recomendador_externo || "",
        fecha_subida: initialData.fecha_subida ? initialData.fecha_subida.split('T')[0] : new Date().toLocaleDateString('en-CA'),
        estado: (initialData.estado as "activo" | "borrador") || "activo",
        orden: initialData.orden || 0,
      });
      if (initialData.imagen_portada_url) {
        setPortadaPreview(getStorageUrl(initialData.imagen_portada_url));
      }
      if (initialData.archivo_url) {
        setPdfName("Documento actual preservado");
      }
    }
  }, [initialData]);

  // Data dinámicas (Categorías y Docentes)
  const { data: categorias } = useSWR('/api/admin/biblioteca-categorias', () => bibliotecaApi.getCategorias());
  const { data: docentesResponse } = useSWR('/api/admin/docentes', () => docentesApi.getAll({ per_page: 100 }));
  const docentes = docentesResponse?.data as Docente[] | undefined;

  const handlePortadaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return showToast("Portada máxima 2MB", "error");
      setPortadaFile(file);
      setPortadaPreview(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") return showToast("Solo se permiten archivos PDF", "error");
      if (file.size > 50 * 1024 * 1024) return showToast("El PDF supera los 50MB", "error");
      setPdfFile(file);
      setPdfName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoria_id) return showToast("Selecciona una categoría", "error");
    if (!pdfFile && !isEditing) return showToast("Debes subir un archivo PDF", "error");

    setIsLoading(true);
    const data = new FormData();
    
    // Mapeo manual para asegurar limpieza de datos
    data.append("titulo", formData.titulo);
    data.append("descripcion", formData.descripcion || "");
    data.append("categoria_id", formData.categoria_id);
    data.append("fecha_subida", formData.fecha_subida);
    data.append("estado", formData.estado);
    data.append("orden", formData.orden.toString());
    
    if (formData.docente_id) {
      data.append("docente_id", formData.docente_id);
    } else if (formData.recomendador_externo) {
      data.append("recomendador_externo", formData.recomendador_externo);
    }
    
    if (portadaFile) data.append("imagen_portada", portadaFile);
    if (pdfFile) data.append("archivo", pdfFile);

    try {
      if (isEditing && initialData) {
        await bibliotecaApi.update(initialData.id, data);
        showToast("Recurso actualizado", "success");
      } else {
        await bibliotecaApi.create(data);
        showToast("Recurso creado con éxito", "success");
      }
      router.push("/admin/portal/biblioteca");
      router.refresh();
    } catch (err) {
      handleApiError(err, showToast, "Error al guardar recurso");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <Book className="w-5 h-5 text-brand-500" />
            Información del Recurso
          </h3>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-900">Título de la Obra</label>
            <input 
              required type="text" className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              placeholder="Ej: Metodología de la Investigación..."
              value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Categoría</label>
              <select 
                required className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl outline-none"
                value={formData.categoria_id} onChange={e => setFormData({...formData, categoria_id: e.target.value})}
              >
                <option value="">Seleccionar categoría...</option>
                {categorias?.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Fecha de Publicación</label>
              <input 
                required type="date" className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl outline-none"
                value={formData.fecha_subida} onChange={e => setFormData({...formData, fecha_subida: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-900">Descripción / Resumen</label>
            <textarea 
              rows={4} className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl outline-none resize-none"
              placeholder="Escribe un breve resumen sobre el contenido..."
              value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-500" />
            Diferencial: Recomendado Por
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900 text-brand-600">Docente de la Facultad</label>
              <select 
                className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-100 rounded-xl outline-none"
                value={formData.docente_id} onChange={e => setFormData({...formData, docente_id: e.target.value, recomendador_externo: ""})}
              >
                <option value="">Ninguno seleccionado...</option>
                {docentes?.map((doc) => <option key={doc.id} value={doc.id}>{doc.nombre_completo}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Especialista Externo</label>
              <input 
                type="text" className="w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl outline-none"
                placeholder="Nombre del especialista..."
                disabled={!!formData.docente_id}
                value={formData.recomendador_externo} onChange={e => setFormData({...formData, recomendador_externo: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-brand-950 p-6 rounded-2xl shadow-xl space-y-4 text-white">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4 text-uncp-gold" />
            Archivo PDF
          </h3>
          <div 
            onClick={() => pdfInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center cursor-pointer hover:border-uncp-gold/50 transition-all bg-white/5"
          >
            {pdfName ? (
              <div className="space-y-2">
                <div className="w-10 h-10 bg-uncp-gold rounded-full flex items-center justify-center mx-auto text-brand-950"><FileText className="w-5 h-5" /></div>
                <p className="text-xs font-bold truncate px-2">{pdfName}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto opacity-20" />
                <p className="text-xs font-bold">Subir Documento PDF</p>
              </div>
            )}
          </div>
          <input type="file" accept=".pdf" className="hidden" ref={pdfInputRef} onChange={handlePdfChange} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-brand-950 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-brand-500" />
            Portada del Libro
          </h3>
          <div 
            onClick={() => portadaInputRef.current?.click()}
            className="aspect-[3/4] rounded-xl border-2 border-dashed border-border overflow-hidden relative group cursor-pointer hover:border-brand-500 transition-all bg-muted/30"
          >
            {portadaPreview ? (
              <UnoptImage 
                src={portadaPreview} 
                alt="Preview" 
                fill
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                <Upload className="w-6 h-6 mb-2 opacity-20" />
                <p className="text-[10px] font-bold">Cargar Portada (WebP)</p>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" className="hidden" ref={portadaInputRef} onChange={handlePortadaChange} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border">
              <span className="text-xs font-bold">Estado</span>
              <select 
                className="bg-white border border-border rounded-lg text-xs font-bold py-1 px-2 outline-none"
                value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value as "activo" | "borrador"})}
              >
                <option value="activo">Activo</option>
                <option value="borrador">Borrador</option>
              </select>
            </div>
            <button 
              type="submit" disabled={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-muted text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isEditing ? "Guardar Cambios" : "Publicar Recurso"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
