import { UnoptImage } from "@/components/ui/unopt-image";
import Link from "next/link";
import { 
  MonitorPlay, 
  BookOpen, 
  HelpCircle,
  Facebook,
  Youtube,
  Linkedin,
  Lock
} from "lucide-react";
import { EXTERNAL_LINKS, INTERNAL_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-brand-50 border-t border-border pt-24 pb-12 flex-none">
      <div className="mx-auto max-w-[1920px] px-6 lg:px-12">
        
        <div className="grid gap-16 lg:grid-cols-4 mb-20">
          {/* Columna Marca */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-8">
               <div className="flex items-center">
                  <UnoptImage src="/images/logo-posgrado-educacion.webp" alt="Logo Posgrado Educación UNCP" width={72} height={72} className="object-contain" />
               </div>
               <div className="flex flex-col justify-center">
                  <span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground leading-tight">UNCP</span>
                  <span className="text-[9px] font-bold text-brand-700 leading-tight">Facultad de Educación</span>
                  <span className="font-serif font-black text-brand-950 text-xl leading-none mt-0.5">Posgrado</span>
               </div>
            </div>
            <p className="text-sm font-medium leading-relaxed text-muted-foreground max-w-xs mb-10">
              Excelencia académica y formación de investigadores líderes con compromiso social y rigor científico.
            </p>
            <div className="flex gap-4">
               <Link 
                 href={EXTERNAL_LINKS.FACEBOOK} 
                 target="_blank"
                 rel="noopener noreferrer"
                 aria-label="Visitar nuestra página de Facebook"
                 className="h-12 w-12 rounded-2xl bg-white border border-border flex items-center justify-center text-slate-600 hover:bg-brand-600 hover:text-white transition-all shadow-sm focus-visible:outline-brand-600 focus-visible:outline-2"
               >
                  <Facebook aria-hidden="true" className="h-5 w-5" />
               </Link>
               <Link 
                 href={EXTERNAL_LINKS.YOUTUBE} 
                 target="_blank"
                 rel="noopener noreferrer"
                 aria-label="Visitar nuestro canal de YouTube"
                 className="h-12 w-12 rounded-2xl bg-white border border-border flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white transition-all shadow-sm focus-visible:outline-red-600 focus-visible:outline-2"
               >
                  <Youtube aria-hidden="true" className="h-5 w-5" />
               </Link>
               <Link 
                 href={EXTERNAL_LINKS.LINKEDIN} 
                 target="_blank"
                 rel="noopener noreferrer"
                 aria-label="Visitar nuestro perfil de LinkedIn"
                 className="h-12 w-12 rounded-2xl bg-white border border-border flex items-center justify-center text-slate-600 hover:bg-blue-700 hover:text-white transition-all shadow-sm focus-visible:outline-blue-700 focus-visible:outline-2"
               >
                  <Linkedin aria-hidden="true" className="h-5 w-5" />
               </Link>
            </div>
          </div>
          
          {/* Columna Programas */}
          <div>
            <h4 className="mb-8 text-xs font-black text-brand-950 uppercase tracking-[0.2em]">Programas</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li><Link href="/posgrado/maestrias" className="hover:text-brand-600 transition-colors focus-visible:outline-brand-600">Maestrías</Link></li>
              <li><Link href="/posgrado/doctorados" className="hover:text-brand-600 transition-colors focus-visible:outline-brand-600">Doctorados</Link></li>
              <li><Link href="/posgrado/formacion-continua" className="hover:text-brand-600 transition-colors focus-visible:outline-brand-600">Formación Continua</Link></li>
              <li><Link href="/posgrado/admision" className="hover:text-brand-600 transition-colors focus-visible:outline-brand-600">Proceso de Admisión</Link></li>
            </ul>
          </div>

          {/* Columna Investigación */}
          <div>
            <h4 className="mb-8 text-xs font-black text-brand-950 uppercase tracking-[0.2em]">Investigación</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li><Link href="/biblioteca-virtual" className="hover:text-brand-600 transition-colors focus-visible:outline-brand-600">Biblioteca Virtual</Link></li>
              <li><Link href="/documentos-normativos" className="hover:text-brand-600 transition-colors focus-visible:outline-brand-600">Normativa de Grados</Link></li>
              <li><Link href="/galeria-fotos" className="hover:text-brand-600 transition-colors focus-visible:outline-brand-600">Memoria Visual (Galería)</Link></li>
              <li><Link href="/posgrado/plana-docente" className="hover:text-brand-600 transition-colors focus-visible:outline-brand-600">Plana Docente</Link></li>
              <li><Link href="/portales-institucionales" className="hover:text-brand-600 transition-colors focus-visible:outline-brand-600">Portales Institucionales</Link></li>
            </ul>
          </div>

          {/* Columna Servicios Digitales */}
          <div>
            <h4 className="mb-8 text-xs font-black text-brand-950 uppercase tracking-[0.2em]">Ecosistema</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li><a href={EXTERNAL_LINKS.AULA_VIRTUAL} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 transition-colors flex items-center gap-2 focus-visible:outline-brand-600"><MonitorPlay aria-hidden="true" className="h-4 w-4" /> Aula Virtual</a></li>
              <li><Link href="/posgrado/admision" className="hover:text-brand-600 transition-colors flex items-center gap-2 focus-visible:outline-brand-600"><BookOpen aria-hidden="true" className="h-4 w-4" /> Guía de Inscripción</Link></li>
              <li><Link href="/documentos-normativos" className="hover:text-brand-600 transition-colors flex items-center gap-2 focus-visible:outline-brand-600"><HelpCircle aria-hidden="true" className="h-4 w-4" /> Soporte Académico</Link></li>
              <li><Link href={INTERNAL_LINKS.ADMIN_LOGIN} className="hover:text-brand-600 transition-colors flex items-center gap-2 focus-visible:outline-brand-600"><Lock aria-hidden="true" className="h-4 w-4" /> Gestión Administrativa</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">
          <p>© 2026 Universidad Nacional del Centro del Perú.</p>
          <div className="flex gap-8">
            <Link href="/privacidad" className="hover:text-brand-950 transition-colors focus-visible:outline-brand-600">Privacidad</Link>
            <Link href="/terminos" className="hover:text-brand-950 transition-colors focus-visible:outline-brand-600">Términos</Link>
            <Link 
              href={EXTERNAL_LINKS.RECLAMACIONES} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-brand-950 transition-colors focus-visible:outline-brand-600"
            >
              Reclamaciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
