"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon, X, ChevronRight, LogOut, User as UserIcon, Settings, ArrowLeft } from "lucide-react";
import { UnoptImage } from "@/components/ui/unopt-image";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { AuthService } from "@/lib/services/auth-service";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  disabled?: boolean;
  children?: NavItem[];
}

interface User {
  name: string;
  email: string;
}

interface SidebarProps {
  items: NavItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DashboardSidebar({ items, open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const [user] = useLocalStorage<User | null>("user", null);

  // Calcular menús abiertos iniciales (Lazy State Initialization)
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initialMenus: Record<string, boolean> = {};
    items.forEach(item => {
      if (item.children?.some(child => pathname.startsWith(child.href))) {
        initialMenus[item.title] = true;
      }
    });
    return initialMenus;
  });

  // Sincronización en tiempo de renderizado (Recomendado para props -> state sync)
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    const updates: Record<string, boolean> = {};
    let changed = false;
    items.forEach(item => {
      const shouldOpen = item.children?.some(child => pathname.startsWith(child.href));
      if (shouldOpen && !openMenus[item.title]) {
        updates[item.title] = true;
        changed = true;
      }
    });
    if (changed) {
      setOpenMenus(prev => ({ ...prev, ...updates }));
    }
  }

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = async () => {
    localStorage.removeItem("user");
    await AuthService.logout();
  };

  return (
    <>
      {/* Overlay para móvil */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-brand-950 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 border-r border-brand-800 flex flex-col shadow-xl",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-brand-800 bg-brand-950/95 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
             <UnoptImage src="/images/logo-posgrado-educacion.webp" alt="Posgrado Educación" width={36} height={36} className="object-contain" />
             <div className="flex flex-col">
                <span className="font-serif font-bold text-lg leading-none tracking-tight">UP Educación</span>
                <span className="text-[9px] text-brand-400 uppercase tracking-wider font-bold">Admin Panel</span>
             </div>
          </div>
          
          <button 
            onClick={() => setOpen(false)} 
            className="lg:hidden text-brand-300 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-thin scrollbar-thumb-brand-800 scrollbar-track-transparent">
          {items.map((item) => {
            const Icon = item.icon; // Puede ser undefined ahora
            const hasChildren = item.children && item.children.length > 0;
            const isMenuOpen = openMenus[item.title];
            const isActive = pathname === item.href || (hasChildren && pathname.startsWith(item.href));

            return (
              <div key={item.title} className="space-y-1">
                {hasChildren ? (
                  <div className="space-y-1">
                    {/* Contenedor Padre Híbrido: Link + Toggle */}
                    <div className={cn(
                      "flex items-center justify-between gap-1 rounded-xl pr-1 transition-all group",
                      isActive && !isMenuOpen ? "bg-brand-800/50" : "hover:bg-brand-800/30"
                    )}>
                      {/* Zona de Navegación (Izquierda) */}
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex-1 flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive ? "text-white" : "text-brand-200 group-hover:text-white"
                        )}
                      >
                        {Icon && <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-brand-400 group-hover:text-white")} />}
                        <span className={cn("truncate", !Icon && "pl-8")}>{item.title}</span> {/* Padding si no hay icono */}
                      </Link>

                      {/* Zona de Despliegue (Derecha) */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleMenu(item.title);
                        }}
                        className="p-1.5 rounded-lg text-brand-400 hover:text-white hover:bg-brand-700/50 transition-colors"
                      >
                        <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isMenuOpen && "rotate-90")} />
                      </button>
                    </div>

                    {isMenuOpen && (
                      <div className="relative ml-4 pl-4 border-l border-brand-800 space-y-1 animate-in slide-in-from-top-1 duration-200">
                        {item.children?.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                                isChildActive
                                  ? "text-brand-300 bg-brand-900 font-bold"
                                  : "text-brand-400 hover:text-white hover:bg-brand-800/30"
                              )}
                            >
                              <div className={cn("h-1.5 w-1.5 rounded-full", isChildActive ? "bg-brand-400" : "bg-brand-700")}></div>
                              <span className="truncate">{child.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.disabled ? "#" : item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group",
                      isActive
                        ? "bg-brand-600 text-white shadow-lg shadow-brand-900/20 ring-1 ring-brand-500"
                        : "text-brand-200 hover:bg-brand-800/30 hover:text-white",
                      item.disabled && "cursor-not-allowed opacity-50"
                    )}
                  >
                    {Icon && <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-brand-400 group-hover:text-white")} />}
                    <span className={cn("truncate", !Icon && "pl-8")}>{item.title}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Usuario + Logout */}
        <div className="p-4 border-t border-brand-800 shrink-0 bg-brand-950/50">
           <div className="bg-brand-900/40 rounded-xl p-3 border border-brand-800/50">
              <div className="flex items-center gap-3 mb-3">
                 <div className="h-9 w-9 rounded-lg bg-brand-800 flex items-center justify-center text-brand-300 border border-brand-700">
                    <UserIcon className="h-5 w-5" />
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrador'}</p>
                    <p className="text-[10px] text-brand-400 truncate">{user?.email || 'admin@upeducacion.edu'}</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                 <Link href="/admin/configuracion" className="flex items-center justify-center gap-2 py-1.5 rounded-lg bg-brand-800/50 text-[10px] font-bold text-brand-300 hover:bg-brand-700 hover:text-white transition-colors">
                    <Settings className="h-3 w-3" /> Config
                 </Link>
                 <Link 
                    href="/login"
                    className="flex items-center justify-center gap-2 py-1.5 rounded-lg bg-brand-800/50 text-[10px] font-bold text-brand-300 hover:bg-brand-700 hover:text-white transition-colors"
                 >
                    <ArrowLeft className="h-3 w-3" /> Salir
                 </Link>
              </div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-[10px] font-black uppercase tracking-wider text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 hover:border-red-500"
              >
                <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
              </button>
           </div>
        </div>
      </aside>
    </>
  );
}
