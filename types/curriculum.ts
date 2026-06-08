export interface Asignatura {
  nombre: string;
  creditos: number | string;
  isElectivo?: boolean;
}

export interface Ciclo {
  numero: string;
  asignaturas: Asignatura[];
  totalCreditos: number;
}
