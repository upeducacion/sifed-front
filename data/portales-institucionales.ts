export type CategoriaPortal =
  | "Regulación Nacional"
  | "Organismos Internacionales"
  | "Ciencia y Tecnología"
  | "Universidad";

export interface PortalInstitucional {
  id: number;
  nombre: string;
  url: string;
  logoUrl: string;
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
  { id: 1,  nombre: "SUNEDU",                        url: "https://www.gob.pe/sunedu",                                                    logoUrl: "https://www.gob.pe/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MTcyMjIsInB1ciI6ImJsb2JfaWQifX0=--93d9f21d08eaea85158bcee9b14edeba5ed621b9/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOltudWxsLDQ4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--830247c4bafe7cadca50817d8559bf1a09e3aa28/logo-superintendencia-nacional-de-educacion-superior-universitaria.png", utilidad: "Información sobre universidades, licenciamiento, grados y títulos.",                                    categoria: "Regulación Nacional" },
  { id: 2,  nombre: "SUNEDU en Línea",               url: "https://enlinea.sunedu.gob.pe/",                                               logoUrl: "https://www.gob.pe/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MTcyMjIsInB1ciI6ImJsb2JfaWQifX0=--93d9f21d08eaea85158bcee9b14edeba5ed621b9/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOltudWxsLDQ4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--830247c4bafe7cadca50817d8559bf1a09e3aa28/logo-superintendencia-nacional-de-educacion-superior-universitaria.png", utilidad: "Consulta de grados y títulos, constancias y servicios digitales.",                                      categoria: "Regulación Nacional" },
  { id: 3,  nombre: "MINEDU",                        url: "https://www.gob.pe/minedu",                                                    logoUrl: "/portales/minedu.png", utilidad: "Portal oficial del Ministerio de Educación del Perú.",                                                  categoria: "Regulación Nacional" },
  { id: 4,  nombre: "MINEDU en Línea",              url: "https://enlinea.minedu.gob.pe/",                                               logoUrl: "/portales/minedu.png", utilidad: "Mesa de partes digital y servicios virtuales del MINEDU.",                                              categoria: "Regulación Nacional" },
  { id: 5,  nombre: "SINEACE",                       url: "https://www.gob.pe/sistema-nacional-de-evaluacion-acreditacion-y-certificacion-de-la-calidad-educativa", logoUrl: "https://www.gob.pe/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MTMyNDksInB1ciI6ImJsb2JfaWQifX0=--c967628e3d0df6bcf5694743b541b4ba16f7462b/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOltudWxsLDQ4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--830247c4bafe7cadca50817d8559bf1a09e3aa28/logo%20grande%20%20fondo%20transparente.png", utilidad: "Evaluación, acreditación y certificación de la calidad educativa.", categoria: "Regulación Nacional" },
  { id: 6,  nombre: "CONEAU",                        url: "https://www.gob.pe/institucion/sineace/tema/coneau",                           logoUrl: "https://www.gob.pe/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MTMyNDksInB1ciI6ImJsb2JfaWQifX0=--c967628e3d0df6bcf5694743b541b4ba16f7462b/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOltudWxsLDQ4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--830247c4bafe7cadca50817d8559bf1a09e3aa28/logo%20grande%20%20fondo%20transparente.png", utilidad: "Acreditación y certificación de la calidad en educación superior universitaria.", categoria: "Regulación Nacional" },

  // Organismos Internacionales
  { id: 7,  nombre: "UNESCO",                        url: "https://www.unesco.org/es",                                                    logoUrl: "https://www.unesco.org/themes/custom/bunesco8/assets/images/logo/logo-blue.svg", utilidad: "Organismo internacional sobre educación, ciencia, cultura y comunicación.",                              categoria: "Organismos Internacionales" },
  { id: 8,  nombre: "UNESCO Educación",              url: "https://www.unesco.org/es/education",                                          logoUrl: "https://www.unesco.org/themes/custom/bunesco8/assets/images/logo/logo-blue.svg", utilidad: "Información especializada sobre educación y Agenda Educación 2030.",                                     categoria: "Organismos Internacionales" },
  { id: 9,  nombre: "OECD / OCDE",                   url: "https://www.oecd.org/",                                                        logoUrl: "https://www.oecd.org/favicon.ico", utilidad: "Organización para la Cooperación y el Desarrollo Económicos.",                                          categoria: "Organismos Internacionales" },
  { id: 10, nombre: "OECD Educación y Competencias", url: "https://www.oecd.org/en/topics/policy-areas/education-and-skills.html",        logoUrl: "https://www.oecd.org/favicon.ico", utilidad: "Datos, informes y análisis sobre educación y habilidades.",                                             categoria: "Organismos Internacionales" },

  // Ciencia y Tecnología
  { id: 11, nombre: "ALICIA – CONCYTEC",             url: "https://alicia.concytec.gob.pe/vufind/",                                       logoUrl: "https://www.gob.pe/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NDg2MjEsInB1ciI6ImJsb2JfaWQifX0=--8d802ce0c713f6265a6b9f587d0629fb9597ec5c/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOltudWxsLDQ4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--830247c4bafe7cadca50817d8559bf1a09e3aa28/Logo-horizontal-Concytec-2021-2.png", utilidad: "Repositorio Nacional Digital de Ciencia, Tecnología e Innovación.",                                     categoria: "Ciencia y Tecnología" },
  { id: 12, nombre: "CONCYTEC",                      url: "https://www.gob.pe/concytec",                                                  logoUrl: "https://www.gob.pe/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NDg2MjEsInB1ciI6ImJsb2JfaWQifX0=--8d802ce0c713f6265a6b9f587d0629fb9597ec5c/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOltudWxsLDQ4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--830247c4bafe7cadca50817d8559bf1a09e3aa28/Logo-horizontal-Concytec-2021-2.png", utilidad: "Portal oficial del Consejo Nacional de Ciencia, Tecnología e Innovación.",                               categoria: "Ciencia y Tecnología" },
  { id: 13, nombre: "Repositorio CONCYTEC",          url: "https://repositorio.concytec.gob.pe/",                                         logoUrl: "https://www.gob.pe/rails/active_storage/representations/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NDg2MjEsInB1ciI6ImJsb2JfaWQifX0=--8d802ce0c713f6265a6b9f587d0629fb9597ec5c/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJwbmciLCJyZXNpemVfdG9fbGltaXQiOltudWxsLDQ4XX0sInB1ciI6InZhcmlhdGlvbiJ9fQ==--830247c4bafe7cadca50817d8559bf1a09e3aa28/Logo-horizontal-Concytec-2021-2.png", utilidad: "Publicaciones, informes y documentos vinculados a ciencia y tecnología.",                                categoria: "Ciencia y Tecnología" },

  // Universidad
  { id: 14, nombre: "Repositorio Institucional UNCP", url: "https://repositorio.uncp.edu.pe/",                                             logoUrl: "/portales/uncp.png", utilidad: "Tesis, investigaciones y producción académica de la Universidad Nacional del Centro del Perú.",         categoria: "Universidad" },
  { id: 15, nombre: "Portal UNCP",                   url: "https://uncp.edu.pe/",                                                         logoUrl: "/portales/uncp.png", utilidad: "Página oficial de la Universidad Nacional del Centro del Perú.",                                        categoria: "Universidad" },
];
