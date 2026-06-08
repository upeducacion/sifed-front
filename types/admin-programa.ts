import { Ciclo } from "./curriculum";

export interface HorarioClase {
  asignatura: string;
  dia_hora: string;
  docente: string;
}

export interface HorarioModulo {
  titulo_modulo: string;
  descripcion_general: string;
  clases_especificas: HorarioClase[];
}

export interface ProgramaDetallesJson {
  categoria: string;
  hero_pre_title: string;
  hero_titulo: string;
  hero_subtitle: string;
  hero_descripcion: string;
  hero_imagen_url?: string;
  contenido_pre_title: string;
  contenido_titulo: string;
  info_general: {
    duracion: string;
    modalidad: string;
    certificacion: string;
    totalCreditos: number;
  };
  acerca_de: string;
  objetivos: string[];
  perfil_estudiante: string[];
  perfil_egresado: string[];
  certificacion_detalle: string;
  admision: {
    costo_inscripcion: string;
    matricula: string;
    pension: string;
    costo_adicional: string;
    requisitos: string[];
  };
}

export interface ProgramaPlanEstudioJson {
  nota_general: string;
  ciclos: Ciclo[];
}

export interface ProgramaConfigVisibilidad {
  mostrar_en_hero: boolean;
  mostrar_admision: boolean;
  mostrar_plan_estudio: boolean;
  mostrar_horarios: boolean;
  mostrar_perfiles: boolean;
  mostrar_certificacion: boolean;
}

export interface ProgramaAdminFormData {
  titulo: string;
  tipo: string;
  descripcion_corta: string;
  estado: string;
  orden: number;
  detalles_json: ProgramaDetallesJson;
  plan_estudio_json: ProgramaPlanEstudioJson;
  horarios_json: HorarioModulo[];
  config_visibilidad: ProgramaConfigVisibilidad;
}
