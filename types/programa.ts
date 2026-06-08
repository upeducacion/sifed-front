import { Ciclo } from "./curriculum";

export type ProgramType = "maestria" | "doctorado" | "diplomado" | "curso" | "taller";

export interface ProgramAdmision {
  costo_inscripcion?: string;
  matricula?: string;
  pension?: string;
  costo_adicional?: string;
  requisitos?: string[];
}

export interface ConfigVisibilidad {
  mostrar_en_hero?: boolean;
  mostrar_admision?: boolean;
  mostrar_plan_estudio?: boolean;
  mostrar_horarios?: boolean;
  mostrar_perfiles?: boolean;
  mostrar_certificacion?: boolean;
}

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

export interface ProgramData {
  id: number;
  slug: string;
  tipo: ProgramType;
  categoria?: string;
  titulo: string;
  descripcionCorta: string;
  imagenPortada: string;
  
  // Marketing & Hero
  preTitle?: string;
  tituloHero: string;
  subtitleHero?: string;
  descripcionHero?: string;
  imagenHero?: string;
  
  contenidoPreTitle?: string;
  contenidoTitulo?: string;

  infoGeneral: {
    duracion: string;
    modalidad: string;
    certificacion: string;
    totalCreditos: number;
  };

  acercaDe: string;
  objetivos: string[];
  perfilEstudiante: string[];
  perfilEgresado: string[];
  planEstudios: Ciclo[];
  horarios: HorarioModulo[];
  
  certificacionDetalle: string;
  admision?: ProgramAdmision;
  configVisibilidad?: ConfigVisibilidad;
}
