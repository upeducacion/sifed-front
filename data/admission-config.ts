export interface AdmissionData {
  period: string;
  type: "maestria" | "doctorado";
  price: string;
  paymentCode: string;
  closingDate: string;
  examDate: string;
  documentUrl: string;
  description: string;
  whatsappNumber?: string;
}

export const ADMISSION_CONFIG: Record<"maestria" | "doctorado", AdmissionData> = {
  maestria: {
    period: "2026-I",
    type: "maestria",
    price: "S/ 211.00",
    paymentCode: "1671",
    closingDate: "27 de marzo de 2026",
    examDate: "29 de marzo de 2026",
    documentUrl: "/documents/admision/guia-admision-maestria-2026-1.pdf",
    description: "Guía detallada para el proceso de ingreso a nuestras Maestrías. Incluye requisitos, cronograma completo y pasos para el pago de derechos e inscripción virtual.",
  },
  doctorado: {
    period: "2026-I",
    type: "doctorado",
    price: "S/ 231.00",
    paymentCode: "1672",
    closingDate: "28 de marzo de 2026",
    examDate: "30 de marzo de 2026",
    documentUrl: "/documents/admision/guia-admision-doctorado-2026-1.pdf",
    description: "Accede al máximo grado académico. Esta guía orienta cada etapa del proceso de admisión al Doctorado en Ciencias de la Educación, incluyendo perfil de proyecto e investigación.",
  },
};
