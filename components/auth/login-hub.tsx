"use client";

import { useRef } from "react";
import { UnoptImage } from "@/components/ui/unopt-image";
import LoginForm from "@/components/auth/login-form";
import ServiceCard from "@/components/ui/service-card";
import { useAuth } from "@/hooks/use-auth";
import { 
  ArrowLeft,
  User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getStorageUrl } from "@/lib/utils";

const UNCP_LOGO = "/images/logo-posgrado-educacion.webp";

export default function LoginHub() {
  const loginRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleLoginSuccess = () => {
    window.location.reload();
  };

  const focusLogin = () => {
    if (user) return;
    
    if (loginRef.current) {
      loginRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // Animación de énfasis más elegante que un simple ring
      loginRef.current.animate([
        { boxShadow: '0 0 0 0 rgba(0, 27, 72, 0)' },
        { boxShadow: '0 0 0 10px rgba(0, 27, 72, 0.1)' },
        { boxShadow: '0 0 0 0 rgba(0, 27, 72, 0)' }
      ], { duration: 600, easing: 'ease-out' });

      const emailInput = loginRef.current.querySelector("input[type='email']") as HTMLInputElement;
      if (emailInput) emailInput.focus();
    }
  };

  const services = [
    {
      title: "Programas de Posgrado",
      subtitle: "Oferta Académica",
      href: "/posgrado",
      requiresAuth: false,
      imageSrc: "/images/logo-posgrado-educacion.webp"
    },
    {
      title: "Documentos y Trámites",
      subtitle: "Normativas y Formatos",
      href: "/documentos-normativos",
      requiresAuth: false,
      imageSrc: UNCP_LOGO
    },
    {
      title: "Noticias y Eventos",
      subtitle: "Actualidad Institucional",
      href: "/noticias",
      requiresAuth: false,
      imageSrc: UNCP_LOGO
    },
    {
      title: "Aula Virtual",
      subtitle: "Plataforma de Aprendizaje",
      href: "/estudiante/dashboard",
      requiresAuth: true,
      imageSrc: UNCP_LOGO
    },
    {
      title: "Portal Docente",
      subtitle: "Gestión de Cátedra",
      href: "/docente/dashboard",
      requiresAuth: true,
      imageSrc: UNCP_LOGO
    },
    {
      title: "Biblioteca Virtual",
      subtitle: "Recursos de Investigación",
      href: "/en-construccion",
      requiresAuth: true,
      imageSrc: UNCP_LOGO
    },
    {
      title: "Mesa de Ayuda",
      subtitle: "Soporte Técnico",
      href: "/soporte",
      requiresAuth: false,
      variant: "special" as const,
      imageSrc: UNCP_LOGO
    }
  ];

  if (user && user.roles.includes("admin")) {
    services.splice(services.length - 1, 0, {
      title: "Gestión UP Educación",
      subtitle: "Control Maestro",
      href: "/admin",
      requiresAuth: true,
      imageSrc: UNCP_LOGO
    });
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white selection:bg-brand-100">
      
      {/* IZQUIERDA: Panel de Identidad y Acceso */}
      <aside className="w-full lg:w-[420px] xl:w-[480px] shrink-0 bg-brand-50/30 border-b lg:border-b-0 lg:border-r border-brand-100 p-8 lg:p-12 flex flex-col relative lg:h-screen lg:sticky lg:top-0 overflow-hidden">
        
        {/* Acento Institucional Superior */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-uncp-green via-uncp-gold to-brand-800 z-10" />
        
        <div className="flex-1 flex flex-col justify-between relative z-20">
          {/* Header de Identidad */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <Link href="/" className="inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-950/40 hover:text-brand-600 transition-all group">
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" /> Volver al Inicio
            </Link>

            <div className="flex items-center gap-6">
            <div className="flex items-center">
              <UnoptImage src="/images/logo-posgrado-educacion.webp" alt="Posgrado Educación" width={72} height={72} className="object-contain" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-black text-brand-950 leading-none tracking-tighter">UP Educación</h1>
              <p className="text-[9px] font-black text-brand-600 uppercase tracking-[0.3em] mt-1.5">Ecosistema Digital</p>
            </div>
            </div>          </motion.div>

          {/* Área de Formulario / Perfil */}
          <div ref={loginRef} className="my-12">
            <AnimatePresence mode="wait">
              {!user ? (
                <motion.div 
                  key="login-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,27,72,0.08)] border border-brand-100/50 p-8 xl:p-10"
                >
                  <LoginForm onLoginSuccess={handleLoginSuccess} />
                </motion.div>
              ) : (
                <motion.div 
                  key="user-profile"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,27,72,0.08)] border border-brand-100/50 p-10 text-center"
                >
                  <div className="relative h-24 w-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-100 to-uncp-gold animate-pulse" />
                    <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-brand-50">
                      {user.foto_url ? (
                        <UnoptImage src={getStorageUrl(user.foto_url)} alt={user.name} fill className="object-cover" />
                      ) : (
                        <UserIcon className="h-10 w-10 text-brand-200" />
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-serif font-black text-brand-950 leading-tight">
                    Bienvenido, <br/>
                    <span className="text-brand-600">{(user?.name || 'Usuario').split(' ')[0]}</span>
                  </h3>

                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {user.roles.map((role: string) => (
                      <span key={role} className="px-3 py-1 rounded-full bg-brand-950 text-[9px] font-black text-white uppercase tracking-wider">
                        {role}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={handleLogout}
                    className="mt-10 w-full py-4 px-6 rounded-2xl bg-brand-50 text-brand-950 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-950 hover:text-white transition-all duration-300 border border-brand-100"
                  >
                    Cerrar Sesión
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Institucional */}
          <footer className="pt-8 border-t border-brand-100/50">
            <p className="text-[9px] font-bold text-brand-950/30 uppercase tracking-[0.25em] text-center">
              © 2026 Facultad de Educación UNCP
            </p>
          </footer>
        </div>
      </aside>

      {/* DERECHA: Grid de Servicios Académicos */}
      <main className="flex-1 bg-white p-6 lg:p-10 xl:p-12 xl:pt-6 overflow-y-auto lg:h-screen no-scrollbar">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Minimalista Editorial */}
          <header className="mb-6">
            <p className="text-uncp-gold font-black text-[9px] uppercase tracking-[0.4em] inline-block pb-2 border-b border-brand-100">
              Central de Servicios
            </p>
          </header>

          {/* Grid Editorial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={`${service.title}-${user ? 'auth' : 'guest'}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <ServiceCard
                  title={service.title}
                  subtitle={service.subtitle}
                  href={service.href}
                  imageSrc={service.imageSrc}
                  variant={service.variant}
                  isLocked={service.requiresAuth && !user}
                  onLockedClick={focusLogin}
                />
              </motion.div>
            ))}
          </div>

          {/* Nota de Pie de Página */}
          <div className="mt-24 pt-12 border-t border-brand-50 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-brand-950/20">
            <p>Acceso restringido para personal autorizado</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-brand-600 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-brand-600 transition-colors">Términos de Uso</a>
              <a href="#" className="hover:text-brand-600 transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}