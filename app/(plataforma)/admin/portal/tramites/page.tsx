"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
  CheckSquare,
  ChevronDown,
  ChevronRight,
  CloudUpload,
  Download,
  File,
  FileText,
  Folder,
  FolderPlus,
  GripVertical,
  Pencil,
  Search,
  Square,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { documentosApi } from "@/lib/api/documentos";
import type { DocumentFolder, DocumentoCategoria, DocumentoNormativo } from "@/types/documento-normativo";
import { getStorageUrl, cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/error-handler";

const procedureOptions = [
  { value: "constancia-egresado", label: "Constancia de egresado" },
  { value: "record-academico", label: "Récord académico" },
  { value: "reserva-matricula", label: "Reserva de matrícula" },
  { value: "mesa-de-partes", label: "Mesa de partes" },
];

function folderChildren(folders: DocumentFolder[], parentId: number | null) {
  return folders.filter((folder) => folder.parent_id === parentId);
}

function getFolderPath(folders: DocumentFolder[], folderId: number | null | undefined): string[] {
  const path: string[] = [];
  let current = folders.find((folder) => folder.id === folderId);

  while (current) {
    path.unshift(current.name);
    current = folders.find((folder) => folder.id === current?.parent_id);
  }

  return path;
}

function setDocumentDragPreview(event: React.DragEvent<HTMLElement>, draggedDocument: DocumentoNormativo, documentCount: number) {
  const preview = window.document.createElement("div");
  preview.style.position = "absolute";
  preview.style.top = "-1000px";
  preview.style.left = "-1000px";
  preview.style.display = "flex";
  preview.style.width = "280px";
  preview.style.alignItems = "center";
  preview.style.gap = "12px";
  preview.style.padding = "12px 14px";
  preview.style.border = "1px solid rgba(194, 157, 75, 0.55)";
  preview.style.borderRadius = "14px";
  preview.style.background = "#ffffff";
  preview.style.boxShadow = "0 14px 30px rgba(15, 35, 65, 0.18)";
  preview.style.color = "#07182f";

  const icon = window.document.createElement("div");
  icon.textContent = draggedDocument.extension_archivo.toUpperCase().slice(0, 4);
  icon.style.display = "flex";
  icon.style.height = "34px";
  icon.style.width = "34px";
  icon.style.flexShrink = "0";
  icon.style.alignItems = "center";
  icon.style.justifyContent = "center";
  icon.style.borderRadius = "10px";
  icon.style.background = "#fff1f2";
  icon.style.color = "#e11d48";
  icon.style.fontSize = "9px";
  icon.style.fontWeight = "800";

  const details = window.document.createElement("div");
  details.style.minWidth = "0";
  const title = window.document.createElement("strong");
  title.textContent = documentCount > 1 ? `${documentCount} documentos seleccionados` : draggedDocument.titulo;
  title.style.display = "block";
  title.style.overflow = "hidden";
  title.style.textOverflow = "ellipsis";
  title.style.whiteSpace = "nowrap";
  title.style.fontSize = "12px";
  const location = window.document.createElement("span");
  location.textContent = "Suelta en una carpeta para mover";
  location.style.display = "block";
  location.style.marginTop = "3px";
  location.style.color = "#8a6b20";
  location.style.fontSize = "10px";
  location.style.fontWeight = "700";
  details.append(title, location);
  preview.append(icon, details);
  window.document.body.appendChild(preview);
  event.dataTransfer.setDragImage(preview, 22, 22);
  window.setTimeout(() => preview.remove(), 0);
}

function FolderTree({ folders, selectedId, isDragging, dragOverId, onSelect, onDrop, onDragEnter, onDragLeave, onRename, onDelete }: Readonly<{ folders: DocumentFolder[]; selectedId: number | null; isDragging: boolean; dragOverId: number | null; onSelect: (id: number | null) => void; onDrop: (folderId: number | null, documentIds: number[]) => void; onDragEnter: (folderId: number) => void; onDragLeave: () => void; onRename: (folder: DocumentFolder) => void; onDelete: (folder: DocumentFolder) => void }>) {
  const [expanded, setExpanded] = useState<number[]>([]);
  const toggleExpanded = (folderId: number, isOpen: boolean, hasChildren: boolean) => {
    if (!hasChildren) return;
    setExpanded((current) => isOpen ? current.filter((id) => id !== folderId) : [...current, folderId]);
  };
  const handleDropLeave = (event: React.DragEvent<HTMLButtonElement>) => {
    const relatedTarget = event.relatedTarget;
    if (relatedTarget instanceof Node && event.currentTarget.contains(relatedTarget)) return;
    onDragLeave();
  };

  const render = (parentId: number | null, depth = 0): React.ReactNode => folderChildren(folders, parentId).map((folder) => {
    const hasChildren = folders.some((child) => child.parent_id === folder.id);
    const isExpanded = expanded.includes(folder.id);
    const isSelected = selectedId === folder.id;
    const isDropTarget = dragOverId === folder.id;
    const folderCountClassName = cn("text-muted-foreground", isDropTarget && "text-brand-950", !isDropTarget && isSelected && "text-brand-200");
    const folderCountLabel = isDropTarget ? "Soltar aquí" : String((folder.documents_count ?? 0) + (folder.children_count ?? 0));

    return (
      <div key={folder.id}>
        <div className={cn("group relative flex items-center gap-1 rounded-xl px-2 py-1.5 text-sm transition", isSelected ? "bg-brand-950 text-white" : "text-brand-800 hover:bg-brand-50", isDropTarget && "bg-uncp-gold/10")} style={{ paddingLeft: `${depth * 16 + 8}px` }}>
          {isDragging && <button type="button" onDragEnter={(event) => { event.preventDefault(); onDragEnter(folder.id); }} onDragOver={(event) => event.preventDefault()} onDragLeave={handleDropLeave} onDrop={(event) => { event.preventDefault(); onDrop(folder.id, JSON.parse(event.dataTransfer.getData("application/x-document-ids") || "[]")); onDragLeave(); }} className={cn("absolute inset-0 z-30 rounded-xl border-2 border-transparent bg-transparent transition-colors duration-150", isDropTarget && "border-uncp-gold bg-uncp-gold/20 shadow-[0_0_0_4px_rgba(194,157,75,0.14)]")} aria-label={`Soltar documento en ${folder.name}`}>{isDropTarget && <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-brand-950 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-uncp-gold shadow-sm">Soltar aquí</span>}</button>}
          <button type="button" onClick={() => toggleExpanded(folder.id, isExpanded, hasChildren)} className={cn("flex h-6 w-6 items-center justify-center rounded-md", !hasChildren && "invisible")} aria-label={isExpanded ? "Contraer carpeta" : "Expandir carpeta"}>
            {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
          <button type="button" onClick={() => onSelect(folder.id)} className={cn("relative flex min-w-0 flex-1 items-center gap-2 rounded-lg text-left transition-all duration-200", isDropTarget && "scale-[1.04] bg-uncp-gold/15 px-2 py-2 shadow-[0_0_0_2px_rgba(194,157,75,0.35)]") }>
            <Folder className={cn("h-4 w-4 shrink-0", isSelected ? "text-uncp-gold" : "text-amber-500")} />
            <span className="truncate font-semibold">{folder.name}</span>
            <span className={cn("ml-auto text-[10px] font-bold", folderCountClassName)}>{folderCountLabel}</span>
          </button>
          <div className="hidden items-center gap-0.5 group-hover:flex">
            <button type="button" onClick={(event) => { event.stopPropagation(); onRename(folder); }} className={cn("rounded-md p-1", isSelected ? "text-brand-200 hover:bg-white/10" : "text-muted-foreground hover:bg-brand-100")} title={`Renombrar ${folder.name}`}><Pencil className="h-3 w-3" /></button>
            <button type="button" onClick={(event) => { event.stopPropagation(); onDelete(folder); }} className={cn("rounded-md p-1", isSelected ? "text-brand-200 hover:bg-white/10" : "text-muted-foreground hover:bg-red-50 hover:text-red-600")} title={`Eliminar ${folder.name}`}><Trash2 className="h-3 w-3" /></button>
          </div>
        </div>
        {isExpanded && render(folder.id, depth + 1)}
      </div>
    );
  });

  return <div className="space-y-0.5">{render(null)}</div>;
}

export default function TramitesAdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<number[]>([]);
  const [draggedDocumentId, setDraggedDocumentId] = useState<number | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<number | null>(null);
  const [dragOverRoot, setDragOverRoot] = useState(false);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"folder" | "upload" | null>(null);
  const [folderName, setFolderName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState(procedureOptions[0].value);
  const [categoryId, setCategoryId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { data: folders = [], mutate: mutateFolders } = useSWR("/admin/document-folders/tree", documentosApi.getFolders);
  const { data: categories = [] } = useSWR<DocumentoCategoria[]>("/admin/documento-categorias", documentosApi.getCategoriasAdmin);
  const { data: documentsResponse, mutate: mutateDocuments, isLoading } = useSWR(
    ["/admin/documentos-normativos", selectedFolderId, search],
    () => documentosApi.getAll({ ...(selectedFolderId !== null ? { folder_id: selectedFolderId } : {}), search: search || undefined, per_page: 100 })
  );
  const documents = (documentsResponse?.data ?? []) as DocumentoNormativo[];
  const selectedFolder = folders.find((folder) => folder.id === selectedFolderId);
  const breadcrumbs = useMemo(() => {
    const result: DocumentFolder[] = [];
    let current = selectedFolder;
    while (current) {
      result.unshift(current);
      current = folders.find((folder) => folder.id === current?.parent_id);
    }
    return result;
  }, [folders, selectedFolder]);

  const refresh = () => {
    void mutateFolders();
    void mutateDocuments();
    setSelectedDocumentIds([]);
  };

  const moveDocuments = async (documentIds: number[], folderId: number | null) => {
    if (documentIds.length === 0) return;
    setIsSaving(true);
    try {
      await Promise.all(documentIds.map((documentId) => documentosApi.move(documentId, folderId)));
      refresh();
      showToast(`${documentIds.length} documento${documentIds.length === 1 ? "" : "s"} movido${documentIds.length === 1 ? "" : "s"}`, "success");
    } catch (error) {
      handleApiError(error, showToast);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDrop = (folderId: number | null, documentIds: number[]) => {
    void moveDocuments(documentIds, folderId);
    setDragOverFolderId(null);
    setDragOverRoot(false);
  };

  const handleFolderDragEnter = (folderId: number) => {
    setDragOverFolderId(folderId);
    setDragOverRoot(false);
  };

  const startDragging = (documentId: number, event: React.DragEvent<HTMLElement>, documentIds: number[]) => {
    setDraggedDocumentId(documentId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-document-ids", JSON.stringify(documentIds));

    const draggedDocument = documents.find((document) => document.id === documentId);
    if (!draggedDocument) return;
    setDocumentDragPreview(event, draggedDocument, documentIds.length);
  };

  const stopDragging = () => {
    setDraggedDocumentId(null);
    setDragOverFolderId(null);
    setDragOverRoot(false);
  };

  const toggleDocumentSelection = (documentId: number) => {
    setSelectedDocumentIds((current) => current.includes(documentId) ? current.filter((id) => id !== documentId) : [...current, documentId]);
  };

  const toggleAllDocuments = () => {
    const allDocumentsSelected = documents.length > 0 && documents.every((document) => selectedDocumentIds.includes(document.id));
    setSelectedDocumentIds(allDocumentsSelected ? [] : documents.map((document) => document.id));
  };

  const renameFolder = async (folder: DocumentFolder) => {
    const name = window.prompt("Nuevo nombre de carpeta", folder.name)?.trim();
    if (!name || name === folder.name) return;
    try {
      await documentosApi.updateFolder(folder.id, { name });
      await mutateFolders();
      showToast("Carpeta renombrada", "success");
    } catch (error) {
      handleApiError(error, showToast);
    }
  };

  const deleteFolderByItem = async (folder: DocumentFolder) => {
    if (!window.confirm(`¿Eliminar la carpeta “${folder.name}”?`)) return;
    try {
      await documentosApi.deleteFolder(folder.id);
      if (selectedFolderId === folder.id) setSelectedFolderId(folder.parent_id);
      await mutateFolders();
      showToast("Carpeta eliminada", "success");
    } catch (error) {
      handleApiError(error, showToast);
    }
  };

  const downloadSelected = () => {
    documents.filter((document) => selectedDocumentIds.includes(document.id)).forEach((document) => {
      window.open(getStorageUrl(document.archivo_path), "_blank", "noopener,noreferrer");
    });
  };

  const deleteSelected = async () => {
    if (selectedDocumentIds.length === 0 || !window.confirm(`¿Eliminar ${selectedDocumentIds.length} documentos seleccionados?`)) return;
    setIsSaving(true);
    try {
      await Promise.all(selectedDocumentIds.map((documentId) => documentosApi.delete(documentId)));
      refresh();
      showToast("Documentos eliminados", "success");
    } catch (error) {
      handleApiError(error, showToast);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const targetFolderId = event.target.value;
    event.currentTarget.value = "";
    if (targetFolderId) void moveDocuments(selectedDocumentIds, Number(targetFolderId));
  };

  const selectionBar = selectedDocumentIds.length === 0 ? null : (
    <div className="flex flex-col gap-3 border-b border-brand-100 bg-brand-50 px-5 py-3 md:flex-row md:items-center md:justify-between">
      <button type="button" onClick={() => setSelectedDocumentIds([])} className="group inline-flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-bold text-brand-900 transition hover:bg-white/70" aria-label="Deseleccionar todos los documentos"><CheckSquare className="h-4 w-4 text-brand-600 transition group-hover:text-brand-800" /> {selectedDocumentIds.length} seleccionados</button>
      <div className="flex flex-wrap items-center gap-2">
        <select defaultValue="" onChange={handleMoveSelection} disabled={isSaving} className="h-9 rounded-lg border border-brand-200 bg-white px-2 text-xs font-bold text-brand-800" aria-label="Mover documentos seleccionados">
          <option value="">Mover a carpeta...</option>
          {folders.filter((folder) => !selectedFolderId || folder.id !== selectedFolderId).map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
        </select>
        <button type="button" onClick={downloadSelected} className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-3 py-2 text-xs font-bold text-brand-800 hover:bg-brand-100"><Download className="h-3.5 w-3.5" /> Descargar</button>
        <button type="button" onClick={deleteSelected} disabled={isSaving} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /> Eliminar</button>
        <button type="button" onClick={() => setSelectedDocumentIds([])} className="rounded-lg p-2 text-muted-foreground hover:bg-white" title="Cancelar selección"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );

  const createFolder = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!folderName.trim()) return;
    setIsSaving(true);
    try {
      await documentosApi.createFolder({ name: folderName.trim(), parent_id: selectedFolderId, type });
      setFolderName("");
      setModal(null);
      await mutateFolders();
      showToast("Carpeta creada correctamente", "success");
    } catch (error) {
      handleApiError(error, showToast);
    } finally {
      setIsSaving(false);
    }
  };

  const uploadDocument = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !title.trim() || !categoryId) return;
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("titulo", title.trim());
      formData.append("archivo", file);
      formData.append("folder_id", String(selectedFolderId ?? ""));
      formData.append("documento_categoria_id", categoryId);
      formData.append("type", type);
      formData.append("estado", "vigente");
      formData.append("is_public", "1");
      await documentosApi.create(formData);
      setFile(null);
      setTitle("");
      setModal(null);
      refresh();
      showToast("Documento subido correctamente", "success");
    } catch (error) {
      handleApiError(error, showToast);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteDocument = async (document: DocumentoNormativo) => {
    if (!window.confirm(`¿Eliminar “${document.titulo}”?`)) return;
    try {
      await documentosApi.delete(document.id);
      await mutateDocuments();
      showToast("Documento eliminado", "success");
    } catch (error) {
      handleApiError(error, showToast);
    }
  };

  let documentContent: React.ReactNode;
  if (isLoading) {
    documentContent = <div className="flex h-80 items-center justify-center text-sm text-muted-foreground">Cargando documentos...</div>;
  } else if (documents.length === 0) {
    documentContent = <div className="flex h-80 flex-col items-center justify-center px-6 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand-50 text-brand-400"><Folder className="h-8 w-8" /></div><h2 className="mt-4 font-serif text-xl font-black">Esta carpeta está vacía</h2><p className="mt-2 max-w-sm text-sm text-muted-foreground">Sube un documento o crea una subcarpeta para empezar a ordenar este espacio.</p><button type="button" onClick={() => setModal("upload")} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-950 px-4 py-2.5 text-sm font-bold text-white"><Upload className="h-4 w-4" /> Subir documento</button></div>;
  } else {
    documentContent = <div className="divide-y divide-slate-100">{documents.map((document) => {
      const isSelected = selectedDocumentIds.includes(document.id);
      const draggedIds = selectedDocumentIds.includes(document.id) ? selectedDocumentIds : [document.id];
      const isBeingDragged = draggedDocumentId === document.id || (draggedDocumentId !== null && selectedDocumentIds.includes(document.id));
      const folderPath = getFolderPath(folders, document.folder_id);
      return <article key={document.id} draggable onDragStart={(event) => startDragging(document.id, event, draggedIds)} onDragEnd={stopDragging} className={cn("group flex cursor-grab items-center gap-3 px-4 py-4 transition active:cursor-grabbing md:px-5", isSelected ? "bg-brand-50" : "hover:bg-slate-50", isBeingDragged && "scale-[0.985] opacity-45")}><GripVertical className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-brand-400" aria-hidden="true" /><button type="button" onClick={() => toggleDocumentSelection(document.id)} className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-slate-200" title={isSelected ? "Quitar selección" : "Seleccionar documento"}>{isSelected ? <CheckSquare className="h-4 w-4 text-brand-600" /> : <Square className="h-4 w-4" />}</button><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500"><FileText className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-bold text-brand-950">{document.titulo}</h3><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">{document.is_public ? "Publicado" : "Privado"}</span></div><p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground"><span>{document.extension_archivo.toUpperCase()}</span><span>·</span><span>{document.categoria?.nombre || "Sin categoría"}</span>{selectedFolderId === null && <><span>·</span><Folder className="h-3 w-3 shrink-0 text-amber-500" /><span className="truncate font-medium text-brand-600">{folderPath.length > 0 ? folderPath.join(" / ") : "Raíz"}</span></>}</p></div><button type="button" onClick={() => router.push(`/admin/portal/documentos-normativos/${document.id}/edit`)} className="rounded-lg p-2 text-muted-foreground opacity-0 transition hover:bg-brand-50 hover:text-brand-700 group-hover:opacity-100" title="Editar"><Pencil className="h-4 w-4" /></button><a href={getStorageUrl(document.archivo_path)} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-muted-foreground opacity-0 transition hover:bg-brand-50 hover:text-brand-700 group-hover:opacity-100" title="Descargar"><Download className="h-4 w-4" /></a><button type="button" onClick={() => deleteDocument(document)} className="rounded-lg p-2 text-muted-foreground opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100" title="Eliminar"><Trash2 className="h-4 w-4" /></button></article>;
    })}</div>;
  }

  return (
    <main className="min-h-full bg-[#f5f7fa] p-5 text-brand-950 md:p-8">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">Biblioteca de trámites</p>
            <h1 className="mt-2 font-serif text-3xl font-black tracking-tight md:text-4xl">Documentos y formatos</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Organiza la documentación institucional en carpetas y publícala en el portal público.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setModal("folder")} className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-900 shadow-sm transition hover:border-brand-400 hover:bg-brand-50"><FolderPlus className="h-4 w-4" /> Nueva carpeta</button>
            <button type="button" onClick={() => setModal("upload")} className="inline-flex items-center gap-2 rounded-xl bg-brand-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"><CloudUpload className="h-4 w-4" /> Subir documento</button>
          </div>
        </header>

        <section className={cn("grid min-h-[620px] overflow-hidden rounded-lg border bg-white shadow-float transition-all duration-300 lg:grid-cols-[280px_minmax(0,1fr)]", draggedDocumentId ? "border-uncp-gold ring-4 ring-uncp-gold/10" : "border-slate-200")}>
          <aside className={cn("border-b border-slate-200 p-4 transition-colors duration-300 lg:border-b-0 lg:border-r", draggedDocumentId ? "bg-brand-50/80" : "bg-[#fbfcfe]")}>
            <div className="mb-5 flex items-center justify-between px-2"><span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Ubicaciones</span><button type="button" onClick={() => setModal("folder")} className="rounded-lg p-1.5 text-brand-500 hover:bg-brand-50" title="Nueva carpeta"><FolderPlus className="h-4 w-4" /></button></div>
            {draggedDocumentId !== null && <div className="mb-3 rounded-xl border border-dashed border-uncp-gold bg-uncp-gold/10 px-3 py-2 text-xs font-bold text-brand-900">Arrastra sobre una carpeta para mover el documento</div>}
            <button type="button" onClick={() => setSelectedFolderId(null)} onDragEnter={(event) => { event.preventDefault(); setDragOverFolderId(null); setDragOverRoot(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (!(event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))) setDragOverRoot(false); }} onDrop={(event) => { event.preventDefault(); handleDrop(null, JSON.parse(event.dataTransfer.getData("application/x-document-ids") || "[]")); }} className={cn("mb-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors duration-150", selectedFolderId === null ? "bg-brand-950 text-white" : "text-brand-800 hover:bg-brand-50", draggedDocumentId !== null && dragOverRoot && "bg-uncp-gold/15 ring-2 ring-uncp-gold/40")}><Folder className={cn("h-4 w-4", selectedFolderId === null ? "text-uncp-gold" : "text-amber-500")} /> {draggedDocumentId !== null && dragOverRoot ? "Soltar en la raíz" : "Todos los documentos"}</button>
            <FolderTree folders={folders} selectedId={selectedFolderId} isDragging={draggedDocumentId !== null} dragOverId={dragOverFolderId} onSelect={setSelectedFolderId} onDrop={handleDrop} onDragEnter={handleFolderDragEnter} onDragLeave={() => setDragOverFolderId(null)} onRename={renameFolder} onDelete={deleteFolderByItem} />
            <div className="mt-8 rounded-xl bg-brand-50 p-3 text-xs leading-relaxed text-brand-700"><p className="font-bold">Consejo de organización</p><p className="mt-1">Crea carpetas por trámite y subcarpetas para requisitos, formatos y guías.</p></div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-2 text-sm"><button type="button" onClick={() => setSelectedFolderId(null)} className="font-semibold text-muted-foreground hover:text-brand-800">Trámites</button>{breadcrumbs.map((folder) => <span key={folder.id} className="flex min-w-0 items-center gap-2"><ChevronRight className="h-4 w-4 shrink-0 text-slate-300" /><button type="button" onClick={() => setSelectedFolderId(folder.id)} className={cn("truncate font-bold", folder.id === selectedFolderId ? "text-brand-950" : "text-brand-500 hover:text-brand-800")}>{folder.name}</button></span>)}</div>
              <div className="relative block w-full lg:max-w-xs"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input id="document-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar documentos..." aria-label="Buscar documentos" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100" /></div>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 text-xs text-muted-foreground md:px-6"><button type="button" onClick={toggleAllDocuments} disabled={documents.length === 0} className="inline-flex items-center gap-2 font-semibold hover:text-brand-950 disabled:cursor-not-allowed disabled:opacity-50">{documents.length > 0 && documents.every((document) => selectedDocumentIds.includes(document.id)) ? <CheckSquare className="h-4 w-4 text-brand-600" /> : <Square className="h-4 w-4" />} {selectedFolder ? `${selectedFolder.documents_count ?? 0} documentos en esta carpeta` : `${documents.length} documentos encontrados`}</button><div className="flex items-center gap-3">{selectedFolder && <><button type="button" onClick={() => renameFolder(selectedFolder)} className="inline-flex items-center gap-1.5 font-bold text-brand-600 hover:text-brand-950"><Pencil className="h-3.5 w-3.5" /> Renombrar</button><button type="button" onClick={() => deleteFolderByItem(selectedFolder)} className="inline-flex items-center gap-1.5 font-bold text-red-600 hover:text-red-800"><Trash2 className="h-3.5 w-3.5" /> Eliminar</button></>}</div></div>

            {selectionBar}

            {documentContent}
          </div>
        </section>
      </div>

      {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/40 p-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700">{modal === "folder" ? "Organización" : "Biblioteca"}</p><h2 className="mt-1 font-serif text-2xl font-black">{modal === "folder" ? "Nueva carpeta" : "Subir documento"}</h2></div><button type="button" onClick={() => setModal(null)} className="rounded-lg p-2 text-muted-foreground hover:bg-slate-100" title="Cerrar"><X className="h-4 w-4" /></button></div>{modal === "folder" ? <form onSubmit={createFolder} className="mt-6 space-y-4"><label className="block text-sm font-bold">Nombre<input value={folderName} onChange={(event) => setFolderName(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" placeholder="Ej. Requisitos" /></label><label className="block text-sm font-bold">Trámite asociado<select value={type} onChange={(event) => setType(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-400">{procedureOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><button type="submit" disabled={isSaving} className="w-full rounded-xl bg-brand-950 py-3 text-sm font-bold text-white disabled:opacity-60">{isSaving ? "Creando..." : "Crear carpeta"}</button></form> : <form onSubmit={uploadDocument} className="mt-6 space-y-4"><label className="block text-sm font-bold">Título<input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" placeholder="Ej. Formato de solicitud" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-bold">Trámite<select value={type} onChange={(event) => setType(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-400">{procedureOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><label className="block text-sm font-bold">Categoría<select required value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-brand-400"><option value="">Selecciona...</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.nombre}</option>)}</select></label></div><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-brand-200 bg-brand-50/50 p-4 text-sm"><File className="h-5 w-5 text-brand-500" /><span className="min-w-0 flex-1 truncate">{file?.name || "Selecciona PDF, Word o Excel (máx. 50 MB)"}</span><input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="sr-only" /></label><button type="submit" disabled={isSaving || !file} className="w-full rounded-xl bg-brand-950 py-3 text-sm font-bold text-white disabled:opacity-60">{isSaving ? "Subiendo..." : "Subir y publicar"}</button></form>}</div></div>}
    </main>
  );
}