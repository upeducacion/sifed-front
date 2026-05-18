import { Noticia } from "@/types/noticia";

export const MOCK_NOTICIAS: Noticia[] = [
  {
    id: 9001,
    titulo: "Curso propedéutico",
    slug: "mock-curso-propedeutico-ultimos-grupos",
    resumen:
      "Los que no asistieron en las clases programadas, tienen la oportunidad de desarrollarlas los días 21 y 22 de mayo. El link de acceso se enviará a su correo, el 20 de mayo.",
    contenido: `
      <div>
        <h2>Curso propedéutico</h2>
        <p>
          Los que no asistieron en las clases programadas, tienen la oportunidad de desarrollarlas
          los días <strong>21 y 22 de mayo</strong>.
        </p>
        <p>
          El link de acceso se enviará a su correo, el <strong>20 de mayo</strong>.
        </p>
      </div>
    `,
    imagen_url: "/images/avisos/curso-propedeutico-ultimos-grupos.png",
    noticia_categoria_id: 4,
    categoria: {
      id: 4,
      nombre: "Avisos",
      estilo_visual: "blue",
    },
    autor_nombre: null,
    tiempo_lectura: 1,
    fecha_publicacion: "2026-05-21",
    fecha_humana: "21 y 22 de mayo",
    destacada: true,
    estado: "publicado",
  },
];

export const getMockNoticiaBySlug = (slug: string) => {
  return MOCK_NOTICIAS.find((noticia) => noticia.slug === slug) || null;
};