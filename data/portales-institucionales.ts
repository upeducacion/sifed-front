export type CategoriaPortal =
  | "Regulación Nacional"
  | "Organismos Internacionales"
  | "Ciencia y Tecnología"
  | "Universidad";

export interface PortalInstitucional {
  id: number;
  nombre: string;
  url: string;
  utilidad: string;
  categoria: CategoriaPortal;
}

export const CATEGORIAS_PORTAL: CategoriaPortal[] = [
  "Regulación Nacional",
  "Organismos Internacionales",
  "Ciencia y Tecnología",
  "Universidad",
];

export const PORTALES_INSTITUCIONALES: PortalInstitucional[] = [
  // Regulación Nacional
  { id: 1,  nombre: "SUNEDU",                        url: "https://www.gob.pe/sunedu",                                                    utilidad: "Información sobre universidades, licenciamiento, grados y títulos.",                                    categoria: "Regulación Nacional" },
  { id: 2,  nombre: "SUNEDU en Línea",                url: "https://enlinea.sunedu.gob.pe/",                                               utilidad: "Consulta de grados y títulos, constancias y servicios digitales.",                                      categoria: "Regulación Nacional" },
  { id: 3,  nombre: "MINEDU",                         url: "https://www.gob.pe/minedu",                                                    utilidad: "Portal oficial del Ministerio de Educación del Perú.",                                                  categoria: "Regulación Nacional" },
  { id: 4,  nombre: "MINEDU en Línea",                url: "https://enlinea.minedu.gob.pe/",                                               utilidad: "Mesa de partes digital y servicios virtuales del MINEDU.",                                              categoria: "Regulación Nacional" },
  { id: 5,  nombre: "SINEACE",                        url: "https://www.gob.pe/sistema-nacional-de-evaluacion-acreditacion-y-certificacion-de-la-calidad-educativa", utilidad: "Evaluación, acreditación y certificación de la calidad educativa.", categoria: "Regulación Nacional" },
  { id: 6,  nombre: "CONEAU",                         url: "https://www.gob.pe/institucion/sineace/tema/coneau",                           utilidad: "Acreditación y certificación de la calidad en educación superior universitaria.",                        categoria: "Regulación Nacional" },

  // Organismos Internacionales
  { id: 7,  nombre: "UNESCO",                         url: "https://www.unesco.org/es",                                                    utilidad: "Organismo internacional sobre educación, ciencia, cultura y comunicación.",                              categoria: "Organismos Internacionales" },
  { id: 8,  nombre: "UNESCO Educación",               url: "https://www.unesco.org/es/education",                                          utilidad: "Información especializada sobre educación y Agenda Educación 2030.",                                     categoria: "Organismos Internacionales" },
  { id: 9,  nombre: "OECD / OCDE",                    url: "https://www.oecd.org/",                                                        utilidad: "Organización para la Cooperación y el Desarrollo Económicos.",                                          categoria: "Organismos Internacionales" },
  { id: 10, nombre: "OECD Educación y Competencias",  url: "https://www.oecd.org/en/topics/policy-areas/education-and-skills.html",        utilidad: "Datos, informes y análisis sobre educación y habilidades.",                                             categoria: "Organismos Internacionales" },

  // Ciencia y Tecnología
  { id: 11, nombre: "ALICIA – CONCYTEC",              url: "https://alicia.concytec.gob.pe/vufind/",                                       utilidad: "Repositorio Nacional Digital de Ciencia, Tecnología e Innovación.",                                     categoria: "Ciencia y Tecnología" },
  { id: 12, nombre: "CONCYTEC",                       url: "https://www.gob.pe/concytec",                                                  utilidad: "Portal oficial del Consejo Nacional de Ciencia, Tecnología e Innovación.",                               categoria: "Ciencia y Tecnología" },
  { id: 13, nombre: "Repositorio CONCYTEC",           url: "https://repositorio.concytec.gob.pe/",                                         utilidad: "Publicaciones, informes y documentos vinculados a ciencia y tecnología.",                                categoria: "Ciencia y Tecnología" },

  // Universidad
  { id: 14, nombre: "Repositorio Institucional UNCP", url: "https://repositorio.uncp.edu.pe/",                                             utilidad: "Tesis, investigaciones y producción académica de la Universidad Nacional del Centro del Perú.",         categoria: "Universidad" },
  { id: 15, nombre: "Portal UNCP",                    url: "https://uncp.edu.pe/",                                                         utilidad: "Página oficial de la Universidad Nacional del Centro del Perú.",                                        categoria: "Universidad" },
];
