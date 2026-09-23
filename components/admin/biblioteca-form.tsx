"use client";

import { useState, useRef } from "react";
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
  Image as ImageIcon,
  Layers,
  BadgeInfo,
} from "lucide-react";
import { bibliotecaApi, Recurso, Coleccion, TipoRecurso } from "@/lib/api/biblioteca";
import { docentesApi, Docente } from "@/lib/api/docentes";
import { getStorageUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/error-handler";
import { LICENCIA_OPTIONS } from "@/lib/repositorio/tipos";
import TagInput from "@/components/admin/tag-input";

interface BibliotecaFormProps {
  initialData?: Recurso;
  isEditing?: boolean;
}

const inputClass = "w-full px-4 py-2.5 bg-muted/30 border border-border rounded-xl focus:ring-2 focus:ring-brand-500/20 outline-none transition-all";

function buildInitialFormData(initialData?: Recurso) {
  return {
    titulo: initialData?.titulo || "",
    descripcion: initialData?.descripcion || "",
    categoria_id: initialData?.categoria_id?.toString() || "",
    docente_id: initialData?.docente_id?.toString() || "",
    recomendador_externo: initialData?.recomendador_externo || "",
    fecha_subida: initialData?.fecha_subida ? initialData.fecha_subida.split("T")[0] : new Date().toLocaleDateString("en-CA"),
    estado: (initialData?.estado as "activo" | "borrador") || "activo",
    orden: initialData?.orden || 0,
    coleccion: initialData?.coleccion || ("biblioteca" as Coleccion),
    tipo: initialData?.tipo || ("libro" as TipoRecurso),
    programa_id: initialData?.programa_id?.toString() || "",
    asesor: initialData?.asesor || "",
    anio: initialData?.anio || new Date().getFullYear(),
    idioma: initialData?.idioma || "es",
    editorial: initialData?.editorial || "",
    doi: initialData?.doi || "",
    url_externa: initialData?.url_externa || "",
    licencia: initialData?.licencia || "",
    paginas: initialData?.paginas ? String(initialData.paginas) : "",
  };
}

export default function BibliotecaForm({ initialData, isEditing = false }: Readonly<BibliotecaFormProps>) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // `initialData` ya está disponible en el primer render (la página de edición
  // espera a que SWR resuelva antes de montar el formulario), así que el
  // estado se inicializa de forma perezosa en vez de sincronizarlo en un efecto.
  const [formData, setFormData] = useState(() => buildInitialFormData(initialData));
  const [autores, setAutores] = useState<string[]>(() => initialData?.autores || []);
  const [palabrasClave, setPalabrasClave] = useState<string[]>(() => initialData?.palabras_clave || []);

  const [portadaFile, setPortadaFile] = useState<File | null>(null);
  const [portadaPreview, setPortadaPreview] = useState<string>(() =>
    initialData?.imagen_portada_url ? getStorageUrl(initialData.imagen_portada_url) : ""
  );
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfName, setPdfName] = useState<string>(() => (initialData?.archivo_url ? "Documento actual preservado" : ""));

  const portadaInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const { data: categorias } = useSWR("/api/admin/biblioteca-categorias", () => bibliotecaApi.getCategorias());
  const { data: docentesResponse } = useSWR("/api/admin/docentes", () => docentesApi.getAll({ per_page: 100 }));
  const { data: opciones } = useSWR("/api/admin/biblioteca-opciones", () => bibliotecaApi.getOpciones());
  const docentes = docentesResponse?.data as Docente[] | undefined;

  const requiereArchivo = !formData.doi && !formData.url_externa;

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
    if (autores.length === 0) return showToast("Agrega al menos un autor", "error");
    if (!pdfFile && !isEditing && requiereArchivo) {
      return showToast("Sube un PDF o indica un DOI / URL externa", "error");
    }

    setIsLoading(true);
    const data = new FormData();

    data.append("titulo", formData.titulo);
    data.append("descripcion", formData.descripcion || "");
    data.append("categoria_id", formData.categoria_id);
    data.append("fecha_subida", formData.fecha_subida);
    data.append("estado", formData.estado);
    data.append("orden", formData.orden.toString());
    data.append("coleccion", formData.coleccion);
    data.append("tipo", formData.tipo);
    data.append("anio", String(formData.anio));
    data.append("idioma", formData.idioma);
    data.append("autores", JSON.stringify(autores));
    data.append("palabras_clave", JSON.stringify(palabrasClave));

    if (formData.programa_id) data.append("programa_id", formData.programa_id);
    if (formData.asesor) data.append("asesor", formData.asesor);
    if (formData.editorial) data.append("editorial", formData.editorial);
    if (formData.doi) data.append("doi", formData.doi);
    if (formData.url_externa) data.append("url_externa", formData.url_externa);
    if (formData.licencia) data.append("licencia", formData.licencia);
    if (formData.paginas) data.append("paginas", formData.paginas);

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

  const tipos = opciones?.tipos ?? [];
  const colecciones = opciones?.colecciones ?? [];
  const programas = opciones?.programas ?? [];

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Clasificación */}
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-500" />
            Clasificación
          </h3>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-900">Título de la Obra</label>
            <input
              required type="text" className={inputClass}
              placeholder="Ej: Metodología de la Investigación..."
              value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Colección</label>
              <select
                required className={inputClass}
                value={formData.coleccion} onChange={(e) => setFormData({ ...formData, coleccion: e.target.value as Coleccion })}
              >
                {colecciones.length > 0
                  ? colecciones.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)
                  : (<><option value="biblioteca">Biblioteca</option><option value="investigacion">Investigación</option></>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Tipo de documento</label>
              <select
                required className={inputClass}
                value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoRecurso })}
              >
                {tipos.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Categoría</label>
              <select
                required className={inputClass}
                value={formData.categoria_id} onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
              >
                <option value="">Seleccionar...</option>
                {categorias?.map((cat) => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Programa (opcional)</label>
              <select
                className={inputClass}
                value={formData.programa_id} onChange={(e) => setFormData({ ...formData, programa_id: e.target.value })}
              >
                <option value="">Sin programa asociado</option>
                {programas.map((p) => <option key={p.id} value={p.id}>{p.titulo}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Fecha de Publicación</label>
              <input
                required type="date" className={inputClass}
                value={formData.fecha_subida} onChange={(e) => setFormData({ ...formData, fecha_subida: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Autoría */}
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-500" />
            Autoría
          </h3>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-900">Autores</label>
            <TagInput value={autores} onChange={setAutores} placeholder="Apellido, Nombre y Enter…" hint='Formato sugerido: "Apellido, Nombre"' />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-900">Asesor (opcional)</label>
            <input
              type="text" className={inputClass}
              placeholder="Apellido, Nombre"
              value={formData.asesor} onChange={(e) => setFormData({ ...formData, asesor: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-border">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-600">Docente de la Facultad (recomienda)</label>
              <select
                className="w-full px-4 py-2.5 bg-brand-50/50 border border-brand-100 rounded-xl outline-none"
                value={formData.docente_id} onChange={(e) => setFormData({ ...formData, docente_id: e.target.value, recomendador_externo: "" })}
              >
                <option value="">Ninguno seleccionado...</option>
                {docentes?.map((doc) => <option key={doc.id} value={doc.id}>{doc.nombre_completo}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Especialista Externo</label>
              <input
                type="text" className={inputClass}
                placeholder="Nombre del especialista..."
                disabled={!!formData.docente_id}
                value={formData.recomendador_externo} onChange={(e) => setFormData({ ...formData, recomendador_externo: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Publicación */}
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <BadgeInfo className="w-5 h-5 text-brand-500" />
            Publicación
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Año</label>
              <input
                required type="number" className={inputClass}
                value={formData.anio} onChange={(e) => setFormData({ ...formData, anio: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Idioma</label>
              <input
                type="text" className={inputClass} placeholder="es"
                value={formData.idioma} onChange={(e) => setFormData({ ...formData, idioma: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">Páginas</label>
              <input
                type="number" className={inputClass}
                value={formData.paginas} onChange={(e) => setFormData({ ...formData, paginas: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-900">Editorial / Fuente</label>
            <input
              type="text" className={inputClass} placeholder="Editorial, revista o institución"
              value={formData.editorial} onChange={(e) => setFormData({ ...formData, editorial: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">DOI</label>
              <input
                type="text" className={inputClass} placeholder="10.xxxx/xxxxx"
                value={formData.doi} onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-900">URL externa</label>
              <input
                type="url" className={inputClass} placeholder="https://…"
                value={formData.url_externa} onChange={(e) => setFormData({ ...formData, url_externa: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-900">Licencia</label>
            <select
              className={inputClass}
              value={formData.licencia} onChange={(e) => setFormData({ ...formData, licencia: e.target.value })}
            >
              <option value="">Sin especificar</option>
              {LICENCIA_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-white p-6 rounded-lg border border-border shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-brand-950 flex items-center gap-2">
            <Book className="w-5 h-5 text-brand-500" />
            Contenido
          </h3>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-900">Resumen</label>
            <textarea
              rows={4} className={`${inputClass} resize-none`}
              placeholder="Escribe un breve resumen sobre el contenido..."
              value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-900">Palabras clave</label>
            <TagInput value={palabrasClave} onChange={setPalabrasClave} placeholder="palabra clave y Enter…" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-brand-950 p-6 rounded-lg shadow-xl space-y-4 text-white">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4 text-uncp-gold" />
            Archivo PDF {!requiereArchivo && <span className="normal-case font-medium text-white/60">(opcional: hay DOI/URL)</span>}
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

        <div className="bg-white p-6 rounded-lg border border-border shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-brand-950 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-brand-500" />
            Portada del Libro
          </h3>
          <div
            onClick={() => portadaInputRef.current?.click()}
            className="aspect-[3/4] rounded-xl border-2 border-dashed border-border overflow-hidden relative group cursor-pointer hover:border-brand-500 transition-all bg-muted/30"
          >
            {portadaPreview ? (
              <UnoptImage src={portadaPreview} alt="Preview" fill className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                <Upload className="w-6 h-6 mb-2 opacity-20" />
                <p className="text-[10px] font-bold">Cargar Portada (WebP)</p>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" className="hidden" ref={portadaInputRef} onChange={handlePortadaChange} />
        </div>

        <div className="bg-white p-6 rounded-lg border border-border shadow-sm space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border">
              <span className="text-xs font-bold">Estado</span>
              <select
                className="bg-white border border-border rounded-lg text-xs font-bold py-1 px-2 outline-none"
                value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value as "activo" | "borrador" })}
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
