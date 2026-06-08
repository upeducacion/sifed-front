import { Ciclo } from "@/types/curriculum";

export interface ProgramaCurricular {
  id: string;
  tipo: "Maestría" | "Doctorado";
  mencion?: string;
  nombre: string;
  duracion: string;
  ciclos: Ciclo[];
  nota?: string;
}

export const curriculums: ProgramaCurricular[] = [
  {
    id: "maestria-gestion",
    tipo: "Maestría",
    mencion: "Gestión Educativa",
    nombre: "Maestría en Educación, mención en Gestión Educativa",
    duracion: "3 Semestres",
    nota: "(*) El maestrando elige una de las tres asignaturas electivas.",
    ciclos: [
      {
        numero: "I",
        totalCreditos: 19,
        asignaturas: [
          { nombre: "Teorías científicas de la educación", creditos: 5 },
          { nombre: "Seminario taller de tesis", creditos: 4 },
          { nombre: "Liderazgo, inteligencia emocional y cultura organizacional", creditos: 5 },
          { nombre: "Planificación y organización educativa", creditos: 5 },
        ]
      },
      {
        numero: "II",
        totalCreditos: 19,
        asignaturas: [
          { nombre: "Asesoramiento de tesis I", creditos: 4 },
          { nombre: "Proyectos educativos, innovadores y de inversión", creditos: 5 },
          { nombre: "Análisis de datos cuantitativos y cualitativos", creditos: 5 },
          { nombre: "Gestión de recursos humanos", creditos: 5 },
        ]
      },
      {
        numero: "III",
        totalCreditos: 11,
        asignaturas: [
          { nombre: "Asesoramiento de tesis II", creditos: 7 },
          { nombre: "Electivo*: Evaluación, supervisión y asesoramiento educacional", creditos: 4, isElectivo: true },
          { nombre: "Electivo*: Sistemas de evaluación de la calidad institucional", creditos: 4, isElectivo: true },
          { nombre: "Electivo*: Enfoques y técnicas cualitativas en investigación", creditos: 4, isElectivo: true },
        ]
      }
    ]
  },
  {
    id: "maestria-superior",
    tipo: "Maestría",
    mencion: "Educación Superior",
    nombre: "Maestría en Educación, mención en Educación Superior",
    duracion: "3 Semestres",
    nota: "(*) El maestrando elige una de las tres asignaturas electivas.",
    ciclos: [
      {
        numero: "I",
        totalCreditos: 19,
        asignaturas: [
          { nombre: "Teorías científicas de la Educación", creditos: 5 },
          { nombre: "Seminario taller de tesis", creditos: 4 },
          { nombre: "Filosofía de la Educación Superior", creditos: 5 },
          { nombre: "Andragogía", creditos: 5 },
        ]
      },
      {
        numero: "II",
        totalCreditos: 19,
        asignaturas: [
          { nombre: "Asesoramiento de tesis I", creditos: 4 },
          { nombre: "Didáctica en la Educación Superior", creditos: 5 },
          { nombre: "Análisis de datos cuantitativos y cualitativos", creditos: 5 },
          { nombre: "Técnicas y estrategias para el desarrollo de la inteligencia emocional", creditos: 5 },
        ]
      },
      {
        numero: "III",
        totalCreditos: 11,
        asignaturas: [
          { nombre: "Asesoramiento de tesis II", creditos: 7 },
          { nombre: "Electivo*: Currículo y evaluación educativa", creditos: 4, isElectivo: true },
          { nombre: "Electivo*: Sistemas de evaluación de la calidad institucional", creditos: 4, isElectivo: true },
          { nombre: "Electivo*: Enfoques y técnicas cualitativas en investigación", creditos: 4, isElectivo: true },
        ]
      }
    ]
  },
  {
    id: "maestria-psicologia",
    tipo: "Maestría",
    mencion: "Psicología Educativa",
    nombre: "Maestría en Educación, mención en Psicología Educativa",
    duracion: "3 Semestres",
    nota: "(*) El maestrando elige una de las tres asignaturas electivas.",
    ciclos: [
      {
        numero: "I",
        totalCreditos: 19,
        asignaturas: [
          { nombre: "Teorías científicas de la Educación", creditos: 5 },
          { nombre: "Seminario taller de tesis", creditos: 4 },
          { nombre: "Psicología cognitiva", creditos: 5 },
          { nombre: "Teorías y estrategias de aprendizaje", creditos: 5 },
        ]
      },
      {
        numero: "II",
        totalCreditos: 19,
        asignaturas: [
          { nombre: "Asesoramiento de tesis I", creditos: 4 },
          { nombre: "Fundamentos neuropsicológicos de la cognición", creditos: 5 },
          { nombre: "Problemas de aprendizaje", creditos: 5 },
          { nombre: "Análisis de datos cuantitativos y cualitativos", creditos: 5 },
        ]
      },
      {
        numero: "III",
        totalCreditos: 11,
        asignaturas: [
          { nombre: "Asesoramiento de tesis II", creditos: 7 },
          { nombre: "Electivo*: Currículo y evaluación educativa", creditos: 4, isElectivo: true },
          { nombre: "Electivo*: Técnicas y estrategias para el desarrollo de las inteligencias múltiples", creditos: 4, isElectivo: true },
          { nombre: "Electivo*: Enfoques y técnicas cualitativas en investigación", creditos: 4, isElectivo: true },
        ]
      }
    ]
  },
  {
    id: "maestria-ensenanza",
    tipo: "Maestría",
    mencion: "Enseñanza Estratégica",
    nombre: "Maestría en Educación, mención en Enseñanza Estratégica",
    duracion: "3 Semestres",
    nota: "(*) El maestrando elige una de las tres asignaturas electivas.",
    ciclos: [
      {
        numero: "I",
        totalCreditos: 19,
        asignaturas: [
          { nombre: "Teorías científicas de la Educación", creditos: 5 },
          { nombre: "Seminario taller de tesis", creditos: 4 },
          { nombre: "Herramientas del pensamiento creativo, crítico y reflexivo", creditos: 5 },
          { nombre: "Fundamentos neuropsicológicos de la cognición", creditos: 5 },
        ]
      },
      {
        numero: "II",
        totalCreditos: 19,
        asignaturas: [
          { nombre: "Asesoramiento de tesis I", creditos: 4 },
          { nombre: "Técnicas y estrategias para el desarrollo de la inteligencia emocional", creditos: 5 },
          { nombre: "Recursos didácticos para el aprendizaje", creditos: 5 },
          { nombre: "Teorías y estrategias de aprendizaje", creditos: 5 },
        ]
      },
      {
        numero: "III",
        totalCreditos: 11,
        asignaturas: [
          { nombre: "Asesoramiento de tesis II", creditos: 7 },
          { nombre: "Electivo*: Currículo y evaluación educativa", creditos: 4, isElectivo: true },
          { nombre: "Electivo*: Técnicas y estrategias para el desarrollo de la inteligencia lógico matemática", creditos: 4, isElectivo: true },
          { nombre: "Electivo*: Enfoques y técnicas cualitativas en investigación", creditos: 4, isElectivo: true },
        ]
      }
    ]
  },
  {
    id: "doctorado-ciencias",
    tipo: "Doctorado",
    mencion: "Ciencias de la Educación",
    nombre: "Doctorado en Ciencias de la Educación",
    duracion: "6 Semestres",
    nota: "(*) El doctorando elige una de las tres asignaturas electivas.",
    ciclos: [
      {
        numero: "I",
        totalCreditos: 12,
        asignaturas: [
          { nombre: "Filosofía e historia de la Educación", creditos: 4 },
          { nombre: "Epistemología", creditos: 4 },
          { nombre: "Seminario de Taller de tesis I", creditos: 4 },
        ]
      },
      {
        numero: "II",
        totalCreditos: 12,
        asignaturas: [
          { nombre: "Sociología y ética de la Educación", creditos: 4 },
          { nombre: "Seminario de Taller de Tesis II", creditos: 4 },
          { nombre: "Seminario de Investigación Cualitativa I", creditos: 4 },
        ]
      },
      {
        numero: "III",
        totalCreditos: 12,
        asignaturas: [
          { nombre: "Evaluación de la calidad de los sistemas educacionales", creditos: 4 },
          { nombre: "Seminario de taller de tesis III", creditos: 4 },
          { nombre: "Seminario de Investigación cualitativa II", creditos: 4 },
        ]
      },
      {
        numero: "IV",
        totalCreditos: 12,
        asignaturas: [
          { nombre: "Seminario taller de evaluación y formulación de currículo", creditos: 4 },
          { nombre: "Análisis de datos cuantitativos y cualitativos", creditos: 4 },
          { nombre: "Sistemas educativos y pensamiento pedagógico", creditos: 4 },
        ]
      },
      {
        numero: "V",
        totalCreditos: 12,
        asignaturas: [
          { nombre: "Neurociencia y cognición", creditos: 4 },
          { nombre: "Política y gestión educativa", creditos: 4 },
          { nombre: "Asesoría de Tesis I", creditos: 4 },
        ]
      },
      {
        numero: "VI",
        totalCreditos: 12,
        asignaturas: [
          { nombre: "Educación para el desarrollo sostenible", creditos: 4 },
          { nombre: "Asesoramiento de tesis II", creditos: 4 },
          { nombre: "Electivo*: Investigación de las TIC en Educación", creditos: 4, isElectivo: true },
          { nombre: "Electivo*: Investigación del liderazgo en la gestión del cambio", creditos: 4, isElectivo: true },
          { nombre: "Electivo*: Investigación de la gestión del conocimiento", creditos: 4, isElectivo: true },
        ]
      }
    ]
  }
];
