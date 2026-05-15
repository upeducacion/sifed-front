import { Noticia } from "@/types/noticia";

export const MOCK_NOTICIAS: Noticia[] = [
  {
    id: 9001,
    titulo: "Comunicado importante sobre el proceso de admisión 2026",
    slug: "mock-comunicado-importante-admision-2026",
    resumen:
      "La Unidad de Posgrado informa a los postulantes sobre las nuevas fechas, requisitos y recomendaciones para completar correctamente el proceso de admisión.",
    contenido: `
      <div>
        <h2>Comunicado importante</h2>
        <p>
          La Unidad de Posgrado comunica a los postulantes que se han actualizado las fechas
          y recomendaciones para el proceso de admisión 2026.
        </p>
        <p>
          Se recomienda revisar cuidadosamente los requisitos, preparar la documentación
          solicitada y mantenerse atento a los canales oficiales de comunicación.
        </p>
        <ul>
          <li>Revisión de requisitos de inscripción.</li>
          <li>Verificación de fechas actualizadas.</li>
          <li>Seguimiento de comunicados oficiales.</li>
        </ul>
      </div>
    `,
    imagen_url:
      "https://api.upeducacion-uncp.edu.pe/storage/noticias/8aa40582-e073-47d1-9eb1-ee75e8db072a.webp",
    noticia_categoria_id: 4,
    categoria: {
      id: 4,
      nombre: "Novedades Académicas",
      estilo_visual: "blue",
    },
    autor_nombre: null,
    tiempo_lectura: 2,
    fecha_publicacion: "2026-04-30",
    fecha_humana: "30 Apr, 2026",
    destacada: true,
    estado: "publicado",
  },
  {
    id: 9002,
    titulo: "Cronograma actualizado de actividades académicas",
    slug: "mock-cronograma-actualizado-actividades-academicas",
    resumen:
      "Se comunica a la comunidad académica la actualización del cronograma de actividades, talleres y sesiones informativas programadas para las próximas semanas.",
    contenido: `
      <div>
        <h2>Cronograma actualizado</h2>
        <p>
          La Unidad de Posgrado informa que el cronograma de actividades académicas ha sido
          actualizado para facilitar la participación de estudiantes, docentes y postulantes.
        </p>
        <p>
          Las actividades incluyen talleres, sesiones informativas y espacios de orientación
          académica.
        </p>
        <ul>
          <li>Talleres académicos.</li>
          <li>Sesiones informativas.</li>
          <li>Actividades de orientación.</li>
        </ul>
      </div>
    `,
    imagen_url:
      "https://api.upeducacion-uncp.edu.pe/storage/noticias/8aa40582-e073-47d1-9eb1-ee75e8db072a.webp",
    noticia_categoria_id: 4,
    categoria: {
      id: 4,
      nombre: "Novedades Académicas",
      estilo_visual: "blue",
    },
    autor_nombre: null,
    tiempo_lectura: 2,
    fecha_publicacion: "2026-05-01",
    fecha_humana: "01 May, 2026",
    destacada: true,
    estado: "publicado",
  },
];

export const getMockNoticiaBySlug = (slug: string) => {
  return MOCK_NOTICIAS.find((noticia) => noticia.slug === slug) || null;
};