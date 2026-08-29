import { programasApi, Programa } from "@/lib/api/programas";
import { getStorageUrl } from "@/lib/utils";
import HeroCarousel from "./hero-carousel";

// Slides estáticos para fallback
const staticSlides = [
  {
    id: 1,
    src: "/banner/hero-gestion.webp",
    alt: "Estudiantes de la Maestría en Gestión Educativa",
    badge: "Maestría",
    preTitle: "MAESTRÍA EN MENCIÓN EN",
    title: "Gestión Educativa",
    subtitle: "Forma líderes que transforman instituciones",
    description:
      "Lidera organizaciones educativas con visión estratégica y compromiso social. Formula políticas e impulsa la innovación pedagógica.",
    stats: [
      { iconName: "Clock", label: "Duración", value: "3 Semestres" },
      { iconName: "Layers", label: "Créditos", value: "49 créditos" },
      { iconName: "GraduationCap", label: "Grado", value: "Magíster" },
    ],
    curriculumLink: "/posgrado/maestrias/maestria-gestion-educativa",
    inscripcionLink: "/posgrado/maestrias/maestria-gestion-educativa#admision",
  },
  {
    id: 2,
    src: "/banner/hero-superior.webp",
    alt: "Estudiantes de la Maestría en Educación Superior",
    badge: "Maestría",
    preTitle: "MAESTRÍA EN MENCIÓN EN",
    title: "Educación Superior",
    subtitle: "Mejora tu perfil profesional",
    description:
      "Consolídate como líder visionario con formación humanista y científica. Fortalece tu perfil investigador con rigor epistemológico.",
    stats: [
      { iconName: "Clock", label: "Duración", value: "3 Semestres" },
      { iconName: "Layers", label: "Créditos", value: "49 créditos" },
      { iconName: "GraduationCap", label: "Grado", value: "Magíster" },
    ],
    curriculumLink: "/posgrado/maestrias/maestria-educacion-superior",
    inscripcionLink: "/posgrado/maestrias/maestria-educacion-superior#admision",
  },
  {
    id: 3,
    src: "/banner/hero-psicologia.webp",
    alt: "Estudiantes de la Maestría en Psicología Educativa",
    badge: "Maestría",
    preTitle: "MAESTRÍA EN MENCIÓN EN",
    title: "Psicología Educativa",
    subtitle: "Comprende la mente para transformar el aprendizaje",
    description:
      "Descifra el comportamiento humano e integra los avances de la neurociencia en propuestas curriculares de alto impacto.",     
    stats: [
      { iconName: "Clock", label: "Duración", value: "3 Semestres" },
      { iconName: "Layers", label: "Créditos", value: "49 créditos" },
      { iconName: "GraduationCap", label: "Grado", value: "Magíster" },
    ],
    curriculumLink: "/posgrado/maestrias/maestria-psicologia-educativa",
    inscripcionLink: "/posgrado/maestrias/maestria-psicologia-educativa#admision",
  },
  {
    id: 4,
    src: "/banner/hero-ensenanza.webp",
    alt: "Estudiantes de la Maestría en Enseñanza Estratégica",
    badge: "Maestría",
    preTitle: "MAESTRÍA EN MENCIÓN EN",
    title: "Enseñanza Estratégica",
    subtitle: "Diseña el futuro de la educación",
    description:
      "Diseña propuestas disruptivas con bases científicas para los desafíos globales y lidera la planificación curricular de máxima calidad.",
    stats: [
      { iconName: "Clock", label: "Duración", value: "3 Semestres" },
      { iconName: "Layers", label: "Créditos", value: "49 créditos" },
      { iconName: "GraduationCap", label: "Grado", value: "Magíster" },
    ],
    curriculumLink: "/posgrado/maestrias/maestria-ensenanza-estrategica",
    inscripcionLink: "/posgrado/maestrias/maestria-ensenanza-estrategica#admision",
  },
  {
    id: 5,
    src: "/banner/hero-doctorado.webp",
    alt: "Doctorado en Ciencias de la Educación",
    badge: "Doctorado",
    preTitle: "Doctorado · UNCP",
    title: "Ciencias de la Educación",
    subtitle: "El máximo grado académico en educación",
    description:
      "Lidera investigaciones multidisciplinarias de alto impacto. Diseña políticas públicas con rigor ético, científico y tecnológico.",
    stats: [
      { iconName: "Clock", label: "Duración", value: "6 Semestres" },
      { iconName: "Layers", label: "Créditos", value: "72 créditos" },
      { iconName: "GraduationCap", label: "Grado", value: "Doctor" },
    ],
    curriculumLink: "/posgrado/doctorados/doctorado-ciencias-educacion",
    inscripcionLink: "/posgrado/doctorados/doctorado-ciencias-educacion#admision",
  },
];

export default async function HeroSection() {
  // Fetch de datos en el servidor
  let programas: Programa[] = [];
  try {
    programas = await programasApi.getPublicAll({ en_hero: true });
  } catch (error) {
    console.error("Error fetching hero programs:", error);
  }

  // Procesamiento de datos en el servidor
  const slides = (programas && programas.length > 0) 
    ? programas.map((p: Programa, idx: number) => {
        const d = p.detalles_json || {};
        const info = d.info_general || {};

        let baseLink = "/posgrado/maestrias";
        if (p.tipo === "doctorado") baseLink = "/posgrado/doctorados";
        else if (p.tipo === "diplomado") baseLink = "/posgrado/diplomados";
        else if (p.tipo === "curso") baseLink = "/posgrado/cursos";
        else if (p.tipo === "taller") baseLink = "/posgrado/talleres";

        return {
          id: p.id || idx + 100,
          src: d.hero_imagen_url ? getStorageUrl(d.hero_imagen_url) : staticSlides[0].src,
          alt: p.titulo,
          badge: d.categoria || p.tipo,
          preTitle: d.hero_pre_title || "",
          title: d.hero_titulo || p.titulo,
          subtitle: d.hero_subtitle || "",
          description: d.hero_descripcion || p.descripcion_corta || "",
          stats: [
            { iconName: "Clock", label: "Duración", value: info.duracion || "" },
            { iconName: "Layers", label: "Créditos", value: info.totalCreditos ? `${info.totalCreditos} créditos` : "" },
            { iconName: "GraduationCap", label: "Grado", value: info.certificacion || "" },
          ].filter(s => s.value !== ""),
          curriculumLink: `${baseLink}/${p.slug}`,
          inscripcionLink: `${baseLink}/${p.slug}#admision`,
        };
      })
    : staticSlides;

  return <HeroCarousel slides={slides} />;
}
