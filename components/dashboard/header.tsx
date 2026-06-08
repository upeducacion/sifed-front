"use client";

import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  title?: string;
}

export function DashboardHeader({ setSidebarOpen, title = "Dashboard" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-white/80 px-6 backdrop-blur-xl transition-all">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden -ml-2 p-2 rounded-lg hover:bg-brand-50 text-brand-600 transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex-1">
        <h1 className="text-lg font-bold text-brand-950 truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-brand-50 text-muted-foreground hover:text-brand-600 transition-colors relative">
           <Bell className="h-5 w-5" />
           <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>
        {/* Aquí podría ir un Avatar de usuario más adelante o imagen */}
      </div>
    </header>
  );
}
