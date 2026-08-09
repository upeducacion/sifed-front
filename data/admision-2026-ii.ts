/**
 * Campaña de captación "Admisión 2026-II".
 *
 * Concepto distinto a `data/admission-config.ts`: aquel describe la configuración
 * de admisión que consumen las páginas de programa (costos, cronograma, guía local)
 * y lo importan 10+ vistas. Este módulo solo declara los brochures descargables de
 * la campaña flotante, por lo que se mantiene separado para no alterar esa data.
 */

export interface BrochureAdmision {
  id: "maestrias" | "doctorados";
  /** Rótulo visible de la tarjeta. */
  titulo: string;
  /** Descriptor real del programa, tomado del brochure. Se usa en el aria-label. */
  descriptor: string;
  /** Portada extraída de la página 1 del brochure original. */
  imagen: string;
  /** ID del archivo en Google Drive. */
  driveFileId: string;
  /** Nombre sugerido para el archivo descargado. */
  nombreArchivo: string;
}

export const BROCHURES_ADMISION_2026_II: BrochureAdmision[] = [
  {
    id: "maestrias",
    titulo: "Maestrías",
    descriptor: "Maestrías en Educación",
    imagen: "/images/admision/maestrias-2026-ii.webp",
    driveFileId: "1rAY8eQmq7Ie5ZrNXkhbVS_gl5cKK47nq",
    nombreArchivo: "Inscripcion-Maestrias-2026-II-UPG-UNCP.pdf",
  },
  {
    id: "doctorados",
    titulo: "Doctorados",
    descriptor: "Doctorado en Ciencias de la Educación",
    imagen: "/images/admision/doctorado-2026-ii.webp",
    driveFileId: "1eLYE7WI20Jvo_eHwZ8A8am-QsGgJY0ye",
    nombreArchivo: "Inscripcion-Doctorado-2026-II-UPG-UNCP.pdf",
  },
];

export const ADMISION_2026_II = {
  periodo: "2026-II",
  /** Texto exacto solicitado para el botón flotante y el título del modal. */
  etiqueta: "Admisión 2026-II",
  eyebrow: "Unidad de Posgrado · UNCP",
  descripcion:
    "Descarga el brochure con los requisitos y los pasos de inscripción del proceso de admisión.",
  brochures: BROCHURES_ADMISION_2026_II,
};

/**
 * Construye la URL de descarga directa de un archivo público de Google Drive.
 *
 * Los enlaces `/file/d/<id>/view` abren el visor de Drive; el endpoint
 * `drive.usercontent.google.com/download` responde con
 * `Content-Disposition: attachment`, por lo que el navegador descarga el archivo
 * sin navegar fuera de la página ni abrir una pestaña.
 */
export function buildDriveDownloadUrl(fileId: string): string {
  return `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
}
