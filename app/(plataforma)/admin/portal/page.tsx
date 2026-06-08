import Link from "next/link";
import { 
  School, 
  GraduationCap, 
  Scale, 
  Users, 
  Library, 
  Image as ImageIcon, 
  FileText,
  ArrowRight,
  Newspaper
} from "lucide-react";

export default function PortalManagementPage() {
  const sections = [
    {
      title: "Unidad de Posgrado",
      description: "Información institucional, misión, visión y autoridades.",
      icon: School,
      href: "/admin/portal/unidad",
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Noticias y Novedades",
      description: "Gestión de noticias, comunicados y agenda de eventos.",
      icon: Newspaper,
      href: "/admin/portal/noticias",
      color: "text-red-600 bg-red-50"
    },
    {
      title: "Programas Académicos",
      description: "Gestión de Maestrías, Doctorados, Cursos, planes de estudio y costos.",
      icon: GraduationCap,
      href: "/admin/portal/programas",
      color: "text-brand-600 bg-brand-50"
    },
    {
      title: "Documentos Normativos",
      description: "Reglamentos, resoluciones y directivas institucionales.",
      icon: Scale,
      href: "/admin/portal/documentos-normativos",
      color: "text-orange-600 bg-orange-50"
    },
    {
      title: "Plana Docente",
      description: "Directorio de docentes, grados académicos y biografías.",
      icon: Users,
      href: "/admin/portal/docentes",
      color: "text-green-600 bg-green-50"
    },
    {
      title: "Biblioteca Virtual",
      description: "Acceso a bases de datos, repositorios digitales y recursos bibliográficos.",
      icon: Library,
      href: "/admin/portal/biblioteca",
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      title: "Galería de Fotos",
      description: "Álbumes de eventos, ceremonias y actividades académicas.",
      icon: ImageIcon,
      href: "/admin/portal/galerias",
      color: "text-pink-600 bg-pink-50"
    },
    {
      title: "Trámites",
      description: "Guías de procedimientos, requisitos y formularios.",
      icon: FileText,
      href: "/admin/portal/tramites",
      color: "text-yellow-600 bg-yellow-50"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-brand-950">Gestión del Portal</h2>
        <p className="text-muted-foreground">Administra el contenido público del portal informativo institucional.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link 
              key={section.title} 
              href={section.href}
              className="group p-6 bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-brand-200 transition-all hover:-translate-y-1"
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${section.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              
              <h3 className="font-bold text-brand-950 mb-2 group-hover:text-brand-600 transition-colors">
                {section.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {section.description}
              </p>
              
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Gestionar <ArrowRight className="h-3 w-3 ml-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
